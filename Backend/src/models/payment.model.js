import mongoose from "mongoose";

const paymentSchema=new mongoose.Schema({
    status:{
        type:String,
        enum:["pending","paid","failed"],
        default :"pending"
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
          
        },
        razorpay:{
            orderId:String,
            paymentId:String,
            signature:String

},
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"userDetails",
    required:true
},
orderItems:[
    {
        title:String,
        productId:mongoose.Schema.Types.ObjectId,
        variantId:mongoose.Schema.Types.ObjectId,
        quantity:Number,
        images:[{url:String}],
        description:String,
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
          
        },
    }
]
})


const paymentModel=mongoose.model("paymentDetails",paymentSchema)
export default paymentModel