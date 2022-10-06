const router = require("express").Router();
const bcrypt = require ("bcrypt");
const User = require ("../UserManagement/userModel");
const jwt = require ("jsonwebtoken");

//USER REGISTRATION
router.post("/Register" , async (req,res)=>{
    try {
        let {firstName, lastName, phoneNumber, email, password} = req.body;
        if(firstName && lastName && phoneNumber && email && password){
        const user = await User.findOne({email:req.body.email});
        if(!user){
           
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashPassword = await bcrypt.hash(req.body.password,salt)
            await new User({...req.body,password:hashPassword}).save();
                 res.status(200).json({
                    status : true,
                    message : "User registed successfully"
                  })
        }else{
            res.status(200).json({
              status : false,
              message : "user already exists please login"
            })
         } }else{
            res.status(200).json({
              status : false,
              message : "please enter all values"
            })           
          }
  
          
    } catch (error) {
        console.log(error)
    }
})


router.post('/userlogin', async (req,res)=>{
    console.log(req.body)
    try{
      console.log("user logging in")
        let email = req.body .email
        let password = req.body.password
        await User.findOne({email:email}).then(data=>{
            bcrypt.compare(password,data.password,function(err,result){
                if(err){
                    return res.json({"err" : err.message})
                }
                if(result){
                    const usertoken = jwt.sign({data},process.env.JWTKEY,{expiresIn:"1h"});
                    console.log("token",usertoken)
                    return res.json({"status" : "success",usertoken})
                }else{
                    return res.json({status:"failed",message : "invalid password"})
                }
            })
        }).catch(err=>{
          return res.json({status :"failure" , message : err.message})
      })
  
    }catch(err){
        return res.json({"err" : err.message})
    }
  })
  





module.exports = router;