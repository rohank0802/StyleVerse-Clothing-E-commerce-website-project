import React, { useEffect, useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useBuyerProduct } from '../../hook/useBuyerProduct.js'
import { useBuyerCart } from '../../../cart/hook/useBuyerCart.js'

/**
 * ShowSearchedproducts Component (Buyer View)
 * --------------------------------------------------------------------------
 * Beginner-Friendly component to display searched products and their variants.
 * Accessible via `/SeachPoduct?query=...` or `/SeachPoduct?productId=...`.
 */
function ShowSearchedproducts() {
  const location = useLocation()
  const navigate = useNavigate()

  // ── Step 1: Parse search text & product ID from URL query string ──────────
  // Example: /SeachPoduct?query=pant or /SeachPoduct?productId=6a7f07df...
  const queryParams = new URLSearchParams(location.search)
  const searchQuery = queryParams.get('query') || ''
  const selectedProductId = queryParams.get('productId') || ''

  // ── Step 2: Get products list & cart action handlers from Redux and Hooks ─
  const rawProducts = useSelector((state) => state.product.products) || []
  const { handleAllProducts } = useBuyerProduct()
  const { handleAddItem } = useBuyerCart()

  // Ensure `products` is a valid Array
  let products = []
  if (Array.isArray(rawProducts)) {
    products = rawProducts
  } else if (rawProducts && Array.isArray(rawProducts.products)) {
    products = rawProducts.products
  }

  // ── Step 3: Local component state variables ───────────────────────────────
  const [toastMessage, setToastMessage] = useState(null)       // Shows popup toast when item is added to cart
  const [addingVariantId, setAddingVariantId] = useState(null) // Tracks loading spinner on specific variant button

  // Fetch all products from API if Redux store is empty when page mounts
  useEffect(() => {
    if (!products || products.length === 0) {
      handleAllProducts()
    }
  }, [])

  // ── Step 4: Filter products that match search query or selected product ID ──
  const matchingProducts = []
  for (let i = 0; i < products.length; i++) {
    const product = products[i]

    // 1. If user clicked a specific product from dropdown, include it
    if (selectedProductId && product._id === selectedProductId) {
      matchingProducts.push(product)
      continue
    }

    // 2. If no search text entered, show all products
    if (!searchQuery) {
      matchingProducts.push(product)
      continue
    }

    // 3. Search matching logic across title, description, category, SKU, color, size
    const q = searchQuery.toLowerCase()
    const titleMatch = product.title && product.title.toLowerCase().includes(q)
    const descMatch = product.description && product.description.toLowerCase().includes(q)
    const catMatch = product.category && product.category.toLowerCase().includes(q)

    let variantMatch = false
    if (Array.isArray(product.variants)) {
      for (let j = 0; j < product.variants.length; j++) {
        const v = product.variants[j]
        if (v) {
          if (v.sku && v.sku.toLowerCase().includes(q)) variantMatch = true
          if (v.color && v.color.toLowerCase().includes(q)) variantMatch = true
          if (v.size && v.size.toLowerCase().includes(q)) variantMatch = true
        }
      }
    } else if (typeof product.variants === 'object' && product.variants !== null) {
      const v = product.variants
      if (v.sku && v.sku.toLowerCase().includes(q)) variantMatch = true
      if (v.color && v.color.toLowerCase().includes(q)) variantMatch = true
      if (v.size && v.size.toLowerCase().includes(q)) variantMatch = true
    }

    // If any field matches search query, add product to results
    if (titleMatch || descMatch || catMatch || variantMatch) {
      matchingProducts.push(product)
    }
  }

  // Find the primary featured product to display variants prominently
  let targetProduct = null
  if (selectedProductId) {
    targetProduct = products.find((p) => p._id === selectedProductId) || matchingProducts[0]
  } else {
    targetProduct = matchingProducts[0] || null
  }

  // ── Step 5: Helper function to extract variants list for a product ───────
  function getVariantsList(product) {
    if (!product) return []
    if (Array.isArray(product.variants)) {
      return product.variants
    }
    if (typeof product.variants === 'object' && product.variants !== null) {
      return [product.variants]
    }
    return []
  }

  // ── Step 6: Helper function to format price string ────────────────────────
  function formatPrice(priceObj) {
    if (!priceObj) return '₹0'

    let amount = 0
    let currencySymbol = '₹'

    if (typeof priceObj === 'object' && priceObj !== null) {
      amount = priceObj.amount || 0
      currencySymbol = priceObj.currency === 'USD' ? '$' : '₹'
    } else {
      amount = Number(priceObj) || 0
    }

    return `${currencySymbol}${amount.toLocaleString('en-IN')}`
  }

  // ── Step 7: Helper function to get image URL for a variant ───────────────
  function getVariantImage(variant, product) {
    // 1. Try variant image
    if (variant && Array.isArray(variant.images) && variant.images.length > 0) {
      const img = variant.images[0]
      return typeof img === 'object' ? img.url : img
    }

    // 2. Fallback to product image
    if (product && Array.isArray(product.images) && product.images.length > 0) {
      const img = product.images[0]
      return typeof img === 'object' ? img.url : img
    }

    return null
  }

  // ── Step 8: Handle adding a variant to the cart ──────────────────────────
  async function handleAddToCart(productId, variantId) {
    try {
      setAddingVariantId(variantId)
      await handleAddItem({ productId, variantId })
      setToastMessage('Item added to cart successfully!')
      setTimeout(() => {
        setToastMessage(null)
      }, 3000)
    } catch (err) {
      setToastMessage('Failed to add item to cart')
      setTimeout(() => {
        setToastMessage(null)
      }, 3000)
    } finally {
      setAddingVariantId(null)
    }
  }

  // ── Step 9: Render Page UI ────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-12"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* ── TOAST NOTIFICATION ────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ── BREADCRUMB & SEARCH HEADER ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <Link
              to="/"
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1.5 transition-colors mb-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Catalog
            </Link>

            <div className="flex items-center gap-3">
              <h1
                className="text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Search Results
              </h1>
              {searchQuery && (
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                  "{searchQuery}"
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Found {matchingProducts.length} matching product {matchingProducts.length === 1 ? 'collection' : 'collections'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">StyleVerse Curator View</span>
          </div>
        </div>

        {/* ── NO RESULTS STATE ────────────────────────────────────────────── */}
        {matchingProducts.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 flex flex-col items-center justify-center text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              No Products Match Your Search
            </h2>
            <p className="text-xs text-slate-500 max-w-md">
              We couldn't find any products matching "{searchQuery}". Try searching for alternative keywords like "pant", "formal", or "t-shirt".
            </p>
            <Link
              to="/"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
            >
              Explore All Collections
            </Link>
          </div>
        )}

        {/* ── PROMINENT FEATURED SEARCHED PRODUCT & VARIANTS ──────────────── */}
        {targetProduct && (
          <div className="space-y-6">
            
            {/* Target Product Overview Banner */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">
                    Featured Result
                  </span>
                  <h2
                    className="text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight mt-2"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {targetProduct.title || 'Untitled Product'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                    {targetProduct.description || 'Curated luxury apparel crafted with premium materials.'}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <Link
                    to={`/products/${targetProduct._id}`}
                    className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                  >
                    View Product Page →
                  </Link>
                </div>
              </div>

              {/* VARIANTS GRID FOR THIS PRODUCT */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                    Available Variants ({getVariantsList(targetProduct).length})
                  </h3>
                  <span className="text-xs text-slate-400">Select any variant to add to cart</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {getVariantsList(targetProduct).map((variant, index) => {
                    const variantImg = getVariantImage(variant, targetProduct)
                    const variantPrice = formatPrice(variant.price || targetProduct.price)
                    const isAdding = addingVariantId === variant._id

                    return (
                      <div
                        key={variant._id || index}
                        className="bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 p-4 transition-all duration-200 hover:border-indigo-300 hover:shadow-md flex flex-col justify-between space-y-4 group"
                      >
                        {/* Image & Basic Specs */}
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                            {variantImg ? (
                              <img
                                src={variantImg}
                                alt={variant.sku || 'Variant'}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                onError={(e) => { e.currentTarget.style.display = 'none' }}
                              />
                            ) : (
                              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                            )}
                          </div>

                          <div className="space-y-1 min-w-0 flex-1">
                            {variant.sku && (
                              <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-md inline-block truncate max-w-full">
                                SKU: {variant.sku}
                              </span>
                            )}

                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              {variant.color && (
                                <span className="text-[10px] font-semibold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                                  Color: {variant.color}
                                </span>
                              )}
                              {variant.size && (
                                <span className="text-[10px] font-semibold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                                  Size: {variant.size}
                                </span>
                              )}
                            </div>

                            {/* Stock Status */}
                            <span className="text-[10px] font-medium text-emerald-600 block pt-0.5">
                              ● In Stock ({variant.stock || 20} available)
                            </span>
                          </div>
                        </div>

                        {/* Price & Add to Cart Action */}
                        <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-3">
                          <div>
                            <span className="text-base font-bold text-indigo-600 block">
                              {variantPrice}
                            </span>
                            <span className="text-[10px] text-slate-400">Inclusive of taxes</span>
                          </div>

                          <button
                            type="button"
                            disabled={isAdding}
                            onClick={() => handleAddToCart(targetProduct._id, variant._id)}
                            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-300 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                          >
                            {isAdding ? (
                              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                              </svg>
                            )}
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ── OTHER MATCHING SEARCHED PRODUCTS GRID ───────────────────────── */}
        {matchingProducts.length > 1 && (
          <div className="space-y-4 pt-4">
            <h3
              className="text-xl font-bold text-slate-900"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Other Matching Collections ({matchingProducts.length - 1})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingProducts
                .filter((p) => p._id !== targetProduct?._id)
                .map((product) => {
                  const variants = getVariantsList(product)
                  const basePrice = formatPrice(product.price || (variants[0]?.price))
                  const displayImg = getVariantImage(variants[0], product)

                  return (
                    <div
                      key={product._id}
                      className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all duration-200 space-y-4 flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        {/* Image Container */}
                        <div className="w-full h-48 rounded-2xl bg-indigo-50/50 border border-slate-100 overflow-hidden relative flex items-center justify-center">
                          {displayImg ? (
                            <img
                              src={displayImg}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => { e.currentTarget.style.display = 'none' }}
                            />
                          ) : (
                            <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          )}

                          <span className="absolute top-3 right-3 text-[10px] font-bold bg-white/90 backdrop-blur-sm text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
                            {variants.length} {variants.length === 1 ? 'Variant' : 'Variants'}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h4
                            className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                          >
                            {product.title || 'Untitled Product'}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                            {product.description || 'Luxury designer product.'}
                          </p>
                        </div>
                      </div>

                      {/* Footer Price & View Link */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-sm font-bold text-indigo-600">
                            {basePrice}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => navigate(`/SeachPoduct?productId=${product._id}&query=${encodeURIComponent(searchQuery)}`)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-100 transition-colors cursor-pointer"
                        >
                          View Variants →
                        </button>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ShowSearchedproducts