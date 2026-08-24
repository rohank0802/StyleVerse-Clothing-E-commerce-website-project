import Razorpay from "razorpay"
import { config } from "../config/config.js"

const razorpay=new Razorpay({
    key_id:config.RAZORPAY_KEY_ID,
    key_secret:config.RAZORPAY_KEY_SECRET
})

export const createOrder=async ({amount,currency="INR"})=>{
    const options={
        amount:Number(amount) *100,//razor pay take amount as a smallest currency that is 1rs =100paise  thats why we multipli amount with 100 ,to convert amount in paise.
        currency
    }
  
    const order=await razorpay.orders.create(options)

    return order
}