'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FlipHorizontal, Zap, AlertCircle } from 'lucide-react'
import { products } from '@/data/products'
import { Product } from '@/types'

export default function TryOnPage() {
  const [userPhoto, setUserPhoto] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [mirror, setMirror] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setUserPhoto(URL.createObjectURL(file))
  }

  const categories = ['all', 'dresses', 'tops', 'jackets', 'pants']
  const filteredProducts = activeCategory === 'all'
    ? products.slice(0, 12)
    : products.filter(p => p.category === activeCategory).slice(0, 12)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#F5F0E8]">
      {/* Beta banner */}
      <div className="bg-gradient-to-r from-purple-900/60 via-[#C9A84C]/20 to-purple-900/60 border-b border-[#C9A84C]/20 py-2.5 text-center">
        <div className="flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#C9A84C]" />
          <span className="text-sm text-[#F5F0E8]/80">
            <span className="bg-[#C9A84C] text-black text-xs font-bold px-2 py-0.5 rounded-full mr-2">BETA</span>
            Full AR try-on coming soon with WebXR — currently showing style preview simulation
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase mb-2">Virtual Studio</p>
          <h1 className="font-serif text-4xl text-[#F5F0E8] mb-2">Try It On</h1>
          <p className="text-white/40 max-w-md mx-auto">Upload your photo and see how any style looks on you.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left – Upload & Preview */}
          <div className="space-y-6">
            {/* Upload area */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-[#F5F0E8] mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#C9A84C]" />
                Your Photo
              </h2>

              {!userPhoto ? (
                <label className="cursor-pointer block border-2 border-dashed border-white/20 rounded-xl aspect-[3/4] flex flex-col items-center justify-center gap-3 hover:border-[#C9A84C]/50 transition-colors bg-white/3">
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="sr-only" />
                  <Upload className="w-10 h-10 text-white/20" />
                  <div className="text-center">
                    <p className="text-sm text-white/40 font-medium">Upload your photo</p>
                    <p className="text-xs text-white/20 mt-1">Full-body photo works best</p>
                  </div>
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden aspect-[3/4]">
                  <img
                    src={userPhoto}
                    alt="Your photo"
                    className={`w-full h-full object-cover transition-transform ${mirror ? '-scale-x-100' : ''}`}
                  />
                  {/* Product overlay simulation */}
                  {selectedProduct && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1/2 h-2/3 relative opacity-70 mix-blend-multiply">
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                  {/* Overlay label */}
                  {selectedProduct && (
                    <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-xl p-3">
                      <p className="text-xs text-[#C9A84C] font-semibold">{selectedProduct.brand}</p>
                      <p className="text-sm text-[#F5F0E8] font-medium">{selectedProduct.name}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Controls */}
            {userPhoto && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <button
                  onClick={() => setMirror(prev => !prev)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all ${
                    mirror
                      ? 'bg-[#C9A84C]/20 border-[#C9A84C]/30 text-[#C9A84C]'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20'
                  }`}
                >
                  <FlipHorizontal className="w-4 h-4" />
                  Mirror Mode
                </button>
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Change Photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="sr-only" />
                </label>
                {selectedProduct && (
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white/60 hover:text-red-400 hover:border-red-400/30 transition-all"
                  >
                    Remove Item
                  </button>
                )}
              </motion.div>
            )}

            {/* Info note */}
            <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl p-4">
              <p className="text-xs text-purple-300/70 leading-relaxed">
                <span className="font-semibold">Note:</span> This is a style preview simulation. Full WebXR-powered AR try-on with precise garment fitting is coming soon.
              </p>
            </div>
          </div>

          {/* Right – Product selector */}
          <div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-[#F5F0E8] mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#C9A84C]" />
                Select a Product to Try
              </h2>

              {/* Category filters */}
              <div className="flex gap-2 flex-wrap mb-5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeCategory === cat
                        ? 'bg-[#C9A84C] text-black'
                        : 'bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>

              {/* Product grid */}
              <div className="grid grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredProducts.map(product => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`relative rounded-xl overflow-hidden aspect-[3/4] transition-all group ${
                      selectedProduct?.id === product.id
                        ? 'ring-2 ring-[#C9A84C] scale-[1.02]'
                        : 'hover:ring-1 hover:ring-white/20 hover:scale-[1.01]'
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-[10px] text-[#C9A84C] font-semibold leading-none">{product.brand}</p>
                      <p className="text-[10px] text-white/80 leading-snug mt-0.5 line-clamp-1">{product.name}</p>
                    </div>
                    {selectedProduct?.id === product.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#C9A84C] rounded-full flex items-center justify-center">
                        <span className="text-black text-[10px] font-bold">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
