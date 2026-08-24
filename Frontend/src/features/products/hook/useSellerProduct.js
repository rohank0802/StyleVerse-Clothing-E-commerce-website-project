import { createProductApi, getSellerProductApi, getSellerProductDetail, createSellerVariantApi} from "../services/sellerProduct.api.js"
import { useDispatch } from "react-redux"
import { setSellerProducts, setLoading, setError } from "../state/product.slice.js"
export const useSellerProduct = () => {
    const dispatch = useDispatch()
    const handleCreateProduct = async (productData) => {
        try {
            dispatch(setLoading(true))
            const response = await createProductApi(productData)
            dispatch(setSellerProducts(response.product))

            return true;
        } catch (error) {
            const data = error.response?.data
            if (data?.errors) {
                //express  validator error
                dispatch(setError(data.errors))
            } else {
                dispatch(setError(data?.message || error.message))
            }
            return false;
        }
        finally {
            dispatch(setLoading(false))
        }
    }

    const handleGetSellerProducts = async () => {
        try {
            dispatch(setLoading(true))
            const response = await getSellerProductApi()
            dispatch(setSellerProducts(response.products))

            return true;
        } catch (error) {
            dispatch(setError(error))
            return false;
        }
        finally {
            dispatch(setLoading(false))
        }
    }
  
    const handleGetSellerProductDetail=async(productId)=>{
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const response=await getSellerProductDetail(productId)
            dispatch(setSellerProducts(response.product))

            return true;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || error.message || "Failed to load product"))
            return false;
        }
        finally {
            dispatch(setLoading(false))
        }
    }

    const handleCreateSellerVariant=async(productId,variantData)=>{
        try {
            const response=await createSellerVariantApi(productId,variantData)
            return { success: true, variant: response.variant };
        } catch (error) {
            const data = error.response?.data
            let message = "Failed to create variant."
            if (data?.errors && Array.isArray(data.errors)) {
                message = data.errors.map((e) => e.msg || e.message).join(', ')
            } else if (data?.message) {
                message = data.message
            } else if (error.message) {
                message = error.message
            }
            return { success: false, message };
        }
    }

    return {
        handleCreateProduct,
        handleGetSellerProducts,
        handleGetSellerProductDetail,
        handleCreateSellerVariant
    }
}