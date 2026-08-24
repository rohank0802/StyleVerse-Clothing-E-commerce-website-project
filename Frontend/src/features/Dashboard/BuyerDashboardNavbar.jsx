import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

function BuyerDashboardNavbar() {
  // Read logged-in user from Redux auth slice
  const user = useSelector((state) => state.auth.user)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all duration-200" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* ── LEFT: Navigation Links ───────────────────────────────────────── */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <NavLink
              to="/seller/login"
              className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full border border-indigo-100 transition-colors"
            >
              Seller Portal ✦
            </NavLink>
          </nav>
        </div>

        {/* ── RIGHT TOP CORNER: Login & Register Links / Profile ───────────── */}
        <div className="flex items-center gap-3">
          {user ? (
            /* If User is Logged In */
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs text-slate-600 font-medium">
                Hi, <span className="font-semibold text-slate-900">{user.fullName || user.email?.split('@')[0]}</span>
              </span>
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center shadow-sm">
                {(user.fullName || user.email || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
          ) : (
            /* If User is NOT Logged In → Login & Register Buttons */
            <div className="flex items-center gap-2 sm:gap-3">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all duration-200 ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-slate-50'
                  }`
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl text-white transition-all duration-200 shadow-sm hover:shadow-md ${
                    isActive
                      ? 'bg-indigo-800 shadow-indigo-200'
                      : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'
                  }`
                }
              >
                Register
              </NavLink>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* ── MOBILE MENU DROPDOWN ─────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3 shadow-lg">
          <NavLink
            to="/seller/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-indigo-600"
          >
            Become a Seller / Seller Portal
          </NavLink>

          {!user && (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default BuyerDashboardNavbar
