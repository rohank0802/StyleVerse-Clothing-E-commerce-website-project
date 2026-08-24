import nodemailer from "nodemailer"
import {mainConfig} from "../config/config.js"

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        type:"OAuth2",
        user:mainConfig.GOOGLE_USER,
        clientSecret:mainConfig.GOOGLE_CLIENT_SECRET,
        clientId:mainConfig.GOOGLE_CLIENT_ID,
        refreshToken:mainConfig.GOOGLE_REFRESH_TOKEN
    }
})

transporter.verify().then(()=>{
    console.log("Email transporter is ready to send email")
})
.catch((err)=>{
console.error("Email transporter verification failed",err.message)
})


export async function sendEmail({to,subject,html}) {
    const mailOptions={
        from:mainConfig.GOOGLE_USER,
        to,
        subject,
        html,
    }
    try{

        const details =await transporter.sendMail(mailOptions)
        console.log("email send",details)
    }
    catch(err){
        console.log(err.message)
        throw err
    }
}