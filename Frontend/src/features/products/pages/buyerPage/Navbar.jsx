import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SearchBar from './SearchBar.jsx'

const DEFAULT_LOGO = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'><rect width='100' height='100' rx='24' fill='%234F46E5'/><path d='M32 38C32 38 40 24 50 24C60 24 68 38 68 38' stroke='white' stroke-width='6' stroke-linecap='round'/><path d='M26 38H74L70 76C70 78.2091 68.2091 80 66 80H34C31.7909 80 30 78.2091 30 76L26 38Z' fill='white' fill-opacity='0.15' stroke='white' stroke-width='6' stroke-linejoin='round'/><path d='M43 48C43 51.866 46.134 55 50 55C53.866 55 57 51.866 57 48' stroke='white' stroke-width='5' stroke-linecap='round'/></svg>"

function Navbar() {
  // ── 1. Read user state from Redux store ─────────────────────────────────
  const user = useSelector((state) => state.auth.user)

  // ── 2. Read cart items from Redux store ──────────────────────────────────
  const rawCartItems = useSelector((state) => state.cart.items) || []

  // Extract items array if rawCartItems is container array [{ items: [...] }]
  const cartItemsList = Array.isArray(rawCartItems) && rawCartItems.length > 0 && Array.isArray(rawCartItems[0]?.items)
    ? rawCartItems[0].items
    : (Array.isArray(rawCartItems) ? rawCartItems : [])

  // ── 3. Calculate total quantity of items in the cart ─────────────────────
  const totalCartCount = cartItemsList.reduce((sum, item) => {
    return sum + (item.quantity || 1)
  }, 0)

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* ── LEFT CORNER: StyleVerse Logo & Navigation ───────────────── */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
              <img
                src="/styleverse-logo.png"
                onError={(e) => { e.currentTarget.src = DEFAULT_LOGO }}
                alt="StyleVerse"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>
              StyleVerse
            </span>
          </Link>

          {/* Home Link */}
          <nav className="flex items-center gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors duration-200 hover:text-indigo-300 ${
                  isActive ? 'text-indigo-400' : 'text-slate-300'
                }`
              }
            >
              Home
            </NavLink>
          </nav>
        </div>

        {/* ── MIDDLE: SearchBar Feature Component ────────────────────────── */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <SearchBar />
        </div>

        {/* ── RIGHT CORNER: Cart Logo & Profile Avatar ───────────────── */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* User Profile Avatar (if logged in) */}
          {user && (
            <div className="flex items-center gap-2.5 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {(user.fullName || user.email || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline-block text-xs text-slate-200 font-medium max-w-[120px] truncate">
                {user.fullName || user.email?.split('@')[0]}
              </span>
            </div>
          )}

          {/* Cart Icon with Live Quantity Badge */}
          <NavLink
            to="/buyer/cart"
            className={({ isActive }) =>
              `p-2 rounded-xl border transition-all duration-200 cursor-pointer relative ${
                isActive
                  ? 'text-white bg-slate-800 border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800 border-transparent hover:border-slate-700'
              }`
            }
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            {/* Cart Bag Icon */}
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>

            {/* Cart Quantity Badge (Shows when count > 0) */}
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-indigo-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-slate-900 shadow-sm animate-bounce">
                {totalCartCount}
              </span>
            )}
          </NavLink>

        </div>

      </div>
    </header>
  )
}

export default Navbar