import React, { useState } from 'react'

/**
 * BuyerVarientDetail Component
 * --------------------------------------------------------------------------
 * Displays variant selection options (Color, Size, SKU chips), stock status, 
 * and product detail attributes for buyers.
 *
 * Props:
 * - product: The main product object fetched from the backend.
 * - selectedVariant: The currently selected variant object (or null).
 * - onSelectVariant: Function to update the selected variant in ProductDetail.jsx.
 */
const BuyerVarientDetail = ({
    product,
    selectedVariant,
    onSelectVariant
}) => {
    // ── 1. Safely extract all variants for this product ─────────────────────
    const variantsList = Array.isArray(product?.variants) ? product.variants : []

    // ── 2. Get list of unique colors (e.g. ['Black', 'Blue']) ─────────────────
    const availableColors = Array.from(new Set(variantsList.map((v) => v.color).filter(Boolean)))

    // ── 3. Get list of unique sizes (e.g. ['S', 'M', 'L']) ───────────────────
    const availableSizes = Array.from(new Set(variantsList.map((v) => v.size).filter(Boolean)))

    // ── 4. Local states for selected Color and Size ──────────────────────────
    const [selectedColor, setSelectedColor] = useState(selectedVariant?.color || null)
    const [selectedSize, setSelectedSize] = useState(selectedVariant?.size || null)

    // ── 5. Handler when a user clicks a Color button ─────────────────────────
    const handleSelectColor = (color) => {
        setSelectedColor(color)

        // Find matching variant with this color (and matching size if size is chosen)
        const matchedVariant = variantsList.find((v) => {
            const isColorMatch = v.color?.toLowerCase() === color.toLowerCase()
            const isSizeMatch  = selectedSize ? v.size?.toLowerCase() === selectedSize.toLowerCase() : true
            return isColorMatch && isSizeMatch
        }) || variantsList.find((v) => v.color?.toLowerCase() === color.toLowerCase())

        // Update selected variant
        if (matchedVariant) {
            if (matchedVariant.size) setSelectedSize(matchedVariant.size)
            onSelectVariant(matchedVariant)
        }
    }

    // ── 6. Handler when a user clicks a Size button ──────────────────────────
    const handleSelectSize = (size) => {
        setSelectedSize(size)

        // Find matching variant with this size (and matching color if color is chosen)
        const matchedVariant = variantsList.find((v) => {
            const isSizeMatch  = v.size?.toLowerCase() === size.toLowerCase()
            const isColorMatch = selectedColor ? v.color?.toLowerCase() === selectedColor.toLowerCase() : true
            return isSizeMatch && isColorMatch
        }) || variantsList.find((v) => v.size?.toLowerCase() === size.toLowerCase())

        // Update selected variant
        if (matchedVariant) {
            if (matchedVariant.color) setSelectedColor(matchedVariant.color)
            onSelectVariant(matchedVariant)
        }
    }

    // ── 7. Handler when a user clicks a direct SKU Variant button ────────────
    const handleSelectDirectVariant = (variantItem) => {
        onSelectVariant(variantItem)
        if (variantItem.color) setSelectedColor(variantItem.color)
        if (variantItem.size) setSelectedSize(variantItem.size)
    }

    // ── 8. Resolve Stock (Use variant stock if available, else main product stock) ─
    const stockQuantity = selectedVariant?.stock !== undefined 
        ? selectedVariant.stock 
        : product?.stock

    // ── 9. Resolve Attributes (Use variant attributes if available, else main product) ─
    const activeAttributes = selectedVariant?.attributes || product?.attributes || {}

    return (
        <div className="space-y-6">
            
            {/* ── SECTION A: COLOR SELECTOR BUTTONS ────────────────────────────── */}
            {availableColors.length > 0 && (
                <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest block">
                        COLOR
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                        {availableColors.map((color) => {
                            const isSelected = (selectedColor || selectedVariant?.color)?.toLowerCase() === color.toLowerCase()
                            return (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => handleSelectColor(color)}
                                    className={`px-5 py-2.5 border text-xs tracking-wider uppercase transition-all cursor-pointer rounded-xs font-semibold ${
                                        isSelected
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                            : 'bg-white text-slate-800 border-slate-300 hover:border-indigo-600 hover:text-indigo-600'
                                    }`}
                                >
                                    {color}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ── SECTION B: SIZE SELECTOR BUTTONS ─────────────────────────────── */}
            {availableSizes.length > 0 && (
                <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest block">
                        SIZE
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                        {availableSizes.map((size) => {
                            const isSelected = (selectedSize || selectedVariant?.size)?.toLowerCase() === size.toLowerCase()
                            return (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => handleSelectSize(size)}
                                    className={`px-5 py-2.5 border text-xs tracking-wider uppercase transition-all cursor-pointer rounded-xs font-semibold ${
                                        isSelected
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                            : 'bg-white text-slate-800 border-slate-300 hover:border-indigo-600 hover:text-indigo-600'
                                    }`}
                                >
                                    {size}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ── SECTION C: SKU CHIPS (Fallback if Color & Size not separate) ── */}
            {availableColors.length === 0 && availableSizes.length === 0 && variantsList.length > 0 && (
                <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest block">
                        VARIANT OPTIONS
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                        {variantsList.map((v) => {
                            const isSelected = selectedVariant?._id === v._id || selectedVariant?.sku === v.sku
                            return (
                                <button
                                    key={v._id || v.sku}
                                    type="button"
                                    onClick={() => handleSelectDirectVariant(v)}
                                    className={`px-5 py-2.5 border text-xs tracking-wider uppercase transition-all cursor-pointer rounded-xs font-semibold ${
                                        isSelected
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                            : 'bg-white text-slate-800 border-slate-300 hover:border-indigo-600 hover:text-indigo-600'
                                    }`}
                                >
                                    {v.sku}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ── SECTION D: STOCK STATUS DISPLAY ──────────────────────────────── */}
            {stockQuantity !== undefined && (
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest pt-1">
                    {stockQuantity > 0 ? `${stockQuantity} IN STOCK` : 'OUT OF STOCK'}
                </div>
            )}

            {/* ── SECTION E: THE DETAILS & DESCRIPTION ─────────────────────────── */}
            <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest block">
                    THE DETAILS
                </span>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {product?.description || 'No description provided for this product.'}
                </p>

                {/* Extra Material / Fit Attributes */}
                {activeAttributes && Object.keys(activeAttributes).length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-xs text-slate-600">
                        {Object.entries(activeAttributes).map(([key, value]) => (
                            <span key={key}>
                                <span className="capitalize text-slate-400">{key}:</span> <strong className="text-slate-800">{value}</strong>
                            </span>
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}

export default BuyerVarientDetail
