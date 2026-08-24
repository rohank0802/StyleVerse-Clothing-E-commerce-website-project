
import axios from "axios";


const productApi=axios.create({
    baseURL:"/api/product",
    withCredentials:true
})



//getting all products
export const getAllProducts=async()=>{
    try{
        const response=await productApi.get("/")
        return response.data
    }
    catch(error){
        throw error
    }
}


export const getProductdetail=async(productId)=>{
    try{
        const response=await productApi.get(`/detail/${productId}`)
        return response.data
    }
    catch(error){
        throw error
    }
}