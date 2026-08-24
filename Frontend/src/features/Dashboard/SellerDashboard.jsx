import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useSellerAuth } from '../auth/hook/useSellerAuth.js'
import { useSellerProduct } from '../products/hook/useSellerProduct.js'

// ── Fallback logo SVG (base64-encoded) ─────────────────────────────────────
const DEFAULT_LOGO =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'><rect width='100' height='100' rx='24' fill='%234F46E5'/><path d='M32 38C32 38 40 24 50 24C60 24 68 38 68 38' stroke='white' stroke-width='6' stroke-linecap='round'/><path d='M26 38H74L70 76C70 78.2091 68.2091 80 66 80H34C31.7909 80 30 78.2091 30 76L26 38Z' fill='white' fill-opacity='0.15' stroke='white' stroke-width='6' stroke-linejoin='round'/><path d='M43 48C43 51.866 46.134 55 50 55C53.866 55 57 51.866 57 48' stroke='white' stroke-width='5' stroke-linecap='round'/></svg>"

// ── Stats shown in the hero section ────────────────────────────────────────
const STATS = [
  { num: '10K+', label: 'Active Buyers' },
  { num: '50+',  label: 'Curated Brands' },
  { num: 'Zero', label: 'Compromise on Style' },
]

const SellerDashboard = () => {

  // ── Read logged-in seller from Redux auth slice ──────────────────────────
  const user = useSelector((state) => state.auth.user)

  // ── Products from Redux (populated by handleGetSellerProducts) ─────────────
  const sellerProducts = useSelector((state) => state.product.sellerProducts)

  // ── LOCAL state for the dashboard's product-fetch loading/error ──────────────
  // WHY local instead of Redux product.loading?
  // CreateProduct.jsx also reads state.product.loading to disable its submit button.
  // If we used the Redux loading here, fetching products on dashboard mount would
  // disable the submit button in CreateProduct — making it appear "broken".
  const [localLoading, setLocalLoading] = useState(true)
  const [localError,   setLocalError]   = useState(null)

  // ── Hooks for logout and fetching products ───────────────────────────────
  const { handleSellerLogout }      = useSellerAuth()
  const { handleGetSellerProducts } = useSellerProduct()
  const navigate = useNavigate()

  // ── Mobile menu state ────────────────────────────────────────────────────
  const [menuOpen, setMenuOpen] = useState(false)

  // ── useEffect: fetch all seller products when page first loads ───────────
  // Wrapped in an async function so we can manage local loading/error state.
  useEffect(() => {
    const fetchProducts = async () => {
      setLocalLoading(true)
      setLocalError(null)
      const success = await handleGetSellerProducts()
      setLocalLoading(false)
      if (!success) {
        setLocalError('Could not load your products. Please try again.')
      }
    }
    fetchProducts()
  }, [])

  const handleLogout = async () => {
    await handleSellerLogout()
    navigate('/seller/login')
  }

  // ── Helper: make sure sellerProducts is always treated as an array ───────
  const products = Array.isArray(sellerProducts) ? sellerProducts : []
console.log(products)
  return (
    <div
      className="min-h-screen bg-slate-900 flex flex-col"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >

      {/* ══════════════════════════════════════════════════════════════════
          NAVBAR — white, sits above everything
      ══════════════════════════════════════════════════════════════════ */}
      <header className="shrink-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 h-14
                         px-4 sm:px-8 lg:px-12 flex items-center justify-between relative z-50">

        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center p-1">
            <img
              src="/styleverse-logo.png"
              onError={(e) => { e.currentTarget.src = DEFAULT_LOGO }}
              alt="StyleVerse"
              className="w-full h-full object-contain"
            />
          </div>
          <span
            className="text-base font-semibold text-slate-900 tracking-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            StyleVerse
          </span>
          <span className="hidden sm:inline text-[9px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
            Seller
          </span>
        </div>

        {/* Desktop nav — only Create Product + Logout */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            to="/seller/create-product"
            className="flex items-center gap-1.5 h-8 px-4 bg-indigo-700 hover:bg-indigo-800
                       text-white text-xs font-medium rounded-lg transition-all duration-200
                       shadow-sm hover:shadow-md hover:shadow-indigo-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Product
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 h-8 px-4 text-slate-600 hover:text-red-500
                       text-xs font-medium rounded-lg hover:bg-red-50 transition-all duration-200 ml-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 py-3 flex flex-col gap-2 z-40">
          <Link
            to="/seller/create-product"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 h-10 px-4 bg-indigo-700 text-white text-sm font-medium rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Product
          </Link>
          <button
            onClick={() => { setMenuOpen(false); handleLogout() }}
            className="flex items-center gap-2 h-10 px-4 border border-red-100 text-red-500 text-sm font-medium rounded-lg hover:bg-red-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1 — HERO with full background image
          The image covers the full section. All content sits on top of it.
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-56px)] flex items-center justify-center overflow-hidden">

        {/* Background fashion image — covers the entire section */}
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=90"
          alt="Fashion boutique background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/*
          Stronger overlay — from-slate-900/85 top, via-slate-900/70 middle, to-slate-900/88 bottom.
          This ensures all white text is 100% crisp and readable.
        */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/85 via-slate-900/70 to-slate-900/88" />

        {/* ── HERO CONTENT — sits above the image via z-10 ────────────── */}
        <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-8 flex flex-col items-center gap-8 py-16 sm:py-24 text-center">

          {/* StyleVerse logo mark — bigger */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/15 backdrop-blur-sm border border-white/30
                          flex items-center justify-center p-3">
            <img
              src="/styleverse-logo.png"
              onError={(e) => { e.currentTarget.src = DEFAULT_LOGO }}
              alt="StyleVerse"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Welcome heading — fully opaque white */}
          <div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Welcome{user?.fullName ? `, ${user.fullName}` : ' to StyleVerse'}
            </h1>
            <p className="text-white text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
              Your storefront on the world's most curated fashion marketplace.
            </p>
            <div className="mt-6 flex justify-center">
              <div className="w-12 h-0.5 bg-white/50 rounded-full" />
            </div>
          </div>

          {/* Brand quote — fully opaque white */}
          <p
            className="text-white text-base sm:text-lg leading-relaxed max-w-2xl"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            <span className="text-indigo-300 text-3xl font-bold leading-none align-middle mr-1">"</span>
            StyleVerse is where independent fashion meets a global audience.
            Every designer and boutique deserves the spotlight once reserved for big labels.
            <span className="text-indigo-300 text-3xl font-bold leading-none align-middle ml-1">"</span>
          </p>

          {/* Stat pills — glassmorphism, larger text */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 w-full">
            {STATS.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 bg-white/15 backdrop-blur-sm border border-white/25
                           rounded-full px-6 py-2.5 w-full sm:w-auto justify-center"
              >
                <span className="text-indigo-300 font-bold text-base">{s.num}</span>
                <span className="text-white text-sm">{s.label}</span>
              </div>
            ))}
          </div>

          {/*
            Create New Product — uses NavLink so the router marks this route as active.
            Bigger button: h-14, px-10, text-base font-semibold, scale on hover.
          */}
          <NavLink
            to="/seller/create-product"
            className="flex items-center gap-2.5 h-14 px-10
                       bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700
                       text-white text-base font-semibold rounded-2xl
                       transition-all duration-200
                       shadow-xl shadow-indigo-900/60
                       hover:shadow-2xl hover:shadow-indigo-600/50
                       hover:scale-[1.03] active:scale-[0.98]
                       border border-indigo-400/40"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create New Product
          </NavLink>

          {/* Scroll hint arrow */}
          <div className="flex flex-col items-center gap-1.5 opacity-60 animate-bounce mt-1">
            <span className="text-white text-xs uppercase tracking-widest">Scroll for your products</span>
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2 — ALL SELLER PRODUCTS
          Fetched automatically via useEffect + handleGetSellerProducts.
          Shows loading, error, or a product grid.
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-slate-900 py-14 px-4 sm:px-8 lg:px-16">

        {/* Section heading */}
        <div className="max-w-6xl mx-auto mb-10">
          <h2
            className="text-2xl sm:text-3xl font-semibold text-white mb-1"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Your Products
          </h2>
          <p className="text-slate-400 text-sm">
            {products.length > 0
              ? `You have ${products.length} product${products.length > 1 ? 's' : ''} listed.`
              : 'No products listed yet.'}
          </p>
          <div className="mt-4 w-8 h-0.5 bg-indigo-400 rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto">

          {/* ── LOADING STATE ────────────────────────────────────────── */}
          {localLoading && (
            <div className="flex items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-2 border-slate-700 border-t-indigo-400 rounded-full animate-spin" />
              <p className="text-slate-400 text-sm">Loading your products...</p>
            </div>
          )}

          {/* ── ERROR STATE ──────────────────────────────────────────── */}
          {!localLoading && localError && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 text-sm font-medium">
                {localError}
              </p>
              <button
                onClick={() => {
                  setLocalError(null)
                  setLocalLoading(true)
                  handleGetSellerProducts().finally(() => setLocalLoading(false))
                }}
                className="text-xs text-indigo-600 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* ── EMPTY STATE ──────────────────────────────────────────── */}
          {!localLoading && !localError && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-slate-500 text-sm">You haven't listed any products yet.</p>
              <Link
                to="/seller/create-product"
                className="text-xs text-indigo-600 font-medium hover:underline"
              >
                + Create your first product
              </Link>
            </div>
          )}

          {/* ── PRODUCTS GRID ────────────────────────────────────────── */}
          {!localLoading && !localError && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product) => (
                <div
                onClick={()=>{navigate(`/seller/product/${product._id}`)}}
                  key={product._id}
                  className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700
                             shadow-[0_2px_20px_rgba(0,0,0,0.25)]
                             hover:shadow-[0_8px_30px_rgba(79,70,229,0.20)]
                             hover:border-indigo-500/50 transition-all duration-200 group"
                >
                  {/* Product image */}
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt || product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      /* Placeholder when no image */
                      <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                        <svg className="w-10 h-10 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Image count badge */}
                    {product.images && product.images.length > 1 && (
                      <span className="absolute top-2 right-2 bg-slate-900/70 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
                        +{product.images.length - 1} more
                      </span>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="p-4">
                    <h3
                      className="text-sm font-semibold text-white mb-1 truncate"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                      title={product.title}
                    >
                      {product.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-400 font-bold text-sm">
                        {product.price?.currency === 'INR' ? '₹' : product.price?.currency + ' '}
                        {Number(product.price?.amount).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-indigo-300 bg-indigo-900/40 border border-indigo-700/50 px-2 py-0.5 rounded-full">
                        Listed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-100 h-10 px-4 sm:px-10 flex items-center justify-between">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest">
          StyleVerse Seller Portal
        </p>
        <p className="hidden sm:block text-[10px] text-slate-500">
          Elevating fashion, one listing at a time ✦
        </p>
      </footer>

    </div>
  )
}

export default SellerDashboard
