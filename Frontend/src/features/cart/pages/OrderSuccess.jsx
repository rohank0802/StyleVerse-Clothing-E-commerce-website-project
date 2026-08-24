import React from 'react'
import { useLocation, Link } from 'react-router-dom'

/**
 * OrderSuccess Component (Buyer Experience)
 * --------------------------------------------------------------------------
 * Premium luxury order confirmation screen following StyleVerse editorial guidelines.
 * Displays order ID extracted from query params (`order_id`), summary highlights,
 * and quick navigation actions.
 */
function OrderSuccess() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const orderId = queryParams.get('order_id') || 'ORD-9A33XWu170gUtm'
  
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const handlePrint = () => {
    window.print()
  }

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-12 flex items-center justify-center"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div className="max-w-3xl w-full space-y-8">
        
        {/* ── MAIN SUCCESS CARD ────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
          
          {/* Top Decorative Gradient Banner */}
          <div className="h-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600" />

          <div className="p-6 sm:p-10 space-y-8 text-center sm:text-left">
            
            {/* Celebration Icon & Header */}
            <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-inner relative">
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-75" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full" />
                <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  Payment Verified
                </div>
                <h1
                  className="text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Thank You For Your Order!
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Your payment was processed successfully. A confirmation receipt has been sent to your email.
                </p>
              </div>
            </div>

            {/* ── ORDER DETAILS HIGHLIGHT GRID ────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              
              {/* Order ID */}
              <div className="space-y-1 sm:col-span-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Order ID
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-slate-900 break-all select-all">
                    {orderId}
                  </span>
                </div>
              </div>

              {/* Order Date */}
              <div className="space-y-1 sm:col-span-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Date Placed
                </span>
                <span className="text-sm font-semibold text-slate-800 block">
                  {currentDate}
                </span>
              </div>

              {/* Payment Method */}
              <div className="space-y-1 sm:col-span-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Payment Gateway
                </span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Razorpay Secured Payment
                </div>
              </div>

            </div>

            {/* ── ACTION BUTTONS ──────────────────────────────────────────── */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 justify-between border-t border-slate-100">
              
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold uppercase tracking-wider rounded-2xl transition-all shadow-md hover:scale-[1.01] text-center"
              >
                Continue Shopping
              </Link>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-2xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Receipt
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Security Footer */}
          <div className="bg-slate-900 text-slate-400 py-3.5 px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>256-Bit SSL Encrypted & Verified Transaction</span>
            </div>
            <span>StyleVerse Customer Support Available 24/7</span>
          </div>

        </div>

      </div>
    </div>
  )
}

export default OrderSuccess