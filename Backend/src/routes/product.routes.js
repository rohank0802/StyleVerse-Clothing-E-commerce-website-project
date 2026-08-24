import {Router} from "express"
import { authorizeRoles } from "../middlewares/authorize.middleware.js"    
import { authAccessUser } from "../middlewares/auth.middleware.js"
import { createProductController,getSellerProductsController ,getSellerProductDetailController,addProductVariantController} from "../controllers/sellerProduct.controller.js"
import {getAllProducts,getProductDeatil} from "../controllers/buyerProduct.controller.js"
import {createProductVaidator,createVariantsvalidator} from "../validators/auth.validator.js"
import multer from "multer"
import {parseVariantData} from "../middlewares/sellerVariantParsing.middleware.js"

const upload=multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:7*1024*1024 //7MB
    }
})

const productRouter=Router()


//seller 
//create product route
productRouter.post("/createProduct",authAccessUser,authorizeRoles("seller"),upload.array("images",7),createProductVaidator,createProductController)

//view created products by perticular seller
productRouter.get("/viewProducts",authAccessUser,authorizeRoles("seller"),getSellerProductsController)

productRouter.get("/seller/detail/:id",authAccessUser,authorizeRoles("seller"),getSellerProductDetailController)

// @route post /api/seller/product/:productId/variants
productRouter.post("/seller/detail/:productId/variants",authAccessUser,authorizeRoles("seller"),upload.array("images",7),parseVariantData,createVariantsvalidator,addProductVariantController)

//user

productRouter.get("/",getAllProducts)

//get single product /api/product/detail/:id
productRouter.get("/detail/:id",getProductDeatil)

export default productRouter