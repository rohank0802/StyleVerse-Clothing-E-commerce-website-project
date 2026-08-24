import React, { useState, useEffect } from 'react'
import { useSellerProduct } from '../../hook/useSellerProduct.js'

const MAX_IMAGES = 7

const CreateVariant = ({ productId, existingVariants = [], isOpen, onClose, onSuccess }) => {
  const { handleCreateSellerVariant } = useSellerProduct()

  // ── INITIAL FORM STATE ──────────────────────────────────────────────────
  const initialFormState = {
    sku: '',
    color: '',
    size: 'M',
    priceAmount: '',
    stock: '',
    material: '',
    fit: '',
  }

  // ── OWN LOCAL STATES (Not taking from Redux as requested) ─────────────────
  const [formData, setFormData] = useState(initialFormState)
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState('')

  // ── Reset Form whenever Modal is opened ──────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormState)
      setImages([])
      setPreviews([])
      setError(null)
      setSuccess('')
      setLoading(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  // ── Input Change Handler ──────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // ── Image Selection Handler ───────────────────────────────────────────────
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    const slotsLeft = MAX_IMAGES - images.length

    if (selectedFiles.length > slotsLeft) {
      setError(`You can only upload up to ${MAX_IMAGES} images for a variant.`)
      return
    }

    setError(null)
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file))
    setImages((prev) => [...prev, ...selectedFiles])
    setPreviews((prev) => [...prev, ...newPreviews])
  }

  // ── Remove Image Handler ──────────────────────────────────────────────────
  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(previews[index])
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // ── Form Submit Handler ───────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess('')

    const inputSku = formData.sku.trim().toUpperCase()

    // Client-side validations
    if (!inputSku) {
      setError('SKU code is required (e.g. TS-BLACK-M).')
      setLoading(false)
      return
    }

    // Single product SKU check: Each variant in THIS product must have a unique SKU
    const isSkuDuplicate = Array.isArray(existingVariants) && existingVariants.some(
      (v) => v.sku && v.sku.trim().toUpperCase() === inputSku
    )

    if (isSkuDuplicate) {
      setError(`SKU "${inputSku}" already exists for this product. Please enter a different SKU.`)
      setLoading(false)
      return
    }

    if (!formData.size.trim()) {
      setError('Size is required.')
      setLoading(false)
      return
    }
    if (!formData.stock || Number(formData.stock) < 0) {
      setError('Stock quantity must be a non-negative number.')
      setLoading(false)
      return
    }

    try {
      // Build FormData to send to backend API
      const payload = new FormData()
      payload.append('sku', inputSku)
      if (formData.color.trim()) payload.append('color', formData.color.trim())
      payload.append('size', formData.size.trim())
      payload.append('stock', Number(formData.stock))

      // Price object
      if (formData.priceAmount) {
        payload.append('price', JSON.stringify({ amount: Number(formData.priceAmount) }))
      }

      // Attributes object (material, fit)
      const attributesObj = {}
      if (formData.material.trim()) attributesObj.material = formData.material.trim()
      if (formData.fit.trim()) attributesObj.fit = formData.fit.trim()
      if (Object.keys(attributesObj).length > 0) {
        payload.append('attributes', JSON.stringify(attributesObj))
      }

      // Append image files if any selected
      images.forEach((file) => {
        payload.append('images', file)
      })

      // Call API hook function
      const res = await handleCreateSellerVariant(productId, payload)

      if (res && res.success !== false) {
        setSuccess('Variant created successfully!')
        setTimeout(() => {
          if (onSuccess) onSuccess()
          onClose()
        }, 1000)
      } else {
        const errMsg = typeof res === 'string' ? res : (res?.message || 'Failed to create variant.')
        setError(errMsg)
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred while creating variant.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 text-white">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400 text-sm font-bold">
              ✦
            </div>
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              Create Product Variant
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* LOCAL ERROR BANNER */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <span className="font-bold">!</span>
              <span>{typeof error === 'string' ? error : 'Validation or server error occurred.'}</span>
            </div>
          )}

          {/* LOCAL SUCCESS BANNER */}
          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-pulse">
              <span className="font-bold">✓</span>
              <span>{success}</span>
            </div>
          )}

          {/* Row 1: SKU, Color, Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                SKU Code <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="TS-BLACK-M"
                required
                className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Color
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="black"
                className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Size <span className="text-rose-400">*</span>
              </label>
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Price Amount & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Variant Price (₹)
              </label>
              <input
                type="number"
                name="priceAmount"
                value={formData.priceAmount}
                onChange={handleChange}
                placeholder="500"
                min="0"
                className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Stock Quantity <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="20"
                min="0"
                required
                className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Row 3: Attributes (Material, Fit) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Material Attribute
              </label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                placeholder="Cotton"
                className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Fit Attribute
              </label>
              <input
                type="text"
                name="fit"
                value={formData.fit}
                onChange={handleChange}
                placeholder="Oversized"
                className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Variant Images Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Variant Images <span className="text-slate-500 font-normal">(Up to 7 images)</span>
            </label>

            {previews.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {previews.map((src, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 group">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length < MAX_IMAGES && (
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl bg-slate-950/60 cursor-pointer transition-colors text-center">
                <svg className="w-6 h-6 text-slate-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-slate-300 font-medium">Click to select variant photos</span>
                <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, WEBP up to 7MB each</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-2 border border-indigo-400/30 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving Variant...
                </>
              ) : (
                'Save Variant'
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}

export default CreateVariant
