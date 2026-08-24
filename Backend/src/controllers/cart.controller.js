import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import {stockOfVariant} from "../dao/product.dao.js"
import mongoose from "mongoose";
import {createOrder} from "../services/payment.service.js"
import {getCartDetails} from "../dao/cart.dao.js"
import paymentModel from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import {config} from "../config/config.js"
export const addToCartController=async(req,res)=>{
    try{

        const {productId ,variantId} =req.params
        const{quantity=1}=req.body
        
        //find product variant
        const product=await productModel.findOne({
            _id:productId,
            "variants._id":variantId
        })
        
        
        //product or variant doesn,t exist
        if(!product){
            return res.status(404).json({
                message:"product or variant not found",
                success:false
            })
        }

        const selectedVariant=product.variants.id(variantId)
        
        //calling function to find stock of selected variant
        const stock=await stockOfVariant(productId,variantId)
        
        if(stock===null){
            return res.status(404).json({
                message:"Variant not found",
                success:false
            })
        }
        
        //validate quantity come from req.body
        if(quantity<1){
            return res.status(400).json({
                message:"Quantity must be at least 1",
                success:false
            })
        }
        
        //find user's cart
        let cart=await cartModel.findOne({
            user:req.user.id
        })
        
        //if cart doesn't exist ,create it 
        if(!cart){
            cart =await cartModel.create({
                user:req.user.id,
                items:[]
            })
        }
        
        
        //check wether same product +variant already exists
        const existingItem=cart.items.find((item)=>item.product.toString()===productId.toString()&&item.variant?.toString()===variantId.toString())
        
        //if already axist
        if(existingItem){
            const newQuantity=existingItem.quantity+quantity
        
            //check total quantity against stock
            if(newQuantity>stock){
                return res.status(400).json({
                    message:`Only ${stock} item left in stock`,
                    success:false
                })
            }
            // imcrease existing items's quantity
            await cartModel.findOneAndUpdate(
                {
                    user:req.user.id,
                    "items.product":productId,
                    "items.variant":variantId
                },
                {
                    $inc:{
                        "items.$.quantity":quantity
                    }
                },
                {new:true}
            )
            return res.status(200).json({
                message:"Product quantity Increased successfully",
                success:true
            })
        }
        
        //if item doesn't exist,check requestr quantity against stock
        if(quantity>stock){
            return res.status(400).json({
                message:`only ${stock} items left in stock`,
                success:false
            })
        }
        
        // add new item to cart
        cart.items.push({
            product:productId,
            variant:variantId,
            quantity:quantity,
            price:{
                amount:selectedVariant.price.amount
            }
        })
        
        //save cart
        await cart.save()
        
        return res.status(200).json({
            message:"product added to cart successfully",
            success:true
        })
    }
    catch(error){
        return res.status(500).json({
            message:"internal server error",
            success:false,
            error:error.message
        })
    }

}

export const getCartController=async(req,res)=>{
try{
    const user =req.user

    let cart=await getCartDetails(user.id)
// let cart=await cartModel.findOne({user:user.id}).populate("items.product")

if(!cart){
   cart=await cartModel.create({user:user.id,items:[]})
}
if(!cart.items){
    cart.items=[]
}
//for get exact variant
//  cart.items.forEach((item)=>{
//     const selectedVariant=item.product.variants.find((variant)=>variant._id.toString()===item.variant.toString()
// )
// item.varinat=selectedVariant
//  })

 return res.status(200).json({
    seccess:true,
    cart
 })
}
catch(error){
return res.status(500).json({
    success:false,
    message:error.message
})
}
}


export const IncrementCartItemQunatity=async(req,res)=>{

    try{

        const {productId,variantId} =req.params
    
        const product=await productModel.findOne({
            _id:productId,
            "variants._id":variantId
        })
        if(!product){
            return res.status(404).json({
                message:"product or variant not found",
                success:false
            })
        }
    
        const cart=await cartModel.findOne({user:req.user.id})
        if(!cart){
            return res.status(404).json({
                message:"cart not found",
                success:false
            })
        }
    
        const stock=await stockOfVariant(productId,variantId)
    
        const itemquantityInCart=cart.items.find(item=>item.product.toString()===productId && item.variant?.toString()===variantId)?.quantity||0
    
        
        if(itemquantityInCart+1>stock){
    
            return res.status(400).json({
                message:`Only ${stock} items is left in the stock. and you already have ${itemquantityInCart} items in your cart`,
                success:false
            })
        }
    
       const updatedCart= await cartModel.findOneAndUpdate(
            {user:req.user.id,"items.product":productId,"items.variant":variantId},
            {$inc:{"items.$.quantity":1}},
            {new:true}
        )
      if(!updatedCart){
        return res.status(404).json({
            message:"Cart item not found",
            success:false
        })
      }

        return res.status(200).json({
            message:"Cart item quantity incremented successfully",
            success:true
        })
    }
    catch(error){
      return res.status(500).json({
        message:`${error.message}`,
        success:false
      })
    }

    
}

export const decrementcartItemQuantity=async(req,res)=>{
    try{
      const {productId,variantId} =req.params
    
        const product=await productModel.findOne({
            _id:productId,
            "variants._id":variantId
        })
        if(!product){
            return res.status(404).json({
                message:"product or variant not found",
                success:false
            })
        }
    
        const cart=await cartModel.findOne({user:req.user.id})
        if(!cart){
            return res.status(404).json({
                message:"cart not found",
                success:false
            })
        }
    
        const stock=await stockOfVariant(productId,variantId)
    
        const cartItem=cart.items.find(item=>item.product.toString()===productId && item.variant?.toString()===variantId)

        if(!cartItem){
            return res.status(404).json({
                message:"Cart item not found",
                success:false
            })
        }

        //don't allow quantity below 1
        if(cartItem.quantity<=1){
            return res.status(400).json({
                message:"Quantity cannot be less tha one",
                success:false
            })
        }

        //decrease quantity by 1
        const updatedCart= await cartModel.findOneAndUpdate(
            {user:req.user.id,"items.product":productId,"items.variant":variantId},
            {$inc:{"items.$.quantity":-1}},
            {new:true}
        )
      if(!updatedCart){
        return res.status(404).json({
            message:"Cart item not found",
            success:false
        })
      }

        return res.status(200).json({
            message:"Cart item quantity decremented successfully",
            success:true
        })
    }
    catch(error){
    return res.status(500).json({
        message:`${error.message}`,
        success:false
    })
    }
}


export const deleteCartproductVariant=async(req,res)=>{
    try{
     const {productId,variantId}=req.params

     //check product+variant
     const product=await productModel.findOne({
        _id:productId,
        "variants._id":variantId
     })

  if(!product){
    return res.status(404).json({
        message:"Product or variant not found",
        success:false
    })
  }


  //find user cart
  const cart=await cartModel.findOne({
    user:req.user.id
  })
  if(!cart){
     return res.status(404).json({
        message:"cart not found",
        success:false
    })
  }

  //check whether this exact product +variant in cart 

  const cartItem=cart.items.find(item=> item.product.toString()===productId &&item.variant.toString()===variantId)

  if(!cartItem){
     return res.status(404).json({
        message:"cart item not found",
        success:false
    })
  }

  //remove only the item

  const updatedCart=await cartModel.findOneAndUpdate({
    user:req.user.id
  },
   {
    $pull:{
        items:{
            product:productId,
            variant:variantId
        }
    }
   },
   {
    new:true
   }
)

    if(!updatedCart){
        return res.status(404).json({
            message:"Cart item not found",
            success:false
        })
      }

        return res.status(200).json({
            message:"Cart item deleted successfully",
            success:true
        })
 

    }
    catch(error){
  res.status(500).json({
    message:`${error.message}`,
    success:false
  })
    }
}


export const createOrderController=async(req,res)=>{

try{

    const cart =await getCartDetails(req.user.id)

    if(!cart){
        return res.status(400).json({
            message:"Cart is empty",
            success:false
        })
    }

   //before ceating order check stock avaiable

   for (const item of cart[0].items){
    if(item.product.variants.stock<item.quantity){
        return res.status(400).json({
            message:`${item.product.title} has only ${item.product.variants.stock} items available`,
            success:false
        })
    }
   }
    

 const order=await createOrder({amount:cart[0].totalcartItemsPrice
,currency:cart[0].currency})

const payment=await paymentModel.create({
    user:req.user.id,
    razorpay:{
        orderId:order.id,

    },
    price:{
        amount:cart[0].totalcartItemsPrice,
        currency:cart[0].currency
    },
    orderItems:cart[0].items.map(item=>{
        return{

            title:item.product.title,
            productId:item.product._id,
            variantId:item.variant,
            quantity:item.quantity,
            images:item.product.variants.images||item.product.images,
            description:item.product.description,
            price:{
                amount:item.product.variants.price.amount*item.quantity||item.product.price.amount,
                currency:item.product.variants.price.currency||item.product.price.currency
            }
        }

    })
})

 return res.status(200).json({
    message:"order successfull",
    success:true,
    order
 })
}
catch(error){
    return res.status(400).json({
        success:false,
        message:error?.message
    })
}
}

export const verifyOrderController=async(req,res)=>{
    try{

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        }=req.body
    
        const payment=await paymentModel.findOne({
            "razorpay.orderId":razorpay_order_id,
            status:"pending"
        })
        if(!payment){
            return res.status(400).json({
                message:"payment not found",
                success:false
            })
        }
    
        const isPaymentvalid=validatePaymentVerification({
            order_id:razorpay_order_id,
            payment_id:razorpay_payment_id,
            
        },razorpay_signature,config.RAZORPAY_KEY_SECRET)
    
        if(!isPaymentvalid){
            payment.status="failed"
            await payment.save()
    
            return res.status(400).json({
                message:"Payment verification failed",
                success:false
            })
        }

       //after successfull payement decrese the item from stock
       for(const item of payment.orderItems){
        const updateProduct=await productModel.findOneAndUpdate(
            {
              _id:item.productId,
              variants:{
                $elemMatch:{
                    _id:item.variantId,
                    stock:{$gte:item.quantity}
                }
              }
        },
       {
         $inc:{
            "variants.$.stock":-item.quantity
        }
       }
    );

    if(!updateProduct){
        return res.status(400).json({
            message:`Insifficient stock ${item.title}`,
            success:false
        })
    }
    //remove items from the cart
    await cartModel.updateOne({
     user:payment.user
    },
   {
     $pull:{
         items:{
          product:item.productId,
          variant:item.variantId
         }
     }
   }
 )
       }
           



//mark payment paid

        payment.status="paid"
        payment.razorpay.paymentId=razorpay_payment_id
        payment.razorpay.signature=razorpay_signature
    
        await payment.save()
    
        return res.status(200).json({
            message:"Payment verified successfully",
            success:true
        })
    }
    catch(error){
        res.status(500).json({
            message:error.message,
            success:false
        })
    }
}