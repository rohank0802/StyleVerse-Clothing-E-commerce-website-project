import {Router} from "express"
import {validateRegisterUserLocal,loginValidatorLocal} from "../validators/auth.validator.js"
import {sellerRegisterController,sellerloginController} from "../controllers/sellerAuth.controller.js"
import {getMeController,refreshPageController,logoutController} from "../controllers/commonAuth.controller.js"
import {verifyEmailController} from "../controllers/commonAuth.controller.js"
import {authAccessUser} from "../middlewares/auth.middleware.js"
const sellerAuthRoute=Router()

//register routes
sellerAuthRoute.post("/register",validateRegisterUserLocal,sellerRegisterController)
//mail varification route
sellerAuthRoute.get("/verify-email",verifyEmailController)

//login route
sellerAuthRoute.post("/login",loginValidatorLocal,sellerloginController)

//getme route
sellerAuthRoute.get("/get-me",authAccessUser,getMeController)

//refreshpage route
sellerAuthRoute.get("/refresh-page",refreshPageController)

//logout route
sellerAuthRoute.get("/logout",logoutController)

export default sellerAuthRoute