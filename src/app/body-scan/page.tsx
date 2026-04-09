'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Ruler, CheckCircle, ArrowRight } from 'lucide-react'

type Mode = 'choose' | 'upload' | 'measurements' | 'result'
type BodyShape = 'hourglass' | 'pear' | 'apple' | 'rectangle' | 'inverted-triangle'

const bodyShapeInfo: Record<BodyShape, { desc: string; tips: string[]; emoji: string }> = {
  hourglass: {
    emoji: '⌛',
    desc: 'Balanced bust and hips with a defined waist. The most balanced of all body shapes.',
    tips: ['Wrap dresses accentuate your waist', 'Bodycon styles show off your curves', 'High-waist anything works great', 'V-necks and scoop necks complement you'],
  },
  pear: {
    emoji: '🍐',
    desc: 'Hips wider than bust. Your curves are your signature — show them off!',
    tips: ['A-line skirts balance proportions beautifully', 'Statement tops draw attention upward', 'Palazzo pants flow over hips gracefully', 'Dark bottoms + bright tops = magic'],
  },
  apple: {
    emoji: '🍎',
    desc: 'Fuller midsection with slim legs. Your legs are your best asset!',
    tips: ['Empire waist dresses elongate your silhouette', 'V-necks and open necklines look great', 'Flowy tunics over leggings are effortless', 'Show off those legs with mini skirts'],
  },
  rectangle: {
    emoji: '▭',
    desc: 'Similar bust, waist, and hip measurements. A versatile canvas for fashion!',
    tips: ['Create curves with peplum tops', 'Belted jackets define your waist', 'Ruffles and texture add dimension', 'Crop tops + high-waist bottoms work wonderfully'],
  },
  'inverted-triangle': {
    emoji: '▽',
    desc: 'Broader shoulders than hips. You have the runway model proportions!',
    tips: ['Wide-leg pants balance broader shoulders', 'A-line and flared skirts add volume below', 'Avoid heavy shoulder details', 'V-necks and deep necklines slim the upper body'],
  },
}

const sizeMap = (chest: number, waist: number, hips: number) => {
  const avg = (chest + waist + hips) / 3
  if (avg < 80) return 'XS'
  if (avg < 88) return 'S'
  if (avg < 96) return 'M'
  if (avg < 104) return 'L'
  if (avg < 112) return 'XL'
  return 'XXL'
}

const calculateBodyShape = (chest: number, waist: number, hips: number, shoulders: number): BodyShape => {
  const waistRatio = waist / hips
  const hipBustDiff = hips - chest
  const shoulderHipDiff = shoulders - hips
  if (waistRatio < 0.75 && Math.abs(chest - hips) < 5) return 'hourglass'
  if (hipBustDiff > 5 && waistRatio < 0.8) return 'pear'
  if (shoulderHipDiff > 5) return 'inverted-triangle'
  if (waistRatio > 0.85 && chest > hips) return 'apple'
  return 'rectangle'
}

const BodySilhouette = ({ shape }: { shape: BodyShape }) => (
  <svg viewBox="0 0 120 280" className="w-32 h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="60" cy="28" r="18" fill="#C9A84C" opacity="0.7" />
    {/* Neck */}
    <rect x="54" y="44" width="12" height="14" rx="4" fill="#C9A84C" opacity="0.6" />
    {/* Body - shape dependent */}
    {shape === 'hourglass' && (
      <path d="M30 58 Q60 62 90 58 L95 110 Q60 98 25 110 Z" fill="#C9A84C" opacity="0.5" />
    )}
    {shape === 'pear' && (
      <path d="M35 58 Q60 62 85 58 L98 115 Q60 100 22 115 Z" fill="#C9A84C" opacity="0.5" />
    )}
    {shape === 'apple' && (
      <path d="M30 58 Q60 62 90 58 L92 110 Q60 118 28 110 Z" fill="#C9A84C" opacity="0.5" />
    )}
    {shape === 'rectangle' && (
      <path d="M30 58 Q60 62 90 58 L90 110 Q60 108 30 110 Z" fill="#C9A84C" opacity="0.5" />
    )}
    {shape === 'inverted-triangle' && (
      <path d="M22 58 Q60 62 98 58 L88 110 Q60 100 32 110 Z" fill="#C9A84C" opacity="0.5" />
    )}
    {/* Legs */}
    <rect x="36" y="108" width="20" height="90" rx="8" fill="#C9A84C" opacity="0.4" />
    <rect x="64" y="108" width="20" height="90" rx="8" fill="#C9A84C" opacity="0.4" />
    {/* Arms */}
    <rect x="14" y="60" width="14" height="70" rx="6" fill="#C9A84C" opacity="0.35" />
    <rect x="92" y="60" width="14" height="70" rx="6" fill="#C9A84C" opacity="0.35" />
  </svg>
)

export default function BodyScanPage() {
  const [mode, setMode] = useState<Mode>('choose')
  const [frontPhoto, setFrontPhoto] = useState<string | null>(null)
  const [sidePhoto, setSidePhoto] = useState<string | null>(null)
  const [measurements, setMeasurements] = useState({ height: '', weight: '', chest: '', waist: '', hips: '', shoulders: '' })
  const [result, setResult] = useState<{ shape: BodyShape; size: string } | null>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'side') => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    if (type === 'front') setFrontPhoto(url)
    else setSidePhoto(url)
  }

  const analyzePhotos = () => {
    // Simulate body shape analysis from photos
    const shapes: BodyShape[] = ['hourglass', 'pear', 'apple', 'rectangle', 'inverted-triangle']
    const shape = shapes[Math.floor(Math.random() * shapes.length)]
    setResult({ shape, size: 'M' })
    setMode('result')
  }

  const analyzeMeasurements = () => {
    const c = parseFloat(measurements.chest)
    const w = parseFloat(measurements.waist)
    const h = parseFloat(measurements.hips)
    const s = parseFloat(measurements.shoulders)
    if (!c || !w || !h || !s) return
    const shape = calculateBodyShape(c, w, h, s)
    const size = sizeMap(c, w, h)
    setResult({ shape, size })
    setMode('result')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#F5F0E8]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <p className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase mb-2">Body Intelligence</p>
          <h1 className="font-serif text-4xl text-[#F5F0E8] mb-3">Body Scan</h1>
          <p className="text-white/40 max-w-md mx-auto">
            Discover your body shape and get perfectly tailored size recommendations.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Mode selection */}
          {mode === 'choose' && (
            <motion.div
              key="choose"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              <button
                onClick={() => setMode('upload')}
                className="group bg-white/5 border border-white/10 rounded-2xl p-8 text-left hover:border-[#C9A84C]/40 hover:bg-white/8 transition-all"
              >
                <Upload className="w-8 h-8 text-[#C9A84C] mb-4" />
                <h3 className="text-lg font-semibold text-[#F5F0E8] mb-2">Upload Photos</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  Upload front and side photos for an AI-powered body shape analysis.
                </p>
                <div className="flex items-center gap-2 mt-4 text-[#C9A84C] text-sm">
                  <span>Get started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => setMode('measurements')}
                className="group bg-white/5 border border-white/10 rounded-2xl p-8 text-left hover:border-[#C9A84C]/40 hover:bg-white/8 transition-all"
              >
                <Ruler className="w-8 h-8 text-[#C9A84C] mb-4" />
                <h3 className="text-lg font-semibold text-[#F5F0E8] mb-2">Enter Measurements</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  Manually enter your measurements for precise size and shape calculation.
                </p>
                <div className="flex items-center gap-2 mt-4 text-[#C9A84C] text-sm">
                  <span>Enter data</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </motion.div>
          )}

          {/* Upload mode */}
          {mode === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {(['front', 'side'] as const).map(type => (
                  <label
                    key={type}
                    className="relative cursor-pointer block border-2 border-dashed border-white/20 rounded-2xl aspect-[3/4] overflow-hidden hover:border-[#C9A84C]/50 transition-colors bg-white/5"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handlePhotoUpload(e, type)}
                      className="sr-only"
                    />
                    {(type === 'front' ? frontPhoto : sidePhoto) ? (
                      <img
                        src={type === 'front' ? frontPhoto! : sidePhoto!}
                        alt={`${type} photo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/30">
                        <Upload className="w-8 h-8" />
                        <p className="text-sm font-medium capitalize">{type} Photo</p>
                        <p className="text-xs text-center px-4">Drag & drop or click to upload</p>
                      </div>
                    )}
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setMode('choose')} className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 text-sm hover:border-white/20 hover:text-white transition-colors">
                  Back
                </button>
                <button
                  onClick={analyzePhotos}
                  disabled={!frontPhoto && !sidePhoto}
                  className="flex-1 py-3 rounded-xl bg-[#C9A84C] text-black font-semibold text-sm hover:bg-[#e0bb5a] transition-colors disabled:opacity-40"
                >
                  Analyse Photos
                </button>
              </div>
            </motion.div>
          )}

          {/* Measurements mode */}
          {mode === 'measurements' && (
            <motion.div
              key="measurements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'height', label: 'Height', unit: 'cm', placeholder: 'e.g. 168' },
                  { key: 'weight', label: 'Weight', unit: 'kg', placeholder: 'e.g. 62' },
                  { key: 'chest', label: 'Chest / Bust', unit: 'cm', placeholder: 'e.g. 90' },
                  { key: 'waist', label: 'Waist', unit: 'cm', placeholder: 'e.g. 70' },
                  { key: 'hips', label: 'Hips', unit: 'cm', placeholder: 'e.g. 95' },
                  { key: 'shoulders', label: 'Shoulders', unit: 'cm', placeholder: 'e.g. 40' },
                ].map(({ key, label, unit, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs text-white/50 mb-1.5 font-medium">{label} ({unit})</label>
                    <input
                      type="number"
                      placeholder={placeholder}
                      value={measurements[key as keyof typeof measurements]}
                      onChange={e => setMeasurements(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F5F0E8] placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setMode('choose')} className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 text-sm hover:border-white/20 hover:text-white transition-colors">
                  Back
                </button>
                <button
                  onClick={analyzeMeasurements}
                  disabled={!measurements.chest || !measurements.waist || !measurements.hips || !measurements.shoulders}
                  className="flex-1 py-3 rounded-xl bg-[#C9A84C] text-black font-semibold text-sm hover:bg-[#e0bb5a] transition-colors disabled:opacity-40"
                >
                  Calculate Shape
                </button>
              </div>
            </motion.div>
          )}

          {/* Result */}
          {mode === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <BodySilhouette shape={result.shape} />
                </div>
                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Analysis Complete</span>
                  </div>
                  <h2 className="font-serif text-3xl text-[#F5F0E8] mb-1 capitalize">
                    {bodyShapeInfo[result.shape].emoji} {result.shape.replace('-', ' ')}
                  </h2>
                  <p className="text-white/50 text-sm mb-4 leading-relaxed">{bodyShapeInfo[result.shape].desc}</p>
                  <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 border border-[#C9A84C]/20 px-4 py-2 rounded-xl">
                    <span className="text-xs text-white/50">Recommended Size</span>
                    <span className="text-lg font-bold text-[#C9A84C]">{result.size}</span>
                  </div>
                </div>
              </div>

              {/* Style tips */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-[#F5F0E8] mb-4">Style Tips for Your Shape</h3>
                <ul className="space-y-2">
                  {bodyShapeInfo[result.shape].tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/60">
                      <span className="text-[#C9A84C] mt-0.5">✦</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setMode('choose'); setFrontPhoto(null); setSidePhoto(null); setMeasurements({ height: '', weight: '', chest: '', waist: '', hips: '', shoulders: '' }) }}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 text-sm hover:border-white/20 hover:text-white transition-colors"
                >
                  Scan Again
                </button>
                <a href="/shop" className="flex-1 py-3 rounded-xl bg-[#C9A84C] text-black font-semibold text-sm text-center hover:bg-[#e0bb5a] transition-colors">
                  Shop Your Shape
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
