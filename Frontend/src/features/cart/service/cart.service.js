import axios from "axios";

const cartApiInstance=axios.create({
    baseURL:"/api/cart",
    withCredentials:true
})

export const addItem=async({productId,variantId})=>{
 try{
const response =await cartApiInstance.post(`/add/${productId}/${variantId}`,
    {quantity:1}
)
return response.data
 }
 catch(error){
throw error
 }
}

export const getCartItems=async()=>{
    try{
        const response =await cartApiInstance.get(`/`)
        
        return response.data
    }
    catch(error){
        
        throw error
    }
}


export const incrementCartItemApi=async(productId,variantId)=>{
    try{
     const response=await cartApiInstance.patch(`/quantity/increment/${productId}/${variantId}`)
     return response.data
    }
    catch(error){
        throw error
    }
}

export const decrementCartItemApi=async(productId,variantId)=>{
    try{
     const response=await cartApiInstance.patch(`/quantity/decrement/${productId}/${variantId}`)
     return response.data
    }
    catch(error){
        throw error
    }
}

export const deleteCartItemApi=async(productId,variantId)=>{
    
    try{
     const response=await cartApiInstance.delete(`/variant/delete/${productId}/${variantId}`)
     return response.data
    }
    catch(error){
        throw error
    }
}


export const createcartOrder=async()=>{
    try{

        const response=await cartApiInstance.post("/payment/create/order")
        return response.data
    }
    catch(error){
        throw error
}
}


export const verifyPaymentApi=async({razorpay_order_id,razorpay_payment_id,razorpay_signature})=>{
    try{
        const response=await cartApiInstance.post("/payment/verify/order",{razorpay_order_id,razorpay_payment_id,razorpay_signature})
        return response.data
    }
    catch(error){
        throw error
    }
}