'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Search, Upload, Link as LinkIcon, Loader2, SlidersHorizontal } from 'lucide-react'
import { products } from '@/data/products'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'

type FilterType = 'all' | 'cheapest' | 'closest' | 'premium' | 'budget'

const filterLabels: Record<FilterType, string> = {
  all: 'All Results',
  cheapest: 'Cheapest',
  closest: 'Closest Match',
  premium: 'Premium Version',
  budget: 'Same Style Under Budget',
}

const sourceBadgeColors: Record<string, string> = {
  Zara: 'bg-black text-white',
  'H&M': 'bg-red-600 text-white',
  Amazon: 'bg-orange-500 text-white',
  Temu: 'bg-orange-400 text-black',
  Gucci: 'bg-[#8B5E3C] text-white',
  Nike: 'bg-black text-white',
  ASOS: 'bg-[#1a1a1a] text-white',
  Mango: 'bg-amber-700 text-white',
  Levi: 'bg-blue-800 text-white',
  Chanel: 'bg-black text-white',
}

const getSourceBadge = (source?: string | null) => {
  if (!source) return 'bg-white/10 text-white/60'
  const key = Object.keys(sourceBadgeColors).find(k => source.includes(k))
  return key ? sourceBadgeColors[key] : 'bg-white/10 text-white/60'
}

const applyFilter = (prods: Product[], filter: FilterType): Product[] => {
  const sorted = [...prods]
  if (filter === 'cheapest') return sorted.sort((a, b) => a.price - b.price)
  if (filter === 'premium') return sorted.sort((a, b) => b.price - a.price)
  if (filter === 'budget') return sorted.filter(p => p.price < 100).sort((a, b) => a.price - b.price)
  if (filter === 'closest') return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
  return sorted
}

export default function SearchPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'upload' | 'url'>('upload')
  const [imageUrl, setImageUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<Product[] | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      runAnalysis()
    }
  }

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) return
    setPreviewUrl(imageUrl)
    runAnalysis()
  }

  const runAnalysis = async () => {
    setAnalyzing(true)
    setResults(null)
    await new Promise(res => setTimeout(res, 2500))
    // Return shuffled mock results
    const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, 8)
    setResults(shuffled)
    setAnalyzing(false)
  }

  const displayResults = results ? applyFilter(results, filter) : null

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#F5F0E8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase mb-2">Visual Search</p>
          <h1 className="font-serif text-4xl text-[#F5F0E8] mb-2">Find Any Style</h1>
          <p className="text-white/40 max-w-md mx-auto">
            Upload an image or paste a URL — our AI will find similar products across all marketplaces.
          </p>
        </motion.div>

        {/* Search panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 max-w-2xl mx-auto"
        >
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[{ id: 'upload' as const, label: 'Upload Image', icon: Upload }, { id: 'url' as const, label: 'Paste URL', icon: LinkIcon }].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  tab === id ? 'bg-[#C9A84C] text-black' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {tab === 'upload' ? (
            <div>
              {!previewUrl ? (
                <label className="cursor-pointer block border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-[#C9A84C]/50 transition-colors">
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="sr-only" />
                  <Upload className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-sm text-white/40 font-medium">Drag & drop or click to upload</p>
                  <p className="text-xs text-white/20 mt-1">JPG, PNG, WEBP up to 10MB</p>
                </label>
              ) : (
                <div className="flex items-center gap-4">
                  <img src={previewUrl} alt="Uploaded" className="w-20 h-20 object-cover rounded-xl" />
                  <div>
                    <p className="text-sm text-[#F5F0E8] font-medium">Image ready</p>
                    <button onClick={() => { setPreviewUrl(null); setResults(null) }} className="text-xs text-white/30 hover:text-white mt-1">Remove</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
                  placeholder="Paste image URL..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-[#F5F0E8] placeholder-white/30 focus:outline-none focus:border-[#C9A84C]/50"
                />
              </div>
              <button
                onClick={handleUrlSubmit}
                disabled={!imageUrl.trim()}
                className="px-5 py-3 bg-[#C9A84C] text-black font-semibold text-sm rounded-xl hover:bg-[#e0bb5a] transition-colors disabled:opacity-40"
              >
                Search
              </button>
            </div>
          )}
        </motion.div>

        {/* Analysing state */}
        <AnimatePresence>
          {analyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-8 py-5">
                <Loader2 className="w-5 h-5 text-[#C9A84C] animate-spin" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#F5F0E8]">Analysing image...</p>
                  <p className="text-xs text-white/40">Searching across Zara, ASOS, Gucci, Nike & more</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {displayResults && !analyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Filter bar */}
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <div className="flex items-center gap-2 text-white/30">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="text-sm">Filter:</span>
                </div>
                {(Object.keys(filterLabels) as FilterType[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      filter === f
                        ? 'bg-[#C9A84C] text-black'
                        : 'bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {filterLabels[f]}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-[#F5F0E8]">
                  {displayResults.length} Similar Products Found
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {displayResults.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative"
                  >
                    {/* Source badge */}
                    {product.source && (
                      <div className={`absolute top-3 left-3 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full ${getSourceBadge(product.source)}`}>
                        {product.source}
                      </div>
                    )}
                    <ProductCard
                      product={product}
                      onTryOn={() => router.push('/try-on')}
                      onFindSimilar={() => {}}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!analyzing && !results && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-white/30 text-sm">Upload an image or paste a URL to discover similar styles</p>
          </div>
        )}
      </div>
    </div>
  )
}
