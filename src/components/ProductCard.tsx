'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Zap, Search, Star } from 'lucide-react'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onTryOn?: (product: Product) => void
  onSave?: (product: Product) => void
  onFindSimilar?: (product: Product) => void
  isSaved?: boolean
}

const fitLabel = (compatibility: string[] = []): { label: string; color: string } => {
  if (compatibility.length >= 4) return { label: 'Perfect Fit', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' }
  if (compatibility.length >= 2) return { label: 'Good Fit', color: 'text-[#C9A84C] bg-[#C9A84C]/10 border-[#C9A84C]/30' }
  return { label: 'Might Fit', color: 'text-slate-400 bg-slate-400/10 border-slate-400/30' }
}

export default function ProductCard({ product, onTryOn, onSave, onFindSimilar, isSaved = false }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const [saved, setSaved] = useState(isSaved)
  const fit = fitLabel(product.bodyShapeCompatibility)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSaved(prev => !prev)
    onSave?.(product)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Discount badge */}
        {discount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            -{discount}%
          </div>
        )}

        {/* New badge */}
        {product.isNew && !discount && (
          <div className="absolute top-3 left-3 bg-[#C9A84C] text-black text-xs font-semibold px-2 py-0.5 rounded-full">
            NEW
          </div>
        )}

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3"
        >
          <button
            onClick={() => onTryOn?.(product)}
            className="flex items-center gap-2 bg-[#C9A84C] text-black font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-[#e0bb5a] transition-colors"
          >
            <Zap className="w-4 h-4" />
            Try On
          </button>
          <button
            onClick={() => onFindSimilar?.(product)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-sm px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
          >
            <Search className="w-4 h-4" />
            Find Similar
          </button>
        </motion.div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            saved
              ? 'bg-red-500 text-white'
              : 'bg-black/30 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/50'
          }`}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Brand */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-[#C9A84C] uppercase tracking-wider">{product.brand}</span>
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#C9A84C] text-[#C9A84C]" />
              <span className="text-xs text-white/60">{product.rating}</span>
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-sm font-medium text-[#F5F0E8] leading-snug mb-2 line-clamp-2">{product.name}</h3>

        {/* Fit badge */}
        <div className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border mb-3 ${fit.color}`}>
          {fit.label}
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[#F5F0E8]">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-white/40 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={() => onTryOn?.(product)}
            className="text-xs bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/30 px-3 py-1.5 rounded-full hover:bg-[#C9A84C]/30 transition-colors font-medium"
          >
            Try On
          </button>
        </div>
      </div>
    </motion.div>
  )
}
