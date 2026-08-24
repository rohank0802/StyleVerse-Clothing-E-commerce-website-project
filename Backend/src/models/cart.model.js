import mongoose, { Mongoose, Types } from "mongoose";

const cartSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userDetails",
        required:true
    },
    items:[
       {
         product: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"product",
            required:true
        },
        variant:{
            type:mongoose.Schema.Types.ObjectId,
        },
        quantity:{
            type:Number,
            required:true,
            min:1,
            default:1
        },
        price:{
            amount:{
                type:Number,
                required:true
            },
            currency:{   
            type:String,
            enum:["USD","EUR","GBP","JPY","INR"],
            default:"INR"
            }
          
        }
       }
    ]
})

const cartModel= mongoose.model('cart',cartSchema)
export default cartModel