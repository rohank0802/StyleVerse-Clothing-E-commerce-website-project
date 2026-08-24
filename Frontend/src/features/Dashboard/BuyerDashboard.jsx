import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useBuyerProduct } from '../products/hook/useBuyerProduct.js'
import BuyerDashboardNavbar from './BuyerDashboardNavbar.jsx'

const BuyerDashboard = () => {
  const navigate = useNavigate()
  const { handleAllProducts } = useBuyerProduct()

  // Read products & state from Redux product slice
  const rawProducts = useSelector((state) => state.product.products)
  console.log(rawProducts)
  const loading = useSelector((state) => state.product.productLoading)
  const error = useSelector((state) => state.product.productError)

  // Ensure products is always treated as an array
  const products = Array.isArray(rawProducts)
    ? rawProducts
    : rawProducts?.products || []

  // Call handleAllProducts on component mount
  useEffect(() => {
    handleAllProducts()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
      <BuyerDashboardNavbar />

      {/* ── HERO DISPLAY BANNER (65% Viewport Height, Full Width) ─────────── */}
      <div className="relative w-full h-[65vh] min-h-[460px] flex items-center justify-center overflow-hidden bg-slate-950">

        {/* Background Image */}
        <img
          src="/fashion-model.png"
          alt="StyleVerse Fashion Display"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 scale-105"
        />

        {/* Sophisticated Dark Indigo Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-indigo-950/75 to-slate-950/90 backdrop-blur-[1px]" />

        {/* Hero Overlay Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center space-y-6">

          {/* Eyebrow Chip */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-200">
              StyleVerse Marketplace
            </span>
          </div>

          {/* Main Title */}
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-tight max-w-4xl drop-shadow-md"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Elevate Your Wardrobe with StyleVerse
          </h1>

          {/* Subtitle */}
          <p
            className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl font-light leading-relaxed drop-shadow"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Discover handpicked luxury apparel, trending fashion, and exclusive collections directly from verified global independent designers.
          </p>

          {/* Feature Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 max-w-3xl">
            {[
              { icon: '✦', text: 'Curated Collections' },
              { icon: '✦', text: 'Verified Sellers' },
              { icon: '✦', text: '100% Authentic Apparel' },
            ].map((feature) => (
              <div
                key={feature.text}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md transition-all duration-300 shadow-sm"
              >
                <span className="text-indigo-400 text-xs font-bold">{feature.icon}</span>
                <span className="text-xs sm:text-sm font-medium text-white tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Decorative Fade */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
      </div>

      <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Heading */}
        <div className="mb-8 pb-4 border-b border-slate-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Products
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {products.length > 0 ? `Showing ${products.length} products` : 'Explore marketplace listings'}
          </p>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-500 text-sm">Loading products...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <p className="text-rose-600 text-sm font-medium">Failed to load products.</p>
            <button
              onClick={handleAllProducts}
              className="text-xs text-indigo-600 hover:underline font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && products.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
            <p className="text-slate-500 text-sm">No products available at the moment.</p>
          </div>
        )}

        {/* PRODUCTS GRID */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const firstImg = Array.isArray(product.images) && product.images.length > 0
                ? (typeof product.images[0] === 'object' ? product.images[0].url : product.images[0])
                : null

              const priceNum = typeof product.price === 'object' ? product.price?.amount || 0 : Number(product.price) || 0
              const currencySymbol = product.price?.currency === 'USD' ? '$' : '₹'

              return (
                <div
                  key={product._id}
                  onClick={() => navigate(`/products/${product._id}`)}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  {/* Product Thumbnail / Title Fallback */}
                  <div className="relative aspect-[4/3] bg-indigo-50/60 overflow-hidden flex flex-col items-center justify-center p-4 text-center">
                    {firstImg ? (
                      <img
                        src={firstImg}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement.classList.add('flex')
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 p-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <span className="text-xs font-bold text-slate-800 line-clamp-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                          {product.title}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {product.seller && (
                        <p className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider mb-1">
                          Seller: {typeof product.seller === 'object' ? product.seller.fullName : 'Seller'}
                        </p>
                      )}
                      <h3
                        className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                        title={product.title}
                      >
                        {product.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-base font-bold text-indigo-600">
                        {currencySymbol}{priceNum.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}

export default BuyerDashboard