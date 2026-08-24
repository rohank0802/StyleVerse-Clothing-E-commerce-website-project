import axios from "axios";



const authApi=axios.create({
    baseURL:"/api",
    withCredentials:true
})

export const registerUser=async(user)=>{
    try {
        const res=await authApi.post("/auth/register",user)
        
        return res.data;
    } catch (error) {
      
        throw error;
    }
}


export const LoginUser=async(user)=>{
    try {
        const res=await authApi.post("/auth/login",user)
        return res.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const GetMeUser=async()=>{
    try {
        const res=await authApi.get("/auth/get-me")
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const RefreshPageUser=async()=>{
    try{
        const res=await authApi.get("/auth/refresh-page")
        return res.data;
    }catch(error){
        throw error;
    }
}

export const LogoutUser=async()=>{
    try{
        const res=await authApi.get("/auth/logout")
        return res.data;
    }catch(error){
        throw error;
    }
}