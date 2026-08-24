import {Router} from "express"
import {validateRegisterUserLocal,loginValidatorLocal} from "../validators/auth.validator.js"
import { registerLocal,loginControllerLocal,googleCallback} from "../controllers/auth.controller.js"
import {getMeController,refreshPageController,logoutController,verifyEmailController} from "../controllers/commonAuth.controller.js"
import {authAccessUser} from "../middlewares/auth.middleware.js"
import passport from "passport"
import { config } from "../config/config.js"


const authRouter=Router()


authRouter.post("/register",validateRegisterUserLocal,registerLocal)
authRouter.get("/verify-email",verifyEmailController)
authRouter.get("/google",passport.authenticate("google",{scope:["profile","email"]}))
authRouter.get("/google/callback",passport.authenticate("google",{session:false,failureRedirect:config.NODE_ENV==="development"?"http://localhost:5173/login":"/login"}),googleCallback)


//login controller
authRouter.post("/login",loginValidatorLocal,loginControllerLocal)
//getme controller
authRouter.get("/get-me",authAccessUser,getMeController)
//refresh page controller
authRouter.get("/refresh-page",refreshPageController)
//logout path
authRouter.get("/logout",logoutController)

export default authRouter

