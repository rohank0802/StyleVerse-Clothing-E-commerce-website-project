import dotenv from "dotenv"
dotenv.config()

//mongodb envs
if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in environment variables")
}
if(!process.env.ACCESS_JWT){
    throw new Error("Access token is not defined in the environmental variable")
}
if(!process.env.REFRESH_JWT){
    throw new Error("Refresh token is not defined in the environmental variable")
}
if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw new Error("Imagekit private key  is not defined in the environmental variable")
}

export const config={
    MONGO_URI:process.env.MONGO_URI,
    ACCESS_JWT:process.env.ACCESS_JWT,
    REFRESH_JWT:process.env.REFRESH_JWT,
    NODE_ENV:process.env.NODE_ENV,
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY,

    RAZORPAY_KEY_ID:process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET:process.env.RAZORPAY_KEY_SECRET

}

//goolge mail services
if(!process.env.GOOGLE_CLIENT_SECRET &&process.env.GOOGLE_CLIENT_ID &&process.env.GOOGLE_REFRESH_TOKEN &&process.env.GOOGLE_USER){
 throw new Error("client id and client secret is  is not defined in environmental variables")
}

//razor pay check
if(!process.env.RAZORPAY_KEY_ID  || !process.env.RAZORPAY_KEY_SECRET){
    throw new Error("RAZORPAY id and secret is not defined in environmental variables")
}

export const mainConfig={
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN:process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_USER:process.env.GOOGLE_USER
}

//email verification jwt

export const emailVerifyJwt={
    EMAIL_VERIFY_JWT:process.env.EMAIL_VERIFY_JWT
}