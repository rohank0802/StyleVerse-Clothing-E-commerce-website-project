import productModel from "../models/product.model.js";

export const stockOfVariant=async (productId,variantId)=>{
    const product=await productModel.findOne({
        _id:productId,
        "variants._id":variantId
    })
     if(!product){
        return null
     }
    const variant=product.variants.find(variant=>variant._id.toString()==variantId)
    if(!variant){
        return null
    }

    return variant.stock
}