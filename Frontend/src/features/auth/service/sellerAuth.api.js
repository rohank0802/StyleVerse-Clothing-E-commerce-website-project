import axios from "axios";



const authApi=axios.create({
    baseURL:"/api",
    withCredentials:true
})

export const SellerRegisterUser=async(user)=>{
    try {
        const res=await authApi.post("/auth/seller/register",user)
        
        return res.data;
    } catch (error) {
      
        throw error;
    }
}


export const SellerLoginUser=async(user)=>{
    try {
        const res=await authApi.post("/auth/seller/login",user)
        return res.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const SellerGetMeUser=async()=>{
    try {
        const res=await authApi.get("/auth/seller/get-me")
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const SellerRefreshPageUser=async()=>{
    try{
        const res=await authApi.get("/auth/seller/refresh-page")
        return res.data;
    }catch(error){
        throw error;
    }
}

export const SellerLogoutUser=async()=>{
    try{
        const res=await authApi.get("/auth/seller/logout")
        return res.data;
    }catch(error){
        throw error;
    }
}