import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js"
import { sendEmail } from "../services/mail.service.js"
import {emailVerifyJwt} from "../config/config.js"
import bcrypt from "bcrypt"

const sellerRegisterController=async(req,res)=>{
const {email,contact,password,fullName}=req.body

try{
const existingUser=await userModel.findOne({
    $or:[
        {email},
        {contact}
    ]
})
if(existingUser){
    return res.status(500).json({
        message:"user with this  email or conatct already exist"
    })
}

const user=await userModel.create({email,contact,password,fullName,role:"seller"})

const emailVerificationToken=jwt.sign({
    email:user.email
},emailVerifyJwt.EMAIL_VERIFY_JWT,{expiresIn:"1h"})

 await sendEmail({
        to:email,
        subject:"Welcome to StyleVerse",
        
        html:`<p>Hi ${fullName},</p>
        <p>Thank you from registring at <strong>StyleVerse</strong>.We're  We're excited to have you on board!</p>
        <p>Please verify your email address by clicking the link below</p>
          <a href="http://localhost:3000/api/auth/seller/verify-email?token=${emailVerificationToken}">Verify Email</a>
          <p>If you did not create an account, please ignore this email.</p>
        <p>Best regards,<br>The StyleVerse Team</p>`
    })
    return res.status(201).json({
        success:true,
        message:"user registration successfull.Please verify your email before login,Verification email is sent to your  register Email Id."
    })
}
catch(error){

return res.status(500).json(
    {
        message:"server error",
        success:false,
        error:error.message

    })
}
}


async function sellerloginController(req,res){
    try{

        const {email,contact,password}=req.body
        const user=await userModel.findOne({
            $or:[
                {email},
                {contact}
            ]
        }).select("+password")
        if(!user){
            return res.status(400).json({
                message:"Invalid email/username or password",
                success:false,
                err:"User not found"
            })
        }
        if(user.role !=="seller"){
            return res.status(403).json({
                success:false,
                message:"this is not a seller account"
            })
        }
        const matchPassword= await user.comparePassword(password)
        if(!matchPassword){
            return res.status(400).json({
                message:"Invalid credentials",
                success:false,
            })
        }
        if(!user.verified){
             return res.status(400).json({
                success:false,
                message:"Please verify your email befor login",
                err:"email not verified"
            })
        }
        //place access and rehresh tokens
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        
        const hashedRefreshToken=await bcrypt.hash(refreshToken,10);
        
        //storing only hashed refreh in db
        user.refreshToken=hashedRefreshToken
        await user.save({
            validateBeforeSave:false
        })
        
        //seding orignal refresh and acces token to browser
        res.cookie("refreshToken",refreshToken,{httpOnly:true,sameSite:"strict",maxAge:7*24*60*1000})
        res.cookie("accessToken",accessToken,{httpOnly:true,sameSite:"strict",maxAge:15*60*1000})

        return res.status(200).json({
            success:true,
            message:"logged in successfully",
            user:{
                id:user._id,
                fullname:user.fullName,
                contact:user.contact,
                email:user.email,
                role:user.role
            }
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:`internal server error :${error.message}`,
          
        })
    }
}

export {sellerRegisterController,
    sellerloginController

}