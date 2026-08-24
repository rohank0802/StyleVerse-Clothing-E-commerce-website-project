import {getAllProducts,getProductdetail} from "../services/buyerProduct.api.js"
import { useDispatch } from "react-redux"
import {setProducts,setProductLoading,setProductError} from "../state/product.slice.js"

export const useBuyerProduct=()=>{
    const dispatch=useDispatch()
    const handleAllProducts=async()=>{
        try{
            dispatch(setProductLoading(true))
            const response=await getAllProducts()
            dispatch(setProducts(response))
            return true
        }
        catch(error){
            dispatch(setProductError(error))
            return false
        }
        finally{
            dispatch(setProductLoading(false))
        }
    }

    const handleProductdetail=async(productId)=>{
        try{
         
         const response=await getProductdetail(productId)
        
         return response.product
        }
        catch(error){
            
            return error
        }
       
    }
    return {
        handleAllProducts,
        handleProductdetail
    }
}