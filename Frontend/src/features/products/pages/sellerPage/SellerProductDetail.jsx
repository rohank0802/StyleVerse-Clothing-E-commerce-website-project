import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { useSellerProduct } from "../../hook/useSellerProduct.js"
import CreateVariant from "./CreateVariant.jsx"
import ProductVariant from "./ProductVariant.jsx"

function SellerProductDetail() {
    // ── Get productId from URL ────────────────────────────────────────────────
    const { productId } = useParams()
    const { handleGetSellerProductDetail } = useSellerProduct()

    // ── Read Redux Store ─────────────────────────────────────────────────────
    const sellerProducts = useSelector((state) => state.product.sellerProducts)
    const loading        = useSelector((state) => state.product.loading)
    const error          = useSelector((state) => state.product.error)

    // ── Local States ─────────────────────────────────────────────────────────
    const [selectedImgIndex, setSelectedImgIndex] = useState(0)
    const [imgError, setImgError] = useState(false)
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false)
    
    // State to store currently selected variant (null = showing main product)
    const [selectedVariant, setSelectedVariant] = useState(null)

    // ── Fetch Product Details ────────────────────────────────────────────────
    async function fetchProductDetail() {
        if (productId) {
            await handleGetSellerProductDetail(productId)
        }
    }

    useEffect(() => {
        fetchProductDetail()
    }, [productId])

    // Reset selected image index when selectedVariant changes
    useEffect(() => {
        setSelectedImgIndex(0)
        setImgError(false)
    }, [selectedVariant])

    // ── Extract main product object from Redux ───────────────────────────────
    const mainProduct = Array.isArray(sellerProducts)
        ? sellerProducts.find((p) => p._id === productId) || sellerProducts[0]
        : sellerProducts

    // ── Decide active data: Selected Variant vs Main Product ──────────────────
    const activeData = selectedVariant || mainProduct

    // Extract images: Variant images (if available) or main product images
    const imageList = Array.isArray(activeData?.images) && activeData.images.length > 0
        ? activeData.images.map((img) => (typeof img === 'object' ? img.url : img))
        : (Array.isArray(mainProduct?.images) && mainProduct.images.length > 0
            ? mainProduct.images.map((img) => (typeof img === 'object' ? img.url : img))
            : [])

    // Slider Functions
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

    // Extract active price safely
    const priceNum = typeof activeData?.price === 'object'
        ? activeData?.price?.amount || 0
        : (Number(activeData?.price) || Number(mainProduct?.price?.amount) || 0)
    
    const currencySymbol = mainProduct?.price?.currency === 'USD' ? '$' : '₹'

    // ─────────────────────────────────────────────────────────────────────────
    // 1. LOADING STATE
    // ─────────────────────────────────────────────────────────────────────────
    if (loading && !mainProduct) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 gap-3">
                <div className="w-10 h-10 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-slate-400 text-sm font-medium">Loading seller product details...</p>
            </div>
        )
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. ERROR STATE
    // ─────────────────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 text-2xl font-bold mb-4 shadow-lg shadow-rose-950/50">
                    !
                </div>
                <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Failed to Load Product
                </h2>
                <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
                    {typeof error === 'string' ? error : error?.message || 'Something went wrong while retrieving product details.'}
                </p>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchProductDetail}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer"
                    >
                        Try Again
                    </button>
                    <Link
                        to="/seller/dashboard"
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all border border-slate-700"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        )
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. NOT FOUND STATE
    // ─────────────────────────────────────────────────────────────────────────
    if (!mainProduct || !mainProduct._id) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 text-2xl mb-4">
                    🔍
                </div>
                <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Product Not Found
                </h2>
                <p className="text-slate-400 text-sm max-w-md mb-6">
                    This product does not exist or may have been removed from your catalog.
                </p>
                <Link
                    to="/seller/dashboard"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md"
                >
                    Back to Seller Dashboard
                </Link>
            </div>
        )
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 4. MAIN PRODUCT DETAIL VIEW
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-8 lg:px-12" style={{ fontFamily: 'Inter, sans-serif' }}>
            
            {/* Create Variant Modal Popup */}
            <CreateVariant
                productId={productId}
                existingVariants={mainProduct?.variants || []}
                isOpen={isVariantModalOpen}
                onClose={() => setIsVariantModalOpen(false)}
                onSuccess={fetchProductDetail}
            />

            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header Navigation */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <Link
                        to="/seller/dashboard"
                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Seller Dashboard
                    </Link>

                    <div className="flex items-center gap-2">
                        {selectedVariant && (
                            <button
                                onClick={() => setSelectedVariant(null)}
                                className="text-[11px] font-semibold text-indigo-300 bg-indigo-950/80 border border-indigo-500/40 px-3 py-1 rounded-full hover:bg-indigo-900 transition-colors cursor-pointer"
                            >
                                Reset to Main Product
                            </button>
                        )}
                        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                            ✦ Listed Product
                        </span>
                    </div>
                </div>

                {/* Banner when viewing a specific Variant */}
                {selectedVariant && (
                    <div className="bg-indigo-950/70 border border-indigo-500/40 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs text-indigo-200">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                            <span>Active Variant Preview: <strong className="text-white uppercase font-bold">{selectedVariant.sku}</strong></span>
                            {selectedVariant.color && <span className="text-slate-400">({selectedVariant.color}, Size: {selectedVariant.size})</span>}
                        </div>
                        <button
                            onClick={() => setSelectedVariant(null)}
                            className="text-xs text-white underline hover:text-indigo-300 font-semibold cursor-pointer"
                        >
                            Reset to Main Product →
                        </button>
                    </div>
                )}

                {/* ═════════════════════════════════════════════════════════════
                    SECTION 1 — MAIN PRODUCT CARD DIV (Top Container)
                    Displays images, price, title, description, and specs
                ═════════════════════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start bg-slate-800/80 p-6 sm:p-10 rounded-3xl border border-slate-700/80 shadow-2xl">
                    
                    {/* LEFT COLUMN: Main Image / Variant Slider */}
                    <div className="space-y-4">
                        <div className="aspect-square rounded-2xl bg-slate-950 border border-slate-700/80 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden shadow-inner group">
                            {imageList.length > 0 && !imgError ? (
                                <>
                                    <img
                                        src={imageList[selectedImgIndex]}
                                        alt={activeData.title || mainProduct.title}
                                        className="w-full h-full object-cover rounded-xl transition-all duration-300"
                                        onError={() => setImgError(true)}
                                    />

                                    {imageList.length > 1 && (
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={handlePrevImage}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white shadow-lg flex items-center justify-center border border-slate-700 transition-all hover:scale-110 cursor-pointer"
                                                title="Previous Image"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>

                                            <button
                                                onClick={handleNextImage}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white shadow-lg flex items-center justify-center border border-slate-700 transition-all hover:scale-110 cursor-pointer"
                                                title="Next Image"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>

                                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-950/70 px-3 py-1 rounded-full border border-slate-700 backdrop-blur-xs">
                                                {imageList.map((_, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => {
                                                            setSelectedImgIndex(idx)
                                                            setImgError(false)
                                                        }}
                                                        className={`h-2 rounded-full transition-all cursor-pointer ${
                                                            selectedImgIndex === idx
                                                                ? 'w-5 bg-indigo-400'
                                                                : 'w-2 bg-slate-600 hover:bg-slate-400'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-3 p-4">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-900/40 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                                        {selectedVariant ? selectedVariant.sku : mainProduct.title}
                                    </h3>
                                    <span className="text-xs text-indigo-300 font-semibold bg-indigo-950 border border-indigo-700/50 px-3 py-1 rounded-full">
                                        {selectedVariant ? `Variant Size: ${selectedVariant.size}` : 'StyleVerse Product'}
                                    </span>
                                </div>
                            )}
                        </div>

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
                                                ? 'border-indigo-500 scale-105 shadow-md shadow-indigo-500/20'
                                                : 'border-slate-700 opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Product / Selected Variant Details */}
                    <div className="space-y-6">
                        
                        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-700/60 pb-3">
                            <span>
                                {selectedVariant ? (
                                    <>Variant SKU: <code className="text-indigo-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 uppercase font-bold">{selectedVariant.sku}</code></>
                                ) : (
                                    <>Product ID: <code className="text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">{mainProduct._id}</code></>
                                )}
                            </span>
                            <span className="text-slate-400">
                                {selectedVariant ? `Stock: ${selectedVariant.stock} units` : `Created: ${new Date(mainProduct.createdAt || Date.now()).toLocaleDateString()}`}
                            </span>
                        </div>

                        {/* Title */}
                        <h1
                            className="text-3xl sm:text-4xl font-semibold text-white leading-tight"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            {mainProduct.title}
                        </h1>

                        {/* Active Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-indigo-400">
                                {currencySymbol}{priceNum.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-slate-400 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-full">
                                {selectedVariant ? 'Variant Price' : (mainProduct.price?.currency || 'INR')}
                            </span>
                        </div>

                        {/* Selected Variant Spec Badges */}
                        {selectedVariant && (
                            <div className="flex flex-wrap gap-2 p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl">
                                {selectedVariant.size && (
                                    <span className="text-xs text-slate-200 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                                        Size: <strong className="text-white">{selectedVariant.size}</strong>
                                    </span>
                                )}
                                {selectedVariant.color && (
                                    <span className="text-xs text-slate-200 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                                        Color: <strong className="text-white">{selectedVariant.color}</strong>
                                    </span>
                                )}
                                {selectedVariant.attributes && Object.entries(selectedVariant.attributes).map(([k, v]) => (
                                    <span key={k} className="text-xs text-slate-200 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                                        {k}: <strong className="text-white">{v}</strong>
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="h-px bg-slate-700/80 w-full" />

                        {/* Description */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Description
                            </h3>
                            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 border border-slate-700/50 p-4 rounded-2xl">
                                {mainProduct.description || 'No description provided.'}
                            </p>
                        </div>

                    </div>

                </div>

                {/* ═════════════════════════════════════════════════════════════
                    SECTION 2 — SEPARATE VARIANTS DIV BELOW MAIN PRODUCT CARD
                    Holds ProductVariant component list + "Add Variant" button
                ═════════════════════════════════════════════════════════════ */}
                <div className="bg-slate-800/80 p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
                    
                    {/* Variants Section Header & Add Variant Button */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
                        <div>
                            <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Product Variants & Inventory
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Select any variant below to preview its specific image, price, and attributes on the main product card above.
                            </p>
                        </div>

                        {/* Add Variant Button */}
                        <button
                            onClick={() => setIsVariantModalOpen(true)}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-indigo-950 flex items-center gap-2 border border-indigo-400/30 cursor-pointer shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Variant
                        </button>
                    </div>

                    {/* ProductVariant Component List */}
                    <ProductVariant
                        variants={mainProduct.variants}
                        selectedVariant={selectedVariant}
                        onSelectVariant={setSelectedVariant}
                    />

                </div>

            </div>
        </div>
    )
}

export default SellerProductDetail