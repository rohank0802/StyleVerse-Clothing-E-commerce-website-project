import {createSlice} from "@reduxjs/toolkit";

const productSlice=createSlice({
    name:"product",
    //for seller
    initialState:{
        sellerProducts:[],
        loading:false,
        error:null,

//for public market place
        products:[],
        productLoading:false,
        productError:null,
    },
    reducers:{
        //for seller
        setSellerProducts:(state,action)=>{
            state.sellerProducts=action.payload
        },
        setLoading:(state,action)=>{
            state.loading=action.payload
        },
        setError:(state,action)=>{
            state.error=action.payload
        },

        //for public market place
        setProducts:(state,action)=>{
            state.products=action.payload
        },
        setProductLoading:(state,action)=>{
            state.productLoading=action.payload
        },
        setProductError:(state,action)=>{
            state.productError=action.payload
        }
    }
})

export const {setSellerProducts,setLoading,setError,setProducts,setProductLoading,setProductError}=productSlice.actions
export default productSlice.reducer