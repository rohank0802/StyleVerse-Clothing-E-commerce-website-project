import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useBuyerCart } from '../hook/useBuyerCart.js'
import { useBuyerProduct } from '../../products/hook/useBuyerProduct.js'
import { useRazorpay, } from "react-razorpay";

/**
 * CartPage Component (Buyer View)
 * --------------------------------------------------------------------------
 * Premium luxury shopping cart interface designed following StyleVerse editorial guidelines.
 * Displays items fetched via handleGetCartItems(), handles populated variant objects,
 * calculates total pricing, compares current live product/variant prices from ProductDetail API,
 * and handles loading and error states from Redux.
 */
function CartPage() {

const { error, isLoading, Razorpay } = useRazorpay();
const navigate=useNavigate()
  // ── 1. Extract Cart state from Redux Store ───────────────────────────────
  const rawCartItems = useSelector((state) => state.cart.items)
  const totalPrice = useSelector((state) => state.cart.totalPrice)
  const currency = useSelector((state) => state.cart.currency)
  const isLoadingg = useSelector((state) => state.cart.cartLoading)
  const errorr = useSelector((state) => state.cart.cartError)
  const user=useSelector((state)=>state.auth.user)
  // ── Helper: Safely extract array of cart items from any nested response structure ──
  const getCartItemsList = (rawState) => {
    if (!rawState) return []
    // 1. Direct array of items or array of cart container objects
    if (Array.isArray(rawState)) {
      if (rawState.length > 0 && rawState[0] && Array.isArray(rawState[0].items)) {
        return rawState[0].items
      }
      return rawState
    }
    // 2. Object with cart array like { cart: [ { items: [...] } ] }
    if (Array.isArray(rawState.cart)) {
      if (rawState.cart.length > 0 && rawState.cart[0] && Array.isArray(rawState.cart[0].items)) {
        return rawState.cart[0].items
      }
      return rawState.cart
    }
    // 3. Object with items array like { items: [...] }
    if (Array.isArray(rawState.items)) {
      return rawState.items
    }
    return []
  }

  const cartItems = getCartItemsList(rawCartItems)

  // ── 2. Extract Cart Action Handlers from useBuyerCart custom hook ────────
  const { 
    handleGetCartItems, 
    handleIncrementCartItem, 
    handleDecrementCartItem, 
    handleDeleteCartItem ,handleCreateCartOrder,handleVerifyPayment
  } = useBuyerCart()

//for order checkout button
async function  handleCheckout(){
  const order=await handleCreateCartOrder()
  console.log(order)


 const options = {
      key: "rzp_test_TSnDWdTZqa3o3g",
      amount: order.amount, // Amount in paise
      currency: order.currency,
      name: "StyleVerse",
      description: "Test Transaction",
      order_id: order.id, // Generate order_id on server
      handler: async(response) => {
        const idValid=await handleVerifyPayment(response)
        if(idValid){
          navigate(`/OrderPaySuccess?order_id=${response.razorpay_order_id}`)
        }
      },
      prefill: {
        name: user?.fullName,
        email: user?.email,
        contact: user.contact,
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();

}

  // Extract handleProductdetail to fetch live product details for price comparison
  const { handleProductdetail } = useBuyerProduct()

  // ── 3. Local State to store live product/variant details from API ───────
  const [latestProductsMap, setLatestProductsMap] = useState({})

  // ── 4. Fetch cart items on initial component mount ────────────────────────
  useEffect(() => {
    handleGetCartItems()
  }, [])

  // ── Helper: Safely extract Product ID string ─────────────────────────────
  const getProductId = (item) => {
    if (!item) return null
    if (typeof item.product === 'object' && item.product !== null) {
      return item.product._id || item.product.id || null
    }
    if (typeof item.product === 'string') {
      return item.product
    }
    return null
  }

  // ── Helper: Safely extract Variant ID string ─────────────────────────────
  const getVariantId = (item) => {
    if (!item) return null
    if (typeof item.variant === 'object' && item.variant !== null) {
      return item.variant._id || item.variant.id || null
    }
    if (typeof item.variant === 'string') {
      return item.variant
    }
    if (item.product && typeof item.product === 'object' && item.product.variants) {
      if (typeof item.product.variants === 'object' && !Array.isArray(item.product.variants)) {
        return item.product.variants._id || item.product.variants.id || null
      }
    }
    return null
  }

  // ── 5. Fetch live ProductDetail data to compare current variant prices ────
  useEffect(() => {
    async function fetchLatestProducts() {
      if (!cartItems || cartItems.length === 0) return

      // Collect unique product IDs from all cart items
      const productIds = Array.from(
        new Set(
          cartItems
            .map((item) => getProductId(item))
            .filter(Boolean)
        )
      )

      if (productIds.length === 0) return

      // Fetch fresh details for all unique products concurrently using Promise.all
      const map = {}
      await Promise.all(
        productIds.map(async (id) => {
          try {
            const detail = await handleProductdetail(id)
            if (detail && detail._id) {
              map[detail._id] = detail
            }
          } catch (e) {
            // Silently swallow fetch errors for individual products
          }
        })
      )
      setLatestProductsMap(map)
    }

    fetchLatestProducts()
  }, [cartItems])

  // ── Helper: Read price directly from backend cart item data ────────────────
  const getItemPrice = (item) => {
    if (!item) return 0

    // 1. Direct price from backend item object (item.price.amount or item.price number)
    if (item.price !== undefined && item.price !== null) {
      const p = typeof item.price === 'object' ? item.price.amount : Number(item.price)
      if (p !== undefined && p !== null && !isNaN(p) && p > 0) {
        return p
      }
    }

    // 2. Price from populated product.variants object (if variants is an object)
    if (item.product?.variants && typeof item.product.variants === 'object' && !Array.isArray(item.product.variants)) {
      const p = typeof item.product.variants.price === 'object' ? item.product.variants.price.amount : Number(item.product.variants.price)
      if (p !== undefined && p !== null && !isNaN(p) && p > 0) {
        return p
      }
    }

    // 3. Price from populated item.variant object
    if (typeof item.variant === 'object' && item.variant?.price) {
      const p = typeof item.variant.price === 'object' ? item.variant.price.amount : Number(item.variant.price)
      if (p !== undefined && p !== null && !isNaN(p) && p > 0) {
        return p
      }
    }

    // 4. Fallback to product.price from backend
    if (item.product?.price !== undefined && item.product?.price !== null) {
      const p = typeof item.product.price === 'object' ? item.product.price.amount : Number(item.product.price)
      if (p !== undefined && p !== null && !isNaN(p) && p > 0) {
        return p
      }
    }

    return 0
  }

  // ── Helper: Read live current variant price from ProductDetail API ─────────
  const getFreshVariantPrice = (item) => {
    const productId = getProductId(item)
    if (!productId || !latestProductsMap[productId]) return null

    const freshProduct = latestProductsMap[productId]
    const variantId = getVariantId(item)

    // Search for variant in fresh product details
    const freshVariant = Array.isArray(freshProduct.variants)
      ? freshProduct.variants.find((v) => v._id === variantId || v.id === variantId)
      : (typeof freshProduct.variants === 'object' ? freshProduct.variants : null)

    // Check variant price first
    if (freshVariant?.price) {
      const p = typeof freshVariant.price === 'object' ? freshVariant.price.amount : Number(freshVariant.price)
      if (p !== undefined && p !== null && !isNaN(p) && p > 0) return p
    }

    // Fallback to fresh base product price
    if (freshProduct.price) {
      const p = typeof freshProduct.price === 'object' ? freshProduct.price.amount : Number(freshProduct.price)
      if (p !== undefined && p !== null && !isNaN(p) && p > 0) return p
    }

    return null
  }

  const calculatedSubtotal = cartItems.reduce((acc, item) => {
    const price = getItemPrice(item)
    return acc + price * (item.quantity || 1)
  }, 0)

  const subtotal = (totalPrice !== null && totalPrice !== undefined && !isNaN(Number(totalPrice))) ? Number(totalPrice) : calculatedSubtotal
  const currencySymbol = (currency === 'USD' || (cartItems.length > 0 && cartItems[0].price?.currency === 'USD')) ? '$' : '₹'
  const totalAmount = subtotal

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-12" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ── BREADCRUMB / BACK LINK ────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continue Shopping
          </Link>
          <span className="text-xs text-slate-400 font-medium">StyleVerse Buyer Experience</span>
        </div>

        {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-normal text-slate-900 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Your Shopping Cart
            </h1>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full shadow-xs">
              {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Free shipping on orders over ₹1,000
          </p>
        </div>

        {/* ── LOADING STATE ────────────────────────────────────────────── */}
        {isLoadingg && (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 flex flex-col items-center justify-center gap-4 text-center shadow-xs">
            <div className="w-10 h-10 border-3 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-600 text-sm font-medium">Fetching your curated cart items...</p>
          </div>
        )}

        {/* ── ERROR STATE ──────────────────────────────────────────────── */}
        {!isLoadingg && errorr && cartItems.length > 0 && (
          <div className="bg-rose-50/80 rounded-3xl border border-rose-200 p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Unable to Load Shopping Cart</h3>
            <p className="text-xs text-rose-600 max-w-md">{errorr}</p>
            <button
              onClick={handleGetCartItems}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── EMPTY CART STATE ─────────────────────────────────────────── */}
        {!isLoadingg && cartItems.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 flex flex-col items-center justify-center text-center space-y-5 shadow-xs">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                Your cart is empty
              </h2>
              <p className="text-slate-500 text-sm max-w-sm">
                Explore our luxury marketplace to discover curated apparel from independent designers.
              </p>
            </div>
            <Link
              to="/"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs uppercase tracking-widest font-semibold rounded-2xl transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              Discover Collections
            </Link>
          </div>
        )}

        {/* ── CART CONTENT (LIST + ORDER SUMMARY) ───────────────────────── */}
        {!isLoadingg && !errorr && cartItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* ── LEFT COLUMN: CART ITEMS LIST (8 cols) ────────────────── */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => {
                const product = typeof item.product === 'object' && item.product !== null ? item.product : {}
                const productId = getProductId(item)
                const variantId = getVariantId(item)
                
                // Resolve variant object (whether populated as object inside item.variant, product.variants, or in array)
                let variantObj = null
                if (typeof item.variant === 'object' && item.variant !== null) {
                  variantObj = item.variant
                } else if (product.variants && typeof product.variants === 'object' && !Array.isArray(product.variants)) {
                  variantObj = product.variants
                } else if (Array.isArray(product.variants)) {
                  variantObj = product.variants.find((v) => v._id === variantId || v.id === variantId) || null
                }

                // Resolve image (variant image fallback to product image)
                let displayImg = null
                if (variantObj && Array.isArray(variantObj.images) && variantObj.images.length > 0) {
                  displayImg = typeof variantObj.images[0] === 'object' ? variantObj.images[0].url : variantObj.images[0]
                } else if (product && Array.isArray(product.images) && product.images.length > 0) {
                  displayImg = typeof product.images[0] === 'object' ? product.images[0].url : product.images[0]
                }

                // Resolve prices
                const cartPrice = getItemPrice(item)
                const freshPrice = getFreshVariantPrice(item)
                const itemSubtotal = cartPrice * (item.quantity || 1)

                return (
                  <div
                    key={item._id || `${productId}-${variantId}`}
                    className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-indigo-200 transition-all duration-200 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between relative"
                  >
                    {/* Top Right Cross Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteCartItem(productId, variantId)}
                      className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 border border-slate-200 flex items-center justify-center transition-all cursor-pointer shadow-2xs z-10"
                      aria-label="Remove item"
                      title="Remove item"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Item Thumbnail & Basic Info */}
                    <div className="flex items-center gap-4 sm:gap-5 flex-1 pr-6 sm:pr-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-indigo-50/50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center relative">
                        {displayImg ? (
                          <img
                            src={displayImg}
                            alt={product.title || 'Product'}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Link
                          to={`/products/${productId}`}
                          className="text-base sm:text-lg font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
                          style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                          {product.title || 'Untitled Product'}
                        </Link>

                        {/* Variant Badges (Color, Size, SKU) */}
                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          {variantObj?.color && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
                              Color: {variantObj.color}
                            </span>
                          )}
                          {variantObj?.size && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
                              Size: {variantObj.size}
                            </span>
                          )}
                          {variantObj?.sku && (
                            <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                              SKU: {variantObj.sku}
                            </span>
                          )}
                        </div>

                        {/* Stock Status */}
                        <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 pt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          In Stock & Ready to Ship
                        </div>

                        {/* Price Difference Alert (Green if price decreased, Red if price increased) */}
                        {freshPrice !== null && freshPrice < cartPrice && (
                          <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Buy now price is less than current cart price ({currencySymbol}{freshPrice.toLocaleString('en-IN')})</span>
                          </div>
                        )}

                        {freshPrice !== null && freshPrice > cartPrice && (
                          <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            <span>The price of this variant is increased (Current: {currencySymbol}{freshPrice.toLocaleString('en-IN')}). Hurry up!</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Item Subtotal */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 gap-4 sm:pr-10">
                      
                      {/* Price Display */}
                      <div className="text-right">
                        <span className="text-lg font-bold text-indigo-600">
                          {currencySymbol}{itemSubtotal.toLocaleString('en-IN')}
                        </span>
                        {item.quantity > 1 && (
                          <p className="text-[11px] text-slate-400">
                            {currencySymbol}{cartPrice.toLocaleString('en-IN')} each
                          </p>
                        )}
                      </div>

                      {/* Quantity Selector with Minus & Plus Buttons */}
                      <div className="flex items-center gap-1 bg-slate-100/80 border border-slate-200 rounded-xl p-1">
                        <button
                          onClick={() => handleDecrementCartItem(productId, variantId)}
                          type="button"
                          className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-900">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => handleIncrementCartItem(productId, variantId)}
                          type="button"
                          className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                        >
                          +
                        </button>
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── RIGHT COLUMN: ORDER SUMMARY (4 cols) ─────────────────── */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 sticky top-24">
                
                <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Order Summary
                </h2>

                {/* Subtotal & Shipping */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">{currencySymbol}{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-semibold uppercase text-xs">FREE</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="pt-4 border-t border-slate-200 flex items-baseline justify-between">
                  <div>
                    <span className="text-base font-bold text-slate-900 block">Total</span>
                    <span className="text-[10px] text-slate-400">Inclusive of all applicable taxes</span>
                  </div>
                  <span className="text-2xl font-bold text-indigo-600">
                    {currencySymbol}{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                onClick={handleCheckout}
                  type="button"
                  className="w-full h-13 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-2xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Proceed to Checkout
                </button>

                {/* Trust Badges */}
                <div className="pt-2 flex items-center justify-center gap-4 text-slate-400 text-xs text-center border-t border-slate-100">
                  <div className="flex items-center gap-1 text-[11px]">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    256-Bit SSL Encrypted
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default CartPage