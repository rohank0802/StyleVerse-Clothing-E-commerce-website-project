import mongoose from "mongoose"
import bcrypt from "bcrypt"
import {config}from "../config/config.js"
import jwt from "jsonwebtoken"
const userSchema=new mongoose.Schema({
    fullName:{
        type:String, required:true, trim:true, unique:false},
    contact:{
           type:String,
           required:function(){
            return this.provider==="local"
           },
           trim:true
    },
    email:{type:String, required:true, trim:true,unique:true,lowercase:true},
    password:{
        type:String,
        required:function(){
         return this.provider==="local"
        },
        minlength: 8,
        select:false
        
    },
    refreshToken:{type:String, default:null, select:false },
    verified:{type:Boolean, default:false },
    role:{
        type:String,
        enum:["buyer","seller"],
        default:"buyer"
    },
    provider:{type:String,enum:["local","google"],default:"local"},

    googleId:{
        type:String,default:null
    }
},{timestamps:true})

userSchema.pre("save",async function(){
    if(!this.isModified("password"))return;
    this.password=await bcrypt.hash(this.password,10)
})

userSchema.methods.comparePassword=async function(userPassword){
 return bcrypt.compare(userPassword,this.password)
}
//generating accessToken
userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        id:this._id,
        email:this.email,
        role:this.role
    },config.ACCESS_JWT,{expiresIn:"15m"})
}
//generating RefreshToken
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
       id:this._id,
       role:this.role
    },config.REFRESH_JWT,{expiresIn:"7d"})
}

const userModel=mongoose.model("userDetails",userSchema)

export default userModel