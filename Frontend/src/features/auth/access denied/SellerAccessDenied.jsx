import React from 'react'
import { NavLink, Link } from 'react-router-dom'

// ── Fallback logo SVG ───────────────────────────────────────────────────────
const DEFAULT_LOGO =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'><rect width='100' height='100' rx='24' fill='%234F46E5'/><path d='M32 38C32 38 40 24 50 24C60 24 68 38 68 38' stroke='white' stroke-width='6' stroke-linecap='round'/><path d='M26 38H74L70 76C70 78.2091 68.2091 80 66 80H34C31.7909 80 30 78.2091 30 76L26 38Z' fill='white' fill-opacity='0.15' stroke='white' stroke-width='6' stroke-linejoin='round'/><path d='M43 48C43 51.866 46.134 55 50 55C53.866 55 57 51.866 57 48' stroke='white' stroke-width='5' stroke-linecap='round'/></svg>"

const SellerAccessDenied = () => {
  return (
    <div
      className="h-screen w-screen overflow-hidden bg-slate-950 flex flex-col justify-between relative text-white"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* ── BACKGROUND FASHION IMAGE WITH GRADIENT OVERLAY ───────────────── */}
      <img
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=90"
        alt="Fashion boutique background"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40 scale-105 filter blur-[1px]"
      />
      {/* Dark overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/80 to-slate-950/95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0,transparent_70%)]" />

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <header className="relative z-10 shrink-0 px-6 sm:px-12 py-5 flex items-center justify-between border-b border-white/10 bg-slate-900/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center p-1.5 shadow-lg shadow-indigo-500/20">
            <img
              src="/styleverse-logo.png"
              onError={(e) => { e.currentTarget.src = DEFAULT_LOGO }}
              alt="StyleVerse"
              className="w-full h-full object-contain"
            />
          </div>
          <span
            className="text-lg font-semibold tracking-tight text-white"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            StyleVerse
          </span>
        </div>

        <Link
          to="/seller/dashboard"
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors duration-200 bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Seller Dashboard
        </Link>
      </header>

      {/* ── MAIN CONTENT CARD ────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-xl mx-auto">
          {/* Glassmorphism Card */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900/70 border border-white/15 p-8 sm:p-10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-center flex flex-col items-center gap-6">
            
            {/* Top decorative glow pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Buyer Area Restricted
            </div>

            {/* Lock / Shopping Icon badge */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-900/60 to-amber-900/40 border border-white/20 flex items-center justify-center shadow-xl shadow-indigo-950/80">
                <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-500 border-2 border-slate-900 flex items-center justify-center text-slate-950 text-xs font-bold shadow-md">
                !
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1
                className="text-2xl sm:text-3xl font-semibold text-white leading-tight"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Shopping Account Required
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                You are currently signed in as a <span className="text-amber-300 font-semibold underline decoration-amber-500/40 underline-offset-4">Seller</span>. Seller accounts cannot place consumer orders or access buyer-only shopping pages.
              </p>
            </div>

            {/* Information Banner */}
            <div className="w-full bg-indigo-950/50 border border-indigo-500/30 rounded-2xl p-4 text-left flex items-start gap-3.5 text-xs sm:text-sm text-slate-200">
              <div className="p-1.5 bg-indigo-600/30 rounded-lg text-indigo-300 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-white">Want to shop on StyleVerse?</p>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Register a separate Buyer account to explore curated collections, save items to your wishlist, and make purchases.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <NavLink
                to="/register"
                className="w-full sm:w-auto flex-1 h-12 px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 border border-indigo-400/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Register as a Buyer
              </NavLink>

              <NavLink
                to="/login"
                className="w-full sm:w-auto flex-1 h-12 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Switch to Buyer Login
              </NavLink>
            </div>

          </div>
        </div>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="relative z-10 shrink-0 py-3 px-6 text-center border-t border-white/5 bg-slate-950/60 backdrop-blur-md">
        <p className="text-[11px] text-slate-400">
          StyleVerse Fashion Marketplace &copy; {new Date().getFullYear()} &bull; All Rights Reserved
        </p>
      </footer>
    </div>
  )
}

export default SellerAccessDenied
