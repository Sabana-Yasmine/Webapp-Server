const crypto = require ("crypto");
const bcrypt = require("bcrypt");
const User = require ("../UserManagement/userModel");
const user = require ("../UserManagement/userModel");
const router = require("express").Router();

require('dotenv').config();
const nodemailer = require('nodemailer');


//SEND RESET PASSWORD LINK TO MAIL

  router.post('/forgotPassword',  (req, res) => {
    console.log("forgotPassword")
    if (req.body.email === '') {
      res.status(400).send('email required');
      console.log("email required");
    }
    console.error(req.body.email);
     User.findOne({ email: req.body.email }).then((user) => {
    if (user === null) {
        console.error('email not in database');
        res.status(403).send('email not in db');
      } else {

//GENERATE TOKEN
        const userToken = crypto.randomBytes(20).toString('hex');
     user.update({
          resetPassToken: userToken,
        
        });

//CREATING NODEMAILER TRANSPORT

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: `${process.env.EMAIL}`,
            pass: `${process.env.PASSWORD}`,
          },
        });

        const mailOptions = {
          from: 'sabana.pltosys@gmail.com',
          to: `${user.email}`,
          subject: 'Link To Reset Password',
          text:`http://localhost:2020/password/reset/${userToken}`            
        };

        console.log('sending mail');

        transporter.sendMail(mailOptions, (err, response) => {
          if (err) {
            console.error('there was an error: ', err);
          } else {
            console.log('here is the res: ', response);
            res.status(200).json('recovery email sent');
          }
        });
      }
    });
  });

  //RESET PASSWORD

  router.get('/reset', async (req, res) => {
     await User.findOne({resetPassToken: req.query.resetPassToken}).then((user) => {
      if (user == null) {
        console.error('password reset link is invalid');
        res.status(403).send('password reset link is invalid');
      } else {
        res.status(200).send({
          email: user.email,
          message: 'password reset link a-ok',
        });
      }
    });
  });

  //UPDATE NEW PASSWORD

  const salt = 12;
  
  router.put('/updatePassword', async (req, res) => {
    await User.findOne({ 
      email: req.body.email,
      resetPassToken: req.body.resetPassToken})
      .then(user => {
      if (user == null) {
        console.error('password reset link is invalid or has expired');
        res.status(403).send('password reset link is invalid or has expired');
      } else if (user != null) {
        console.log('user exists in db');
        bcrypt
          .hash(req.body.password, salt)
          .then(hashedPassword => {
            user.update({
              password: hashedPassword,
              resetPassToken: null,
            });
          })
          .then(() => {
            console.log('password updated');
            res.status(200).send({ message: 'password updated' });
          });
      } else {
        console.error('no user exists in db to update');
        res.status(401).json('no user exists in db to update');
      }
    });
  });
  
module.exports = router;
