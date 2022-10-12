const router = require("express").Router();
const bcrypt = require ("bcrypt");
const productSchema = require ("../ProductMangement/ProductModel");
const database = require ('../database/db');
const Product = require("./ProductModel");


//Create product

router.post("/addproduct" , async(req,res) =>{
 try{

    const productDetails = req.body
    const result = productSchema(productDetails)
    const newProduct = await result.save()
    return res.status(200).json({"status":"success", "message":"product added successfully", "result": newProduct})

 }catch(error){
    return res.status(400).json({"status":"failure","message":error.message})
 }
})

// read specific product

router.get("/getproduct", async(req,res) =>{
    try{        

        const productDetails = await productSchema.find(req.query).exec()
        return res.status(200).json({"status": "success", "message":"product fetched successfully", "result": productDetails})

    }catch(error){
        return res.status(400).json({"status":"failure","message":error.message}) 
    }
})

//read all product

router.get("/getallproduct", async(req,res) =>{
    try{        

        const productDetails = await productSchema.find().exec()
        return res.status(200).json({"status": "success", "message":"product fetched successfully", "result": productDetails})

    }catch(error){
        return res.status(400).json({"status":"failure","message":error.message}) 
    }
})

//update product

router.put("/updateproduct",async(req,res) =>{
    try{
    let condition = req.query
    let updateData = req.body
    let option = {new:true}
    const updateProduct = await productSchema.findOneAndUpdate(condition, updateData,option).exec()
    return res.status(200).json({"status": "success", "message":"product updated successfully", "result": option})
    } catch(error){
        return res.status(400).json({"status":"failure","message":error.message})
    }

})

//Delete Product

router.delete("/deleteproduct",async(req,res) =>{
    try{
        const productDetails = await productSchema.findOneAndDelete(req.query).exec()
        return res.status(200).json({"status": "success", "message":"product deleted successfully"})
    } catch(error){
        return res.status(400).json({"status":"failure","message":error.message})
    }   
    
})

//using aggregation

router.get("/specific-products" , async (req,res) => {
    try {
       let details = await productSchema.aggregate([
        {
            $match :{
                uuid : req.query.uuid
            }
        },
        {
            $lookup:{
                from:"products",
                localField:"uuid",
                foreignField:"uuid",
                as:"specific-product-details"
            }
        },
        {
            $unwind:{
                path : "$specific-product-details",
                preserveNullAndEmptyArrays : true
            }
        },
        {
            $project:{
                productName : 1,
                productCategory :1,
            }
        }
       ]) 
       console.log(details)

       if(details.length>=1){
        return res.status(200).json({status : "success", message : "details of specific products are fetched successfully", result : details})
       }else{
        return res.status(200).json({status : "failure", message : "product details not found"})
       }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({status : "failure", message : error.message})
    }
})


router.get("/filters", async (req,res) => {
    try {
        let h
        
    const filteredPrice = await productSchema.aggregate([
        {
            $match : {
                $and : [{ price : {
                    $gte : minPrice,
                    $lte : maxPrice
                 }}]
            }
        },{
            $sort : {price : 1}
        },{
            $project : {
                _id : 0,
                productName : 1,
                produductCategory : 1
            }
        }
    ])

    console.log("filteredPrice" , filteredPrice);
   return res.status(200).json({message : "products filtered successfully", result : filteredPrice})
} catch (error) {
        console.log(error.message);
        return res.status(500).json(error)
    }
})

module.exports = router;