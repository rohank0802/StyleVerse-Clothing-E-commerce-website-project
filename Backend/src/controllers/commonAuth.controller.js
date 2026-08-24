import userModel from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { config } from "../config/config.js";
import {emailVerifyJwt} from "../config/config.js"
import {sendEmail} from "../services/mail.service.js"


//verify email controller
async function verifyEmailController(req,res){
const {token}=req.query

try{
const decoded=jwt.verify(token,emailVerifyJwt.EMAIL_VERIFY_JWT)
const user=await userModel.findOne({email:decoded.email})
if(!user){
     return res.status(400).json({
            message:"Invalid Token",
            sucess:false,
            err:"user not found"
        })
}

if(user.verified){
    return res.send(`
     <h1>Email already verified </h1>
     <p>Your email is has already been verified</p>
     `)
}
user.verified=true
user.save()
 return res.send(`
        <h1>Email verified successfully</h1>
        <p>Your email has been verified.You can now login to your account</p>
         <a href="http://localhost:5173/login"> Go to Login</a>
        `)
    
    }
    catch(error){
       
   return res.status(500).json({
        success:false,
        message:"server error",
        error:error.message
    })
    }
}

// getme controller
async function getMeController(req,res){
    try{
        const user=await userModel.findById(req.user.id).select("-password -refreshToken");
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        };
        return res.status(200).json({
            success:true,
            user
        })
    }
    catch(error){
     return res.status(500).json({
        success:false,
        message:error.message
     })
    }
}

//refreshpage controller
async function refreshPageController(req,res){
    try{
         //getting refresh token for the cookie
        const refreshToken=req.cookies.refreshToken;
       if(!refreshToken){
        return res.status(401).json({
            success:false,
            message:"Refresh token missing"
        })
       }
        //verify jwt
        const decoded=jwt.verify(refreshToken,config.REFRESH_JWT)
       

        //finduser
        const user =await userModel.findById(decoded.id).select("+refreshToken")
          if(!user){
            return res.status(401).json({
                success:false,
                message:"user not found"
            })
          }
        //Compare with hashed token in db
        const isMatched=await bcrypt.compare(
            refreshToken,user.refreshToken
        )
        if(!isMatched){
             return res.status(401).json({
                success:false,
                message:"invalid refresh token"
            })
        }
        //generate NEW token
        const newAccessToken=user.generateAccessToken();
        const newRefreshToken=user.generateRefreshToken();

        //hash new refresh token
        const hashed=await bcrypt.hash(newRefreshToken,10)

        //save new hash token
        user.refreshToken=hashed
        await user.save({velidateBeforeSave:false})

        //replace cookie
        res.cookie("accessToken",newAccessToken,{httpOnly:true,sameSite:"strict",maxAge:15*60*1000});
        res.cookie("refreshToken",newRefreshToken,{httpOnly:true,sameSite:"strict",maxAge:7*24*60*1000});
  const safeUser=await userModel.findById(user._id)
       return  res.status(200).json({
          success:true,
          message:"logged in successful",
          safeUser
         })
    }
    catch(error){

     if(error.name==="TokenExpiredError"||error.name==="JsonWebTokenError"){
        return res.status(401).json({
            success:false,
            message:"Refresh token expired or failed"
        })
     }

       res.status(500).json({
        success:false,
        message:"internal server error",
        error:error.message
       })
    }
}

//logout controller
async function logoutController(req,res){
    try{
    const refreshToken=req.cookies.refreshToken;
    const accessToken=req.cookies.accessToken

    //verify access and refresh
    const decoded1=jwt.verify(refreshToken,config.REFRESH_JWT)
    const decoded2=jwt.verify(accessToken,config.ACCESS_JWT)

    const user= await userModel.findById(decoded1.id).select("+refreshToken")

    user.refreshToken=null
    await user.save({validateBeforeSave:false})

    res.clearCookie("accessToken",{
        httpOnly:true,sameSite:"strict"
    });
    res.clearCookie("refreshToken",{
            httpOnly:true,sameSite:"strict"
        })
        return res.status(200).json({
            success:true,
            message:"logged out successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"internal server error",
            error:error.message
        })
    }
}
export {
    getMeController,
    refreshPageController,
    logoutController,
    verifyEmailController
}