import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useBuyerProduct } from '../../hook/useBuyerProduct.js'

/**
 * SearchBar Component
 * --------------------------------------------------------------------------
 * Beginner-Friendly search bar with live suggestion dropdown & debouncing.
 * 
 * Flow:
 * 1. User types in search input -> updates `searchTerm` state.
 * 2. Debouncing timer waits 300ms -> updates `debouncedQuery` state.
 * 3. Matching products are filtered live from Redux store (`state.product.products`).
 * 4. User sees matching products in dropdown -> clicking navigates to /SeachPoduct.
 */
function SearchBar() {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  // ── Step 1: Read all products from global Redux store & custom hook ───────
  // useSelector reads product array from Redux state.product.products
  const rawProducts = useSelector((state) => state.product.products) || []
  const { handleAllProducts } = useBuyerProduct()

  // Ensure `products` is always a valid Array to avoid runtime crashes
  let products = []
  if (Array.isArray(rawProducts)) {
    products = rawProducts
  } else if (rawProducts && Array.isArray(rawProducts.products)) {
    products = rawProducts.products
  }

  // ── Step 2: Local Component State Variables ──────────────────────────────
  const [searchTerm, setSearchTerm] = useState('')       // Raw text typed in input field
  const [debouncedQuery, setDebouncedQuery] = useState('') // Text updated after 300ms delay
  const [isOpen, setIsOpen] = useState(false)            // Controls live dropdown visibility
  const [isSearching, setIsSearching] = useState(false)   // Shows small loading spinner while typing

  // ── Step 3: Fetch all products from API when page loads (if empty) ────────
  useEffect(() => {
    // If Redux store doesn't have products yet, fetch them from backend API
    if (!products || products.length === 0) {
      handleAllProducts()
    }
  }, [])

  // ── Step 4: 300ms Debounce Logic (Delays filtering until user stops typing)
  useEffect(() => {
    // Show spinner when user starts typing
    setIsSearching(true)

    // Set timer for 300 milliseconds
    const timer = setTimeout(() => {
      setDebouncedQuery(searchTerm.trim())
      setIsSearching(false)
    }, 300)

    // Cleanup function: cancels previous timer if user types another letter before 300ms
    return () => clearTimeout(timer)
  }, [searchTerm])

  // ── Step 5: Auto-close dropdown when user clicks outside search box ──────
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if mouse click occurred outside the search bar container
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    // Attach click listener to document
    document.addEventListener('mousedown', handleClickOutside)

    // Remove listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // ── Step 6: Helper function to check if a product matches search query ─────
  function isProductMatch(product, queryText) {
    if (!product || !queryText) return false

    const query = queryText.toLowerCase()

    // 1. Match product title (e.g. "Formal Pant")
    if (product.title && product.title.toLowerCase().includes(query)) {
      return true
    }

    // 2. Match product description (e.g. "formal pant for man")
    if (product.description && product.description.toLowerCase().includes(query)) {
      return true
    }

    // 3. Match product category
    if (product.category && product.category.toLowerCase().includes(query)) {
      return true
    }

    // 4. Match product variants (SKU, Color, Size)
    if (Array.isArray(product.variants)) {
      for (let i = 0; i < product.variants.length; i++) {
        const v = product.variants[i]
        if (v) {
          if (v.sku && v.sku.toLowerCase().includes(query)) return true
          if (v.color && v.color.toLowerCase().includes(query)) return true
          if (v.size && v.size.toLowerCase().includes(query)) return true
        }
      }
    } else if (typeof product.variants === 'object' && product.variants !== null) {
      const v = product.variants
      if (v.sku && v.sku.toLowerCase().includes(query)) return true
      if (v.color && v.color.toLowerCase().includes(query)) return true
      if (v.size && v.size.toLowerCase().includes(query)) return true
    }

    return false
  }

  // Filter products using helper function
  const matchingProducts = []
  if (debouncedQuery) {
    for (let i = 0; i < products.length; i++) {
      if (isProductMatch(products[i], debouncedQuery)) {
        matchingProducts.push(products[i])
      }
    }
  }

  // ── Step 7: Helper function to format price string for live dropdown ──────
  function getDisplayPrice(product) {
    if (!product) return '₹0'

    // 1. Check variant price
    if (typeof product.variants === 'object' && product.variants !== null && product.variants.price) {
      const p = typeof product.variants.price === 'object' ? product.variants.price.amount : Number(product.variants.price)
      if (p) return `₹${p.toLocaleString('en-IN')}`
    }

    // 2. Check base product price
    if (product.price) {
      const p = typeof product.price === 'object' ? product.price.amount : Number(product.price)
      if (p) return `₹${p.toLocaleString('en-IN')}`
    }

    return '₹0'
  }

  // ── Step 8: Helper function to get image URL for dropdown thumbnail ───────
  function getDisplayImage(product) {
    if (!product) return null

    // 1. Try getting image from variant object
    if (typeof product.variants === 'object' && product.variants !== null) {
      if (Array.isArray(product.variants.images) && product.variants.images.length > 0) {
        const img = product.variants.images[0]
        return typeof img === 'object' ? img.url : img
      }
    }

    // 2. Fallback to main product images
    if (Array.isArray(product.images) && product.images.length > 0) {
      const img = product.images[0]
      return typeof img === 'object' ? img.url : img
    }

    return null
  }

  // ── Step 9: Handle form submit (pressing Enter key or clicking search icon)
  function handleSubmit(e) {
    e.preventDefault()
    if (!searchTerm.trim()) return
    setIsOpen(false)
    // Navigate to ShowSearchedproducts route with query string
    navigate(`/SeachPoduct?query=${encodeURIComponent(searchTerm.trim())}`)
  }

  // ── Step 10: Handle clicking a search suggestion item from live dropdown ──
  function handleSelectProduct(product) {
    setIsOpen(false)
    // Navigate to ShowSearchedproducts route with specific product ID & query
    navigate(`/SeachPoduct?productId=${product._id}&query=${encodeURIComponent(searchTerm.trim() || product.title || '')}`)
  }

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      
      {/* ── SEARCH INPUT FORM ────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        
        {/* Search Icon */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search apparel, variants, colors, SKU..."
          className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-full outline-none transition-all duration-200 shadow-2xs focus:ring-3 focus:ring-indigo-100"
        />

        {/* Loading Spinner & Clear Input Button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isSearching && (
            <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          )}

          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setDebouncedQuery('')
              }}
              className="w-4 h-4 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-500 flex items-center justify-center text-[10px] transition-colors cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      {/* ── LIVE SEARCH DROPDOWN OVERLAY ─────────────────────────────────── */}
      {isOpen && debouncedQuery && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Header Bar */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span>
              {matchingProducts.length} {matchingProducts.length === 1 ? 'Result' : 'Results'} found
            </span>
            <span className="text-[10px] text-indigo-600 font-mono">StyleVerse Live</span>
          </div>

          {/* Results List */}
          {matchingProducts.length > 0 ? (
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
              {matchingProducts.slice(0, 6).map((product) => {
                const imgUrl = getDisplayImage(product)
                const price = getDisplayPrice(product)
                const variantCount = Array.isArray(product.variants) ? product.variants.length : (product.variants ? 1 : 0)

                return (
                  <button
                    key={product._id}
                    type="button"
                    onClick={() => handleSelectProduct(product)}
                    className="w-full px-4 py-3 flex items-center gap-3.5 hover:bg-indigo-50/60 transition-colors text-left group cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center relative">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                      ) : (
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 truncate transition-colors">
                        {product.title || 'Untitled Product'}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {product.description || 'Curated designer collection'}
                      </p>
                    </div>

                    {/* Price & Variant Count */}
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-indigo-600 block">
                        {price}
                      </span>
                      {variantCount > 0 && (
                        <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {variantCount} {variantCount === 1 ? 'Variant' : 'Variants'}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="p-6 text-center space-y-1">
              <p className="text-xs font-semibold text-slate-700">No matching products found</p>
              <p className="text-[11px] text-slate-400">Try searching for apparel titles, SKU, or colors like "black", "formal", or "t-shirt"</p>
            </div>
          )}

          {/* View All Results Button Footer */}
          {matchingProducts.length > 0 && (
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-2.5 bg-slate-50 hover:bg-indigo-50 border-t border-slate-100 text-xs font-semibold text-indigo-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              View All Results ({matchingProducts.length}) →
            </button>
          )}

        </div>
      )}

    </div>
  )
}

export default SearchBar
