import { useParams, Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useBuyerProduct } from "../../hook/useBuyerProduct.js"
import { useEffect, useState } from "react"
import BuyerVarientDetail from "./BuyerVarientDetail.jsx"
import {useBuyerCart} from "../../../cart/hook/useBuyerCart.js"
/**
 * ProductDetail Component (Buyer Page)
 * --------------------------------------------------------------------------
 * Main buyer view for inspecting a product. Fetches product data by ID,
 * manages image gallery slider, handles variant selection, and renders action buttons.
 */
function ProductDetail() {
    // ── 1. Extract productId parameter from the URL (/product/:productId) ──────
    const { productId } = useParams()
    const navigate = useNavigate()
    const user = useSelector((state) => state.auth.user)
    const { handleAddItem } = useBuyerCart()

    // Handler to check authentication before adding item to cart
    const handleAddToCart = () => {
        if (!user) {
            navigate('/login')
            return
        }
        handleAddItem({
            productId: product?._id || productId?.id || productId,
            variantId: selectedVariant?._id || selectedVariant?.id
        })
    }

    // ── 2. Custom Hook for calling the buyer product API ───────────────────────
    const { handleProductdetail } = useBuyerProduct()

    // ── 3. Local States ───────────────────────────────────────────────────────
    const [product, setProductDetail] = useState(null)          // Holds fetched product object
    const [selectedVariant, setSelectedVariant] = useState(null) // Holds currently selected variant
    const [selectedImgIndex, setSelectedImgIndex] = useState(0) // Active index of the image slider
    const [imgError, setImgError] = useState(false)             // Handles broken image links gracefully

    // ── 4. Function to fetch product details from backend API ─────────────────
    async function fetchProductDetail() {
        const result = await handleProductdetail(productId)
        if (result) {
            setProductDetail(result)
            // Automatically select the first variant if available
            if (Array.isArray(result.variants) && result.variants.length > 0) {
                setSelectedVariant(result.variants[0])
            }
        }
    }

    // ── 5. Fetch data when component mounts or when productId changes ─────────
    useEffect(() => {
        fetchProductDetail()
    }, [productId])

    // ── 6. Reset image slider index when the user selects a new variant ───────
    useEffect(() => {
        setSelectedImgIndex(0)
        setImgError(false)
    }, [selectedVariant])

    // ── 7. Show loading spinner while fetching product data ───────────────────
    if (!product) {
        return (
            <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center py-20 gap-3 text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                <div className="w-8 h-8 border-3 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-slate-600 text-sm font-medium">Loading product details...</p>
            </div>
        )
    }

    // ── 8. FALLBACK RESOLUTION LOGIC FOR IMAGES ───────────────────────────────
    // Check if selected variant has images; if not, fallback to main product images
    const variantImages = Array.isArray(selectedVariant?.images) && selectedVariant.images.length > 0
        ? selectedVariant.images.map((img) => (typeof img === 'object' ? img.url : img))
        : []

    const mainImages = Array.isArray(product.images) && product.images.length > 0
        ? product.images.map((img) => (typeof img === 'object' ? img.url : img))
        : []

    const imageList = variantImages.length > 0 ? variantImages : mainImages

    // ── 9. FALLBACK RESOLUTION LOGIC FOR PRICE ────────────────────────────────
    // Check if selected variant has a price; if not, fallback to main product price
    const rawPrice = selectedVariant?.price?.amount !== undefined && selectedVariant?.price?.amount !== null
        ? selectedVariant.price
        : product.price

    const priceNum = typeof rawPrice === 'object' ? rawPrice?.amount || 0 : Number(rawPrice) || 0
    const currencySymbol = (rawPrice?.currency || product.price?.currency) === 'USD' ? '$' : '₹'

    // ── 10. Slider Navigation Functions ───────────────────────────────────────
    const handlePrevImage = () => {
        if (imageList.length <= 1) return
        setImgError(false)
        setSelectedImgIndex((prev) => (prev - 1 + imageList.length) % imageList.length)
    }

    const handleNextImage = () => {
        if (imageList.length <= 1) return
        setImgError(false)
        setSelectedImgIndex((prev) => (prev + 1) % imageList.length)
    }

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 py-10 px-4 sm:px-6 lg:px-12" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="max-w-6xl mx-auto">
                
                {/* ── HEADER / NAVIGATION BAR ────────────────────────────────────── */}
                <div className="mb-6 flex items-center justify-between">
                    <Link to="/" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 font-semibold transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Marketplace
                    </Link>

                    {selectedVariant && (
                        <button
                            onClick={() => setSelectedVariant(null)}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline transition-colors cursor-pointer"
                        >
                            Reset Selection
                        </button>
                    )}
                </div>

                {/* ── MAIN PRODUCT CARD CONTAINER ────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm shadow-slate-200/50">
                    
                    {/* ── LEFT COLUMN: IMAGE SLIDER & GALLERY ─────────────────────── */}
                    <div className="space-y-4">
                        <div className="aspect-square rounded-2xl bg-indigo-50/50 border border-slate-200 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden shadow-sm group">
                            {imageList.length > 0 && !imgError ? (
                                <>
                                    {/* Active Slide Image */}
                                    <img
                                        src={imageList[selectedImgIndex]}
                                        alt={product.title}
                                        className="w-full h-full object-cover rounded-2xl transition-all duration-300"
                                        onError={() => setImgError(true)}
                                    />

                                    {/* Slider Arrow Buttons (Shown on Hover) */}
                                    {imageList.length > 1 && (
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            {/* Prev Arrow */}
                                            <button
                                                onClick={handlePrevImage}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all hover:scale-110 border border-slate-200 cursor-pointer"
                                                title="Previous image"
                                                aria-label="Previous image"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>

                                            {/* Next Arrow */}
                                            <button
                                                onClick={handleNextImage}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all hover:scale-110 border border-slate-200 cursor-pointer"
                                                title="Next image"
                                                aria-label="Next image"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>

                                            {/* Slider Dots */}
                                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20">
                                                {imageList.map((_, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => {
                                                            setSelectedImgIndex(idx)
                                                            setImgError(false)
                                                        }}
                                                        className={`h-2 rounded-full transition-all cursor-pointer ${
                                                            selectedImgIndex === idx
                                                                ? 'w-5 bg-white'
                                                                : 'w-2 bg-white/50 hover:bg-white/80'
                                                        }`}
                                                        aria-label={`Go to slide ${idx + 1}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* Fallback if Image is missing or broken */
                                <div className="flex flex-col items-center justify-center gap-3 p-4">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center shadow-sm">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                                        {selectedVariant ? selectedVariant.sku : product.title}
                                    </h3>
                                    <span className="text-xs text-indigo-600 font-semibold bg-white border border-indigo-100 px-3 py-1 rounded-full shadow-xs">
                                        StyleVerse Apparel
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Strip below main image */}
                        {imageList.length > 1 && !imgError && (
                            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                                {imageList.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setSelectedImgIndex(idx)
                                            setImgError(false)
                                        }}
                                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                                            selectedImgIndex === idx
                                                ? 'border-indigo-600 scale-105 shadow-sm'
                                                : 'border-slate-200 opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT COLUMN: PRODUCT TITLE, PRICE, VARIANTS & ACTIONS ───── */}
                    <div className="space-y-6">
                        
                        {/* Title */}
                        <h1
                            className="text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-900 leading-tight tracking-tight"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            {product.title}
                        </h1>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-indigo-600">
                                {currencySymbol}{priceNum.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                                Inclusive of all taxes
                            </span>
                        </div>

                        {/* ── BUYER VARIANT DETAIL COMPONENT ────────────────────────── */}
                        <BuyerVarientDetail
                            product={product}
                            selectedVariant={selectedVariant}
                            onSelectVariant={setSelectedVariant}
                        />

                        {/* ── ACTION BUTTONS: BUY NOW & ADD TO CART ─────────────────── */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                            <button
                                className="w-full sm:flex-1 h-13 py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-2xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Buy Now
                            </button>

                            <button 
                                onClick={handleAddToCart}
                                className="w-full sm:flex-1 h-13 py-3.5 px-6 bg-white hover:bg-slate-50 text-slate-900 font-semibold text-sm rounded-2xl border border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            >
                                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Add to Cart
                            </button>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default ProductDetail