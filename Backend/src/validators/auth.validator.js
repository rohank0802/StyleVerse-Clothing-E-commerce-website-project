import {body,validationResult} from "express-validator"

function validateRequest(req,res,next){
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next()
}



export const validateRegisterUserLocal=[
    body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("please provide a valid email"),
    
    body("contact")
    .notEmpty().withMessage("Contact is required")
    .matches(/^\d{10}$/).withMessage("contact must be a 10-digit number"),

    body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({min:8}).withMessage("Password must be at least 8 characters"),
    
    body("fullName")
    .notEmpty().withMessage("Full name is required")
    .isLength({min:3}).withMessage("Fullname must be at least 3 character long"),
    validateRequest

    
    
]
export const loginValidatorLocal=[
     body("email")
     .optional()
    .trim()
    .isEmail().withMessage("please provide a valid email"),
    
    body("contact")
    .optional()
    .matches(/^\d{10}$/).withMessage("contact must be a 10-digit number"),

    body("password")
    .notEmpty().withMessage("Password is required"),

    body()
    .custom((value)=>{
        if(!value.email && !value.contact){
            throw new Error("Email or contact is required");
        };
        return true;
    }),
    validateRequest
]

//createProduct validator

export const createProductVaidator=[
    body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({min:3,max:100})
    .withMessage("Title must be between 3 to 100 charactesrs"),

    body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({min:10})
    .withMessage("Description must be atleast 10 characters"),

    body("price")
    .notEmpty()
    .withMessage("price is required")
    .isFloat({min:0})
    .withMessage("Price must be greater than or equal to 0"),

    // body("price.c")
    // .optional()
    // .isIn(["INR","USD","EUR","GBP","JPY"])
    // .withMessage("Invalid currency"),

    // body("images")
    // .isArray({null:1})
    // .withMessage("At least one image is required"),

    // body("images.*.url")
    // .notEmpty()
    // .withMessage("image url is required")
    // .isURL()
    // .withMessage("Invalid image URL"),

    // body("Image.*.alt")
    // .trim()
    // .notEmpty()
    // .withMessage("Image alt text is required"),
     validateRequest

]

// variants validation 
export const createVariantsvalidator=[
    body("sku")
    .trim()
    .notEmpty()
    .withMessage("SKU is required"),

     body("color")
     .optional()
    .trim()
    .isLength({min:2,max:50})
    .withMessage("color must be between 2 and 50 characters"),

     body("size")
    .trim()
    .notEmpty()
    .isLength({min:1,max:20})
    .withMessage("size must be between 1 and 20 characters"),
    

     body("stock")
     .notEmpty()
     .withMessage('stock is required')
     .isInt({min:0})
    .withMessage("stock must be a non-negative integer"),

     body("price.amount")
     .optional()
    .isFloat({min:0})
    .withMessage("price must be greater than or equal to 0"),

     body("attributes")
    .optional()
    .isObject()
    .withMessage("Attributes must be an object")
    .custom((attributes)=>{
        for(const [key,values] of Object.entries(attributes)){
            if(typeof values !== "string"){
                throw new Error(`Attributes "${key}" must be string`)
            }
        }
        return true
    }),
    validateRequest

]