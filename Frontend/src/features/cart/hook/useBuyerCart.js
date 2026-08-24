import { addItem, getCartItems, incrementCartItemApi, decrementCartItemApi, deleteCartItemApi,createcartOrder,verifyPaymentApi } from "../service/cart.service.js"
import { addItems as additemToCart, setCartItems, setCartLoading, setCartError, incrementCartItem, decrementCartItem, deletecartItem } from "../state/cart.slice.js"
import { useDispatch } from "react-redux"


export const useBuyerCart = () => {
    const dispatch = useDispatch()

    //for add item 
    const handleAddItem = async ({ productId, variantId }) => {
        try {
            const result = await addItem({ productId, variantId })
            if (result) {
                dispatch(additemToCart(result))
            }
        }
        catch (error) {
            throw error
        }
    }

    //for get item in cart
    const handleGetCartItems = async () => {
        try {
            dispatch(setCartLoading(true))
            const result = await getCartItems()
            if (result) {
                dispatch(setCartItems(result.cart))
            }
            
            return true

        }
        catch (error) {

            const message =
                error.response?.data?.message || error.message || "failed to et cart"
            dispatch(setCartError(message))
            return false
        }
        finally {
            dispatch(setCartLoading(false))
        }
    }

    async function handleIncrementCartItem(productId, variantId) {
        try {
            const result = await incrementCartItemApi(productId, variantId)
            if (result) {
                dispatch(incrementCartItem({ productId, variantId }))
            }
            return true
        }
        catch (error) {
            const message = error.response?.data?.message || error.message || "failed to increment cart item"
            return message
        }
    }

    async function handleDecrementCartItem(productId, variantId) {
        try {
            const result = await decrementCartItemApi(productId, variantId)
            if (result) {
                dispatch(decrementCartItem({ productId, variantId }))
            }
            return true
        }
        catch (error) {
            const message = error.response?.data?.message || error.message || "failed to decrement cart item"
            return message
        }
    }

    async function handleDeleteCartItem(productId, variantId) {
        try {
            const result = await deleteCartItemApi(productId, variantId)
            if (result) {
                dispatch(deletecartItem({ productId, variantId }))
            }
            return true
        }
        catch (error) {
            const message = error.response?.data?.message || error.message || "failed to delete cart item"
            return message
        }
    }

    async function handleCreateCartOrder(){
        try{
            const result=await createcartOrder()
            return result.order
        }
        catch(error){
            throw error
        }
    }

    async function handleVerifyPayment({razorpay_order_id,razorpay_payment_id,razorpay_signature}){
        try{
            const result=await verifyPaymentApi({razorpay_order_id,razorpay_payment_id,razorpay_signature})
            return result.success
        }
        catch(error){
            throw error
        }
    }

    return {
        handleAddItem, handleGetCartItems, handleIncrementCartItem, handleDecrementCartItem, handleDeleteCartItem,handleCreateCartOrder,handleVerifyPayment,handleVerifyPayment
    }
}

