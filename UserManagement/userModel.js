const mongoose = require("mongoose")
const crypto = require ("crypto")
const jwt = require ("jsonwebtoken");
const dotenv = require("dotenv");
require('dotenv').config();


const userSchema = new mongoose.Schema({

    uuid         : {type : String,  required : false },
    firstName    : {type : String,  required : false },
    lastName     : {type : String,  required : false },
    phoneNumber  : {type : Number,  required : false },
    email        : {type : String,  required : false },
    password     : {type : String,  required : false },
    resetPassToken    : {type : String},
    resetPassExpires  : {type : Date}
    
},{
    timeStamps : true
})


// UUID creation

userSchema.pre('save',function(next){
    this.uuid="USER-"+crypto.pseudoRandomBytes(5).toString('hex').toUpperCase()
    console.log(this.uuid);
    next();
});

//jsonwebtoken

// userSchema.methods.generateAuthToken = function(){
//     const usertoken = jwt.sign({USER:this.USER},process.env.JWTKEY,{expiresIn:"7D"});
//     return usertoken;
// };

const User = mongoose.model("user", userSchema)

module.exports = User;