import { useDispatch } from "react-redux";
import { setUser,setError,setLoading } from "../auth.slice.js";

import { RefreshPageUser,GetMeUser,registerUser,LoginUser,LogoutUser } from "../service/auth.api.js";

export const useAuth=()=>{
    const dispatch=useDispatch()
  
async function handleRegister(user){
    try{
        dispatch(setLoading(true))
        const data=await registerUser(user)
        dispatch(setUser(data.message))
        console.log(data.message)
        return true
    }catch(error){
         const data=error.response?.data
            if(data?.errors){
                //express  validator error
                dispatch(setError(data.errors))
            }else{
                dispatch(setError(data?.message||error.message))
            }
            return false
    }
    finally{
        dispatch(setLoading(false))
    }
}

async function handleLogin(user){
    try{
        dispatch(setLoading(true))
        const data=await LoginUser(user)
        dispatch(setUser(data.user))
        console.log(data.user)
        return true
    }catch(error){
        const data=error.response?.data
        if(data?.errors){
            //express validator error
            dispatch(setError(data.errors))
        }else{
            dispatch(setError(data?.message||error.message))
        }
        return false
    }
    finally{
        dispatch(setLoading(false))
    }
}

async function handleLogout(){
    try{
        dispatch(setLoading(true))
        const data=await LogoutUser()
        dispatch(setUser(null))
    }catch(error){
        dispatch(setError(error))
    }
    finally{
        dispatch(setLoading(false))
    }
}

async function handlegetMeUser(){
    try{
        dispatch(setLoading(true))
        const data=await GetMeUser()
        dispatch(setUser(data.user))
        console.log(data.user)
    }catch(error){
        if(error.response?.status==401){
          try{
            await RefreshPageUser()
            const data=await GetMeUser()
            dispatch(setUser(data.user))
            console.log(data.user)
          }catch(refreshError){
            dispatch(setUser(null))
            return; 
          }
        }
        else{
            dispatch(setError(error.response?.data?.message||"Something went wrong"))
        }
    }
    finally{
        dispatch(setLoading(false))
    }
}
return{
    handleLogin,
    handleLogout,
    handleRegister,
    handlegetMeUser
}

}