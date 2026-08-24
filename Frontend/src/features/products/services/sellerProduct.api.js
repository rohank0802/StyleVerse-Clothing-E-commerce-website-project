import axios from "axios";


const productApi=axios.create({
    baseURL:"/api/product",
    withCredentials:true
})

export const createProductApi=async(data)=>{
    try{
        const response=await productApi.post("/createProduct",data)
        return response.data
    }catch(error){
        throw error;
    }
}


export const getSellerProductApi=async()=>{
    try{
        const response=await productApi.get("/viewProducts")
        return response.data
    }catch(error){
        throw error;
    }
}

export const getSellerProductDetail=async(productId)=>{
try{
    const response=await productApi.get(`/seller/detail/${productId}`)
    return response.data
}
catch(error){
    throw error
}
}

export const createSellerVariantApi=async(productId,variantData)=>{
    try{
        const response=await productApi.post(`/seller/detail/${productId}/variants`,variantData)
        return response.data
    }catch(error){
        throw error
    }
}

