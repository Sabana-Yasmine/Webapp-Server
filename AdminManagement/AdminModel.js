const mongoose = require("mongoose")
const crypto = require ("crypto")
const jwt = require ("jsonwebtoken");
const dotenv = require("dotenv");
require('dotenv').config();


const adminSchema = new mongoose.Schema({

    uuid         : {type : String,  required : false },
    firstName    : {type : String,  required : false },
    lastName     : {type : String,  required : false },
    phoneNumber  : {type : Number,  required : false },
    email        : {type : String,  required : false },
    password     : {type : String,  required : false }
    
},{
    timeStamps : true
})


// UUID creation

adminSchema.pre('save',function(next){
    this.uuid="ADMIN-"+crypto.pseudoRandomBytes(5).toString('hex').toUpperCase()
    console.log(this.uuid);
    next();
});

//jsonwebtoken

// userSchema.methods.generateAuthToken = function(){
//     const usertoken = jwt.sign({USER:this.USER},process.env.JWTKEY,{expiresIn:"7D"});
//     return usertoken;
// };

const Admin = mongoose.model("admin", adminSchema)

module.exports = Admin;