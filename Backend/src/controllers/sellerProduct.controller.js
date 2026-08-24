import { isObjectIdOrHexString } from "mongoose";
import productModel from "../models/product.model.js";
import {uploadFile} from "../services/storage.service.js"
import mongoose from "mongoose";


export async function createProductController(req,res){
try{
    const {title,description,price}=req.body
const seller=req.user

//check the image is uploaded in multer
if(!req.files||req.files.length===0){
return res.status(400).json({
    success:false,
    message:"Please upload at least 1 product image"
})
}

//upload all the image to image kit
const images=await Promise.all(req.files.map(async(file,index)=>{
    const uploadedImage= await uploadFile({
        buffer:file.buffer,
        fileName:file.originalname,
        folder:"StyleVerse/products"
    })
    return{
        url:uploadedImage.url,
        fileId:uploadedImage.fileId,
        alt:req.body.images?.[index]?.alt||`${title} - Image${index+1}`
    }
}))

//create product
const product=await productModel.create({
    title,description,
    price:{
        amount:price,currency:"INR"
    },
    seller:seller.id,
    images
})
return res.status(201).json({
    success:true,
    message:"Product created successfully",
    product
})
}
catch(error){
    console.log(error)
    res.status(500).json({
        success:false,
        message:error.message
    })
}
}


//get seller products

export async function getSellerProductsController(req,res){
    try{

        const sellerId=req.user.id

        const products=await productModel.find({
            seller:sellerId
        })
        
        return res.status(200).json({
            success:true,
            message:"products fetched successfully",
            products
        })
    }
    catch(error){
     return res.status(500).json({
        success:false,
        message:error.message
     })
    }
}




export async function getSellerProductDetailController(req,res){
try{
    const {id}=req.params
    const sellerId=req.user.id
    const product=await productModel.findOne({
        seller:sellerId,
        _id:id
    })
    if(!product){
        return res.status(404).json({
            success:false,
            message:"product not found or you are not the valid seller"
        })
    }
    return res.status(200).json({
        success:true,
        message:"detail fetched successfully",
        product
    })
}
catch(error){
return res.status(500).json({
    success:false,
    message:`${error.message}`
})
}
}

export async function addProductVariantController(req,res){
try{
// get productId from url
const {productId}=req.params

console.log("REQ PARAMS", req.params)
console.log("PRODUCT ID " ,productId);
console.log("PRODUCT LENGTH" ,productId?.length)
console.log( "ISVALID" , mongoose.Types.ObjectId.isValid(productId))

//check whether productId is valid mongoDB objectId
if(!mongoose.Types.ObjectId.isValid(productId)){
    return res.status(400).json({
        message:"invalid product Id"
    })
}

// Find the product
const product = await productModel.findById(productId)

if(!product){
    return res.status(404).json({
        success:false,
        message:"Product not found"
    })
}
//check whether this product belongs to loggen-in seller
if(product.seller.toString() !== req.user.id.toString()){
    return res.status(403).json({
        success:false,
        message:"you are not authorized to modify this product"
    })
}

//get variant data from req body
const {sku,color,size,stock,price,attributes}=req.body
// //parse prise is they came as a string
// const parsedPrice=typeof price==="string"?JSON.parse(price):price
// //parse attributes if they came as a string
// const parsedAttributes=typeof attributes==="string"?JSON.parse(attributes):attributes

//decide the price
//if variant price is provided use variant price
//otherwise use produt price
const variantPrice=price?.amount !==undefined ?{amount:Number(price.amount)}:{amount:product.price.amount}

//prepare images
let variantImages=[]

//if seller upload images
if(req.files&&req.files.length>0){
    variantImages=await Promise.all(
        req.files.map(async(file)=>{
            const result=await uploadFile({
                buffer:file.buffer,
                fileName:file.originalname,
                folder:"styleverse/variants"
            })
            return{
                url:result.url,
                fileld:result.fileId,
                alt:file.originalname
            }
        })
    )
}else{
    //no variant images-> use prduct images
     Variantimages=product.images
}

//create varient object
const variant={
sku,color,size,price:variantPrice,stock:Number(stock),attributes,images:variantImages

}
//add variant to product

product.variants.push(variant)

//save product
const updatedProduct=await product.save()

return res.status(201).json({
    success:true,
    message:"variant created successfully",
    variant
})

}
catch(error){
if(error.code===11000){
    return res.status(409).json({
        success:false,
        message:"SKU already exists"
    })
}
if(error.message==="variant SKU must be unique within this product"){
return res.status(409).json({
    success:false,
    message:error.message
})
}
return res.status(500).json({
    status:false,
    message:"failed to created variant",
    error:error.message
})
}
}
