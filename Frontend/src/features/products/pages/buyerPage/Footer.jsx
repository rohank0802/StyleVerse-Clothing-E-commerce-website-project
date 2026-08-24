import React from 'react'
import { Link } from 'react-router-dom'

// ── Fallback logo SVG ───────────────────────────────────────────────────────
const DEFAULT_LOGO =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'><rect width='100' height='100' rx='24' fill='%234F46E5'/><path d='M32 38C32 38 40 24 50 24C60 24 68 38 68 38' stroke='white' stroke-width='6' stroke-linecap='round'/><path d='M26 38H74L70 76C70 78.2091 68.2091 80 66 80H34C31.7909 80 30 78.2091 30 76L26 38Z' fill='white' fill-opacity='0.15' stroke='white' stroke-width='6' stroke-linejoin='round'/><path d='M43 48C43 51.866 46.134 55 50 55C53.866 55 57 51.866 57 48' stroke='white' stroke-width='5' stroke-linecap='round'/></svg>"

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* ── COL 1 & 2: BRAND & TAGLINE ────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center p-1.5 shadow-sm">
                <img
                  src="/styleverse-logo.png"
                  onError={(e) => { e.currentTarget.src = DEFAULT_LOGO }}
                  alt="StyleVerse"
                  className="w-full h-full object-contain"
                />
              </div>
              <span
                className="text-xl font-bold tracking-tight text-white"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                StyleVerse
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The premier destination for curated fashion. Connecting independent designers, boutiques, and fashion enthusiasts worldwide.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {['Instagram', 'Twitter', 'Facebook', 'Pinterest'].map((platform) => (
                <a
                  key={platform}
                  href={`#${platform}`}
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-indigo-600/30 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors duration-200"
                  aria-label={platform}
                >
                  {platform[0]}
                </a>
              ))}
            </div>
          </div>

          {/* ── COL 3: QUICK LINKS ────────────────────────────────────────── */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Marketplace</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">Featured Brands</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">New Arrivals</Link>
              </li>
              <li>
                <Link to="/seller/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sell on StyleVerse</Link>
              </li>
            </ul>
          </div>

          {/* ── COL 4: CUSTOMER CARE ──────────────────────────────────────── */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Help & Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Order Tracking</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Shipping & Delivery</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Returns & Exchanges</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              </li>
            </ul>
          </div>

          {/* ── COL 5: NEWSLETTER ─────────────────────────────────────────── */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Stay Connected</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe for exclusive drop alerts & curated style edits.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full h-9 px-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* ── BOTTOM BAR ─────────────────────────────────────────────────── */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} StyleVerse Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Cookie Settings</span>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer