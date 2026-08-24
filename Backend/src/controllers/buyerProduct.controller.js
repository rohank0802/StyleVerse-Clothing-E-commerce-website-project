import productModel from "../models/product.model.js"
//for user protuct
export async function getAllProducts(req,res){
    try{

        const products=await productModel.find().populate("seller","fullName")
    
        return res.status(200).json({
            success:true,
            products
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:`${error.message}`
        })
    }
}

export async function getProductDeatil(req,res){
    try{

        const {id}=req.params
        const product=await productModel.findById(id).populate("seller","fullName")
        if(!product){
            return res.status(404).json({
                message :"product not found",
                status:false
            })
        }
        return res.status(200).json({
            message:"Product fetched successdully",
            success:true,
            product
        })
    }
    catch(error){
     return res.status(500).json({
        message:`${error.message}`,
        success:false
     })
    }

 
}