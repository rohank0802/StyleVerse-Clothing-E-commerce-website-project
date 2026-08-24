import express from "express"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import productRouter from "./routes/product.routes.js"
import sellerAuthRoute from "./routes/sellerAuth.routes.js"
import cartRoute from "./routes/cart.routes.js"
// import cors from "cors"

import passport from "passport"
import { Strategy as GoogleStrategy  } from  "passport-google-oauth20"
import { mainConfig } from "./config/config.js"

const app=express()
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
// app.use(cors({
//     origin:"http://localhost:5173",credentials:true,
//     methods:["GET","POST","PUT","DELETE"]
// }))


app.use(passport.initialize())
passport.use(new GoogleStrategy({
    clientID:mainConfig.GOOGLE_CLIENT_ID,
    clientSecret:mainConfig.GOOGLE_CLIENT_SECRET,
    callbackURL:"/api/auth/google/callback"
},(accessToken,refreshToken,profile,done)=>{
    return done(null,profile)
}))

//buyer auth route
app.use("/api/auth",authRouter)

//seller auth route
app.use("/api/auth/seller",sellerAuthRoute)


app.use("/api/product",productRouter)


// cart route
app.use("/api/cart",cartRoute)

export default app