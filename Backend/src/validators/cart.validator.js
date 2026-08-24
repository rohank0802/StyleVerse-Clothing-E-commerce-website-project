import {param,body,validationResult} from "express-validator"
const validateCartRequest=(req,res,next)=>{
    const errors=validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next()
}

export const validateAddTooCart=[
    param("productId").isMongoId().withMessage("Invalid product iD"),
    param("variantId").optional().isMongoId().withMessage("Invalid variant ID"),
    body("quantity").optional().isInt({min:1}).withMessage("Quantity must be at least 1"),
    validateCartRequest
]

export const validateIncrementCartItemQuanity=[
    param("productId").isMongoId().withMessage("Invalid ProductId"),
     param("variantId").optional().isMongoId().withMessage("Invalid variant ID"),
     validateCartRequest
]

export const validateDecrementCartItemQuanity=[
    param("productId").isMongoId().withMessage("Invalid ProductId"),
     param("variantId").optional().isMongoId().withMessage("Invalid variant ID"),
     validateCartRequest
]

export const validateDeleteVarinatInCart=[
    param("productId").isMongoId().withMessage("Invalid ProductId"),
     param("variantId").optional().isMongoId().withMessage("Invalid variant ID"),
     validateCartRequest
]