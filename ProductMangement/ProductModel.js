const mongoose = require("mongoose")
const crypto = require ("crypto")

const productSchema = new mongoose.Schema({

    uuid : { type : String, required : false },
    
    productCategory : {type : String , required : true},

    productName : {type : String , required : true},

    price : {type : Number , required :true},

    quantity : {type : Number , required : true},

},{
     timeStamps : true,
})

// UUID creation

productSchema.pre('save',function(next){
    this.uuid="PRODUCT-"+crypto.pseudoRandomBytes(5).toString('hex').toUpperCase()
    console.log(this.uuid);
    next();
});

const product = mongoose.model("product", productSchema)

module.exports = product;