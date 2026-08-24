import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setError } from '../../auth.slice.js'
import { useSellerAuth } from '../../hook/useSellerAuth.js'

const DEFAULT_LOGO = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'><rect width='100' height='100' rx='24' fill='%234F46E5'/><path d='M32 38C32 38 40 24 50 24C60 24 68 38 68 38' stroke='white' stroke-width='6' stroke-linecap='round'/><path d='M26 38H74L70 76C70 78.2091 68.2091 80 66 80H34C31.7909 80 30 78.2091 30 76L26 38Z' fill='white' fill-opacity='0.15' stroke='white' stroke-width='6' stroke-linejoin='round'/><path d='M43 48C43 51.866 46.134 55 50 55C53.866 55 57 51.866 57 48' stroke='white' stroke-width='5' stroke-linecap='round'/></svg>"

const SellerLoginPage = () => {
  const { handleSellerLogin } = useSellerAuth()
  const dispatch = useDispatch()

  // ── Redux state for loading & error ──────────────────────────────────────
  const loading = useSelector((state) => state.auth.loading)
  const reduxError = useSelector((state) => state.auth.error)

  // ── Single combined form state object ─────────────────────────────────────
  // identifier = email OR phone number
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  })

  // ── UI-only states ─────────────────────────────────────────────────────────
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState('')   // client-side validation error
  const [success, setSuccess] = useState('')

  const navigate = useNavigate()

  // ── Ref to track whether we are awaiting an API response ──────────────────
  // const pendingNav = useRef(false)

  // // ── After the API call finishes (loading flips to false), decide what to do ─
  // useEffect(() => {
  //   if (pendingNav.current && !loading) {
  //     pendingNav.current = false
  //     if (!reduxError) {
  //       // ✅ API succeeded → navigate
  //       setSuccess('Login successful! Redirecting...')
  //       setTimeout(() => navigate('/seller/dashboard'), 1200)
  //     }
  //     // ❌ API failed → reduxError is already in state and shown in JSX
  //   }
  // }, [loading]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Generic change handler — one handler for all inputs ───────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // ── Handle Form Submit ─────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()

    // ── Client-side validation (shown before calling the API) ────────────────
    if (!formData.identifier.trim()) {
      setFormError('Please enter your email or phone number.')
      return
    }
    if (!formData.password.trim()) {
      setFormError('Password is required.')
      return
    }
    setFormError('')          // clear any previous validation error
    dispatch(setError(null))  // clear any stale Redux error from a previous attempt

    // If identifier contains '@' it's an email, otherwise it's a contact number
    const isEmail = formData.identifier.includes('@')
    const loginPayload = isEmail
      ? { email: formData.identifier, password: formData.password }
      : { contact: formData.identifier, password: formData.password }

    // pendingNav.current = true   // arm the useEffect guard
    const result = await handleSellerLogin(loginPayload)
    if (result) {
      setSuccess('Login successful! Redirecting...')
      setTimeout(() => navigate('/seller/dashboard'), 1200)
    }
    // Navigation / success message is handled in the useEffect above
  }

  return (
    // h-screen + overflow-hidden = exactly one viewport, no scroll
    <div className="h-screen overflow-hidden flex">

      {/* ── LEFT PANEL ── Indigo gradient ───────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden">

        {/* Fashion model background image */}
        <img
          src="/fashion-model-seller-login.png"
          alt="Fashion model"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Dark indigo gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-indigo-800/70 to-slate-900/85" />

        {/* Bottom fade for polish */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-900/60 to-transparent" />

        <div className="relative z-10 text-center px-12">
          {/* Logo */}
          <div className="mb-5 flex justify-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl p-1">
              <img src="/styleverse-logo.png" onError={(e) => { e.currentTarget.src = DEFAULT_LOGO; }} alt="StyleVerse logo" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Brand */}
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
            StyleVerse
          </h1>
          <p className="text-indigo-200 text-lg font-medium mb-4 drop-shadow" style={{ fontFamily: 'Playfair Display, serif' }}>
            Seller Portal
          </p>

          <div className="w-12 h-px bg-indigo-400/80 mx-auto mb-4" />

          <p className="text-indigo-100 text-sm leading-relaxed max-w-xs mx-auto drop-shadow" style={{ fontFamily: 'Inter, sans-serif' }}>
            Sign back in to manage your store, track sales, and grow your business with StyleVerse.
          </p>

          {/* Feature bullets */}
          <div className="mt-8 space-y-3 text-left">
            {[
              { icon: '✦', text: 'Manage your product listings' },
              { icon: '✦', text: 'Track orders & revenue' },
              { icon: '✦', text: 'Reach thousands of buyers' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-indigo-300 text-xs">{item.icon}</span>
                <span className="text-indigo-100 text-sm drop-shadow" style={{ fontFamily: 'Inter, sans-serif' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── White form (h-full fills the screen height) ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 bg-white h-full">
        <div className="w-full max-w-md">

          {/* Mobile-only logo (left panel hidden on small screens) */}
          <div className="lg:hidden text-center mb-6">
            <div className="flex justify-center mb-2">
              <img src="/styleverse-logo.png" onError={(e) => { e.currentTarget.src = DEFAULT_LOGO; }} alt="StyleVerse" className="w-12 h-12 object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-indigo-800" style={{ fontFamily: 'Playfair Display, serif' }}>
              StyleVerse
            </h2>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
              Seller Sign In
            </h2>
            <p className="text-slate-500 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Welcome back, Seller! Please enter your credentials.
            </p>
          </div>

          {/* Client-side validation error */}
          {formError && (
            <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
              {formError}
            </div>
          )}
          {/* API / Redux error */}
          {reduxError && (
            <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
              {reduxError}
            </div>
          )}
          {/* Success — local UI state */}
          {success && (
            <div className="mb-4 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
               {Array.isArray(reduxError)?(
                reduxError.map((err,index)=>(<p key={index}>{err.msg}</p>))
              ):
              (
                <p>{reduxError}</p>
              )}
            </div>
          )}

          {/* ── Seller Login Form ─────────────────────────────────────────────── */}
          {/*
            Each input has `name` matching a key in formData.
            handleChange reads e.target.name and updates only that key.
          */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email or Contact */}
            <div>
              <label htmlFor="seller-identifier" className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Email or Contact
              </label>
              <input
                id="seller-identifier" name="identifier" type="text"
                placeholder="Enter your email or phone number"
                value={formData.identifier}
                onChange={handleChange}
                className="w-full h-11 px-4 border border-slate-200 rounded-lg text-slate-800 text-sm placeholder-slate-400
                           focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="seller-password" className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Password
              </label>
              <div className="relative">
                <input
                  id="seller-password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-11 px-4 pr-16 border border-slate-200 rounded-lg text-slate-800 text-sm placeholder-slate-400
                             focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                {/* Show / Hide toggle — only changes showPassword state */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors text-xs font-medium"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Submit — loading comes from Redux */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-lg
                         transition-all duration-200 text-sm tracking-wide
                         disabled:opacity-60 disabled:cursor-not-allowed
                         shadow-md hover:shadow-indigo-200 hover:shadow-lg"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {loading ? 'Signing In...' : 'Seller Login'}
            </button>
          </form>

          {/* Don't have an account */}
          <p className="mt-6 text-center text-sm text-slate-500" style={{ fontFamily: 'Inter, sans-serif' }}>
            New seller?{' '}
            <Link to="/seller/register" className="text-indigo-700 font-semibold hover:text-indigo-900 hover:underline transition-colors">
              Create Seller Account
            </Link>
          </p>

          {/* ── Login as Buyer — bottom quick-link ───────────────────── */}
          <div className="mt-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-400 uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif' }}>or</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            <Link
              to="/login"
              className="w-full h-10 flex items-center justify-center gap-2
                         border-2 border-slate-200 text-slate-600 font-semibold text-sm rounded-lg
                         hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-700 transition-all duration-200"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Login as Buyer
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
export default SellerLoginPage