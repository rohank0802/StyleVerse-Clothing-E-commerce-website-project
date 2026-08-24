import React from 'react'

const ProductVariant = ({ variants = [], selectedVariant = null, onSelectVariant }) => {
  if (!variants || variants.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-8 text-center text-slate-400 text-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-slate-400 text-xl mb-3">
          ✦
        </div>
        <p className="font-semibold text-slate-200 text-sm">No Variants Added Yet</p>
        <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
          Click the <strong className="text-indigo-400">"Add Variant"</strong> button above to add custom size, color, stock, or price options.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header Helper info */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Click any variant card below to preview its specific data on the main product section above.</span>
        {selectedVariant && (
          <button
            onClick={() => onSelectVariant && onSelectVariant(null)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline flex items-center gap-1 shrink-0"
          >
            ← Reset to Main Product
          </button>
        )}
      </div>

      {/* Grid of Variant Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {variants.map((v, idx) => {
          const isSelected = selectedVariant && (selectedVariant._id === v._id || selectedVariant.sku === v.sku)

          // Extract first image URL
          const firstImg = Array.isArray(v.images) && v.images.length > 0
            ? (typeof v.images[0] === 'object' ? v.images[0].url : v.images[0])
            : null

          const priceVal = typeof v.price === 'object' ? v.price?.amount || 0 : Number(v.price) || 0

          return (
            <div
              key={v._id || v.sku || idx}
              onClick={() => onSelectVariant && onSelectVariant(isSelected ? null : v)}
              className={`rounded-2xl p-4 flex flex-col justify-between transition-all cursor-pointer border relative overflow-hidden group ${
                isSelected
                  ? 'bg-indigo-950/70 border-indigo-500 ring-2 ring-indigo-500/50 shadow-xl shadow-indigo-950/80 scale-[1.01]'
                  : 'bg-slate-900 border-slate-700/80 hover:border-indigo-400/60 hover:bg-slate-900/90 shadow-md'
              }`}
            >
              {/* Selected Badge Ribbon */}
              {isSelected && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] font-bold uppercase px-3 py-0.5 rounded-bl-xl shadow-sm">
                  Active Preview ✓
                </div>
              )}

              {/* Card Content Top */}
              <div className="flex items-start gap-3.5 mb-3">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center text-slate-500 text-xs font-semibold">
                  {firstImg ? (
                    <img
                      src={firstImg}
                      alt={v.sku || 'Variant'}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  ) : (
                    <span className="text-[10px] text-slate-600">No Image</span>
                  )}
                </div>

                {/* SKU & Stock */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1 pr-12">
                    <span className="text-xs font-bold text-white uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded border border-slate-700 truncate">
                      {v.sku}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      v.stock > 0
                        ? 'text-emerald-400 bg-emerald-950/80 border border-emerald-500/30'
                        : 'text-rose-400 bg-rose-950/80 border border-rose-500/30'
                    }`}>
                      {v.stock > 0 ? `Stock: ${v.stock}` : 'Out of Stock'}
                    </span>

                    {priceVal > 0 && (
                      <span className="text-xs font-bold text-indigo-400">
                        ₹{priceVal.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Specs & Attributes */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  {v.size && (
                    <span>Size: <strong className="text-white font-semibold">{v.size}</strong></span>
                  )}
                  {v.color && (
                    <span>Color: <strong className="text-white font-semibold">{v.color}</strong></span>
                  )}
                </div>

                {/* Attributes (Material / Fit) */}
                {v.attributes && Object.keys(v.attributes).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {Object.entries(v.attributes).map(([key, val]) => (
                      <span key={key} className="text-[10px] text-slate-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md">
                        {key}: <strong className="text-slate-200">{val}</strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Click Hint */}
              <div className="mt-3 pt-2 text-[10px] font-semibold text-right transition-colors">
                {isSelected ? (
                  <span className="text-indigo-400">Showing on Main Product ↑</span>
                ) : (
                  <span className="text-slate-500 group-hover:text-indigo-300">Click to preview data →</span>
                )}
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProductVariant
