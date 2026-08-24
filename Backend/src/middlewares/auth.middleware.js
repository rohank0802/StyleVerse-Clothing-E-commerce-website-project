import jwt from "jsonwebtoken";
import {config} from "../config/config.js"
export const authAccessUser=async(req,res,next)=>{
    try{
        const accessToken=req.cookies.accessToken;
  
        if(!accessToken){
            return res.status(401).json({
                success:false,
                message:"Access token missing"
            })
        };

        const decoded=jwt.verify(accessToken,config.ACCESS_JWT)
        req.user=decoded
        next()
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"access token expired",
            err:error.message
        })
    }
}