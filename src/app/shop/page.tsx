'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import { products, categories } from '@/data/products'
import ProductCard from '@/components/ProductCard'

const occasions = ['All', 'Casual', 'Work', 'Party', 'Date', 'Beach', 'Formal']
const bodyShapes = ['All', 'Hourglass', 'Pear', 'Apple', 'Rectangle', 'Inverted Triangle']
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function ShopPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 4000])
  const [selectedOccasion, setSelectedOccasion] = useState('All')
  const [selectedBodyShape, setSelectedBodyShape] = useState('All')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.brand.toLowerCase().includes(query.toLowerCase())) return false
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false
      if (selectedOccasion !== 'All' && !p.occasions?.includes(selectedOccasion.toLowerCase())) return false
      if (selectedBodyShape !== 'All') {
        const shape = selectedBodyShape.toLowerCase().replace(' ', '-')
        if (!p.bodyShapeCompatibility?.includes(shape)) return false
      }
      if (selectedSizes.length > 0 && !p.sizes?.some(s => selectedSizes.includes(s))) return false
      return true
    })
  }, [query, activeCategory, priceRange, selectedOccasion, selectedBodyShape, selectedSizes])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#F5F0E8]">
      {/* Header */}
      <div className="border-b border-white/10 sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative max-w-md">
              <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search styles, brands..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F5F0E8] placeholder-white/30 focus:outline-none focus:border-[#C9A84C]/50"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-white/40" />
                </button>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm hover:border-white/20 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <div className="flex items-center gap-2 bg-[#C9A84C]/10 border border-[#C9A84C]/20 px-3 py-2.5 rounded-xl">
              <Sparkles className="w-4 h-4 text-[#C9A84C]" />
              <span className="text-xs text-[#C9A84C] font-medium">Personalized for your body type</span>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-[#C9A84C] text-black'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filter sidebar */}
          {sidebarOpen && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-64 flex-shrink-0 space-y-6"
            >
              {/* Price range */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-[#F5F0E8] mb-4">Price Range</h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min={0}
                    max={4000}
                    step={10}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-[#C9A84C]"
                  />
                  <div className="flex justify-between text-xs text-white/40">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Occasion */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-[#F5F0E8] mb-3">Occasion</h3>
                <div className="space-y-2">
                  {occasions.map(occ => (
                    <button
                      key={occ}
                      onClick={() => setSelectedOccasion(occ)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                        selectedOccasion === occ
                          ? 'bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/30'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              {/* Body shape */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-[#F5F0E8] mb-3">Body Shape</h3>
                <div className="space-y-2">
                  {bodyShapes.map(shape => (
                    <button
                      key={shape}
                      onClick={() => setSelectedBodyShape(shape)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                        selectedBodyShape === shape
                          ? 'bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/30'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-[#F5F0E8] mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        selectedSizes.includes(size)
                          ? 'bg-[#C9A84C] text-black border-[#C9A84C] font-semibold'
                          : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}

          {/* Product grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-white/40">
                <span className="text-[#F5F0E8] font-semibold">{filtered.length}</span> items found
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-white/40">No products match your filters.</p>
                <button
                  onClick={() => {
                    setQuery('')
                    setActiveCategory('all')
                    setSelectedOccasion('All')
                    setSelectedBodyShape('All')
                    setSelectedSizes([])
                    setPriceRange([0, 4000])
                  }}
                  className="mt-4 text-[#C9A84C] text-sm hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <ProductCard
                      product={product}
                      onTryOn={() => router.push('/try-on')}
                      onFindSimilar={() => router.push('/search')}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
