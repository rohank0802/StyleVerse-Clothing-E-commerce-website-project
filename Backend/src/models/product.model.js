import mongoose from "mongoose"

const varientSchema=new mongoose.Schema({
    sku:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    color:{
        type:String,
        trim:true
    },
    size:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        amount:{
            type:Number,
            
            min:0,
        },
        currency:{
            type:String,
            enum:["INR","USD","EUR","GBP","JPY"],
            default:"INR"
        },
    },
    stock:{
        type:Number,
        required:true,
        min:0
    },
    attributes:{
        type:Map,
        of:String
    },
    images:[
        {
            url:{
                type:String,
                
            },
            field:{
                type:String,
                
            },
            alt:{
                type:String,
                
            },
        },
    ],
},{_id:true})

const productSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userDetails",
        required:true
    },
    price:{
        amount:{
            type:Number,
            required:true
        },
        currency:{
            type:String,
            enum:["INR","USD","EUR","GBP","JPY"],
            default:"INR"
        },
    },
    images:[
        {
            url:{
                type:String,
                required:true
            },
                fileId:{
                    type:String,
                    required:true
                },
            
            alt:{
                type:String,
                required:true
            }
        }
    ],
    variants:[varientSchema]

},{timestamps:true})

productSchema.pre("validate",function(){
    const skus=this.variants.map(variant=>variant.sku);
if(new Set(skus).size !==skus.length){
    
      throw new Error("variant SKU must be unique within this product")
    
}
})

const productModel=mongoose.model('product',productSchema)

export default productModel