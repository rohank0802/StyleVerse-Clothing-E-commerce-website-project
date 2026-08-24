import { createSlice } from "@reduxjs/toolkit";



const cartSlice=createSlice({
name:"cart",
initialState:{
    totalPrice:null,
    currency:null,
    items:[],//array of products
    cartLoading:false,
    cartError:null,
},
reducers:{
    
    addItems:(state,action)=>{
        state.items.push(action.payload)
        
    },
    setCartItems:(state,action)=>{
        const cart=action.payload[0]
        state.items=action.payload,
        state.totalPrice=cart.totalcartItemsPrice,
        state.currency=cart.currency
    },
    setCartLoading:(state,action)=>{
        state.cartLoading=action.payload
    },
    setCartError:(state,action)=>{
        state.cartError=action.payload
    },
    incrementCartItem:(state,action)=>{
        const {productId,variantId}=action.payload
        state.items=state.items.map(item=>{
            const itemVariantId=typeof item.variant==="object"?item.variant?._id:item.variant
            if(item.product?._id===productId && itemVariantId === variantId){
                return {
                    ...item,quantity:item.quantity+1
                }
            }
            else{
                return item
            }
        })
    },
    decrementCartItem:(state,action)=>{
        const {productId,variantId}=action.payload

        state.items=state.items.map(item=>{
            const itemVariantId=typeof item.variant==="object"?item.variant?._id:item.variant
            if(item.product?._id===productId&& itemVariantId===variantId){
                return {
                    ...item,quantity:item.quantity-1
                }
            }
            else{
                return item
            }
        })
    },
    deletecartItem:(state,action)=>{
        const {productId,variantId}=action.payload
        state.items=state.items.filter(item=>{
            const itemVariantId=typeof item.variant==="object"?item.variant?._id:item.variant
           if(item.product?._id===productId &&itemVariantId===variantId){
               return false
           }
           return true
        })
    }
}
})

export const {addItems,setCartItems,setCartLoading,setCartError,incrementCartItem,decrementCartItem,deletecartItem}=cartSlice.actions
export default cartSlice.reducer

