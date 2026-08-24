import { Router } from "express";
import { authAccessUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";
import {validateAddTooCart,validateIncrementCartItemQuanity,validateDecrementCartItemQuanity,validateDeleteVarinatInCart} from "../validators/cart.validator.js"
import {addToCartController,getCartController,IncrementCartItemQunatity,decrementcartItemQuantity,deleteCartproductVariant,createOrderController,verifyOrderController} from "../controllers/cart.controller.js"
const cartRoute=Router()


/**
 * @route POST /api/cart/add/:productId/:variantId
 * @desc Add itme to cart
 * @access Private
 * @argument productId-ID of the product to add
 * @argument variantId-ID of the variant to add
 * @argument quantity -Quantity of the item to add (,default:1)
 */
cartRoute.post("/add/:productId/:variantId",authAccessUser,authorizeRoles("buyer"),validateAddTooCart,addToCartController)

/**
 * @route GET api/cart
 * @desc GET user' cart
 * @access Private
 */
cartRoute.get("/",authAccessUser,authorizeRoles("buyer"),getCartController)

/**
 * @route patch /api/cart/quantity/increment/:productId/:variantId
 * @desc Update item quantity in cart
 * @access private
 * @argument quantity New quantity of the item (required)
 */
cartRoute.patch("/quantity/increment/:productId/:variantId",authAccessUser,authorizeRoles("buyer"),validateIncrementCartItemQuanity,IncrementCartItemQunatity)


/**
 * @route patch /api/cart/quantity/decrement/:productId/:variantId
 * @desc Update item quantity in cart
 * @access private
 * @argument quantity decrease quantity of the item (required)
 */

cartRoute.patch("/quantity/decrement/:productId/:variantId",authAccessUser,authorizeRoles("buyer"),validateDecrementCartItemQuanity,decrementcartItemQuantity)

/**
 * @route patch /api/cart/variant/delete/:productId/:variantId
 * @desc delete variant in cart
 * @access private
 * @argument variant delete variant(required)
 */
cartRoute.delete("/variant/delete/:productId/:variantId",authAccessUser,authorizeRoles("buyer"),validateDeleteVarinatInCart,deleteCartproductVariant)


//payment 
/**
 * @route POST /api/cart/payment/create/order
 */
cartRoute.post("/payment/create/order",authAccessUser,authorizeRoles("buyer"),createOrderController)

cartRoute.post("/payment/verify/order",authAccessUser,authorizeRoles("buyer"),verifyOrderController)

export default cartRoute