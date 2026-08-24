import jwt from "jsonwebtoken";
import {config} from "../config/config.js"


export const authorizeRoles=(...roles)=>{
return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return res.status(403).json({
        message:"Access Denied"
      })
    }
    next()
}
}