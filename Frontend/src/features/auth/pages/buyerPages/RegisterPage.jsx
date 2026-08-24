import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setError } from '../../auth.slice.js'
import { useAuth } from "../../hook/useAuth.js"
import ContinueWithGoogle from '../../components/ContinueWithGoogle.jsx'

const DEFAULT_LOGO = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'><rect width='100' height='100' rx='24' fill='%234F46E5'/><path d='M32 38C32 38 40 24 50 24C60 24 68 38 68 38' stroke='white' stroke-width='6' stroke-linecap='round'/><path d='M26 38H74L70 76C70 78.2091 68.2091 80 66 80H34C31.7909 80 30 78.2091 30 76L26 38Z' fill='white' fill-opacity='0.15' stroke='white' stroke-width='6' stroke-linejoin='round'/><path d='M43 48C43 51.866 46.134 55 50 55C53.866 55 57 51.866 57 48' stroke='white' stroke-width='5' stroke-linecap='round'/></svg>"

const RegisterPage = () => {

  const { handleRegister } = useAuth()
  const dispatch = useDispatch()

  // ── Redux state for loading & error ──────────────────────────────────────
  const loading = useSelector((state) => state.auth.loading)
  const reduxError = useSelector((state) => state.auth.error)

  // ── Single combined form state object ─────────────────────────────────────
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contact: '',
    password: '',
  })

  // ── UI-only states ─────────────────────────────────────────────────────────
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState('')   // client-side validation error
  const [success, setSuccess] = useState('')

  const navigate = useNavigate()

  // ── Ref to track whether we are awaiting an API response ──────────────────
  // const pendingSuccess = useRef(false)

  // // ── After the API call finishes, decide whether to show success ───────────
  // useEffect(() => {
  //   if (pendingSuccess.current && !loading) {
  //     pendingSuccess.current = false
  //     if (!reduxError) {
  //       // ✅ API succeeded → show success
  //       setSuccess('Account created! Redirecting...')
  //       // setTimeout(() => navigate('/login'), 1500)
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
    if (!formData.fullName.trim()) {
      setFormError('Full name is required.')
      return
    }
    if (formData.fullName.trim().length < 2) {
      setFormError('Full name must be at least 2 characters.')
      return
    }
    if (!formData.email.trim()) {
      setFormError('Email address is required.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      setFormError('Please enter a valid email address.')
      return
    }
    if (!formData.contact.trim()) {
      setFormError('Contact / phone number is required.')
      return
    }
    if (formData.contact.trim().length < 7) {
      setFormError('Contact number must be at least 7 digits.')
      return
    }
    if (!formData.password.trim()) {
      setFormError('Password is required.')
      return
    }
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters.')
      return
    }

    setFormError('')          // clear any previous validation error
    dispatch(setError(null))  // clear any stale Redux error from a previous attempt

    // pendingSuccess.current = true   // arm the useEffect guard
    const result = await handleRegister(formData)
    if (result) {
      setSuccess('Account created! Redirecting...')
      setTimeout(() => navigate('/buyer/verify-email'), 1500)
    }
    // Success message is handled in the useEffect above
  }

  return (
    // h-screen + overflow-hidden = exactly one viewport, no scroll
    <div className="h-screen overflow-hidden flex">

      {/* ── LEFT PANEL ── Indigo gradient ───────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden">

        {/* Fashion model background image */}
        <img
          src="/fashion-model-buyer-register.png"
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
            Dress to Impress
          </p>

          <div className="w-12 h-px bg-indigo-400/80 mx-auto mb-4" />

          <p className="text-indigo-100 text-sm leading-relaxed max-w-xs mx-auto drop-shadow" style={{ fontFamily: 'Inter, sans-serif' }}>
            Explore curated styles for every occasion. Join thousands of style-conscious shoppers.
          </p>

          {/* Feature bullets */}
          <div className="mt-8 space-y-3 text-left">
            {[
              { icon: '✦', text: 'Curated fashion collections' },
              { icon: '✦', text: 'Exclusive member deals' },
              { icon: '✦', text: 'Fast & secure checkout' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-indigo-300 text-xs">{item.icon}</span>
                <span className="text-indigo-100 text-sm drop-shadow" style={{ fontFamily: 'Inter, sans-serif' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── White form (h-full so it fills the screen height) ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 bg-white h-full">
        <div className="w-full max-w-md">

          {/* Mobile-only logo (left panel hidden on small screens) */}
          <div className="lg:hidden text-center mb-5">
            <div className="flex justify-center mb-2">
              <img src="/styleverse-logo.png" onError={(e) => { e.currentTarget.src = DEFAULT_LOGO; }} alt="StyleVerse" className="w-12 h-12 object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-indigo-800" style={{ fontFamily: 'Playfair Display, serif' }}>
              StyleVerse
            </h2>
          </div>

          {/* Heading */}
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
              Create Account
            </h2>
            <p className="text-slate-500 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Join StyleVerse today — it's free!
            </p>
          </div>

          {/* continue with google */}
          <ContinueWithGoogle />
          <br />
          {/* Client-side validation error */}
          {formError && (
            <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
              {formError}
            </div>
          )}
          {/* API / Redux error */}
          {reduxError && (
            <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
               {Array.isArray(reduxError)?(
                reduxError.map((err,index)=>(<p key={index}>{err.msg}</p>))
              ):
              (
                <p>{reduxError}</p>
              )}
            </div>
          )}
          {/* Success */}
          {success && (
            <div className="mb-4 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
              {success}
            </div>
          )}

          {/* ── Registration Form ──────────────────────────────────────── */}
          {/*
            Each input has `name` matching a key in formData.
            handleChange reads e.target.name and updates only that key.
          */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Full Name
              </label>
              <input
                id="fullName" name="fullName" type="text"
                placeholder="e.g. John Doe"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full h-10 px-4 border border-slate-200 rounded-lg text-slate-800 text-sm placeholder-slate-400
                           focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Email Address
              </label>
              <input
                id="email" name="email" type="email"
                placeholder="e.g. john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-10 px-4 border border-slate-200 rounded-lg text-slate-800 text-sm placeholder-slate-400
                           focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Contact */}
            <div>
              <label htmlFor="contact" className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Contact / Phone
              </label>
              <input
                id="contact" name="contact" type="tel"
                placeholder="e.g. +91 98765 43210"
                value={formData.contact}
                onChange={handleChange}
                className="w-full h-10 px-4 border border-slate-200 rounded-lg text-slate-800 text-sm placeholder-slate-400
                           focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-10 px-4 pr-16 border border-slate-200 rounded-lg text-slate-800 text-sm placeholder-slate-400
                             focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                {/* Show / Hide toggle — only changes showPassword state, not formData */}
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-lg
                         transition-all duration-200 text-sm tracking-wide
                         disabled:opacity-60 disabled:cursor-not-allowed
                         shadow-md hover:shadow-indigo-200 hover:shadow-lg"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          {/* Already have account */}
          <p className="mt-4 text-center text-sm text-slate-500" style={{ fontFamily: 'Inter, sans-serif' }}>
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-700 font-semibold hover:text-indigo-900 hover:underline transition-colors">
              Login
            </Link>
          </p>

          {/* ── register as Seller — bottom quick-link ───────────────────── */}
          <div className="mt-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-400 uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif' }}>or</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            <Link
              to="/seller/register"
              state={{ role: 'seller' }}
              className="w-full h-10 flex items-center justify-center gap-2
                         border-2 border-slate-200 text-slate-600 font-semibold text-sm rounded-lg
                         hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-700 transition-all duration-200"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5l9 9-7 7-9-9V3z" />
              </svg>
              Register as Seller
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
export default RegisterPage