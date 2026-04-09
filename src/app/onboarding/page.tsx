'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ChevronRight, ChevronLeft, X } from 'lucide-react'

const TOTAL_STEPS = 5

const styleTypes = ['casual', 'formal', 'streetwear', 'bohemian', 'minimalist']
const ageRanges = ['16–24', '25–34', '35–44', '45–54', '55+']
const brands = [
  'Zara', 'H&M', 'ASOS', 'Nike', 'Adidas', 'COS',
  'Massimo Dutti', 'Free People', "Levi's", 'AllSaints',
  'Urban Outfitters', 'Mango', 'Uniqlo', 'Topshop',
  'Reformation', 'Sezane',
]

interface OnboardingState {
  gender: string
  ageRange: string
  styleType: string
  height: string
  weight: string
  chest: string
  waist: string
  hips: string
  favoriteBrands: string[]
  budgetMin: number
  budgetMax: number
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingState>({
    gender: '',
    ageRange: '',
    styleType: '',
    height: '',
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    favoriteBrands: [],
    budgetMin: 30,
    budgetMax: 300,
  })

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100

  const toggleBrand = (brand: string) => {
    setData((prev) => ({
      ...prev,
      favoriteBrands: prev.favoriteBrands.includes(brand)
        ? prev.favoriteBrands.filter((b) => b !== brand)
        : [...prev.favoriteBrands, brand],
    }))
  }

  const handleFinish = () => {
    router.push('/dashboard')
  }

  const handleSkip = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#F5F0E8] flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-[#C9A84C] to-[#E2C97A] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 text-[#C9A84C]">
          <Sparkles className="w-5 h-5" />
          <span className="font-serif text-lg">TryVerse</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#F5F0E8]/40">Step {step} of {TOTAL_STEPS}</span>
          <button onClick={handleSkip} className="text-[#F5F0E8]/40 hover:text-[#F5F0E8] transition-colors" aria-label="Skip onboarding">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mx-auto">
                <Sparkles className="w-10 h-10 text-[#C9A84C]" />
              </div>
              <div>
                <h1 className="text-4xl font-serif mb-3">Welcome to TryVerse</h1>
                <p className="text-[#F5F0E8]/60 leading-relaxed">
                  Your AI fashion universe. We'll personalise everything to your unique body,
                  style, and budget. It only takes 2 minutes.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 py-4">
                {['AI Body Scan', 'Virtual Try-On', 'Smart Stylist'].map((f) => (
                  <div key={f} className="bg-white/5 rounded-xl p-3 text-center">
                    <p className="text-xs text-[#F5F0E8]/60">{f}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#F5F0E8]/30">
                You can skip any step and update your profile later.
              </p>
            </div>
          )}

          {/* Step 2: Style Quiz */}
          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-serif mb-2">Your Style DNA</h2>
                <p className="text-[#F5F0E8]/50 text-sm">Help us understand who you are.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-3">Gender</label>
                  <div className="flex flex-wrap gap-2">
                    {['Female', 'Male', 'Non-binary', 'Prefer not to say'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setData({ ...data, gender: g })}
                        className={`px-4 py-2 rounded-full text-sm border transition-all ${
                          data.gender === g
                            ? 'bg-[#C9A84C] text-black border-[#C9A84C]'
                            : 'bg-white/5 border-white/10 hover:border-white/30'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Age Range</label>
                  <div className="flex flex-wrap gap-2">
                    {ageRanges.map((age) => (
                      <button
                        key={age}
                        onClick={() => setData({ ...data, ageRange: age })}
                        className={`px-4 py-2 rounded-full text-sm border transition-all ${
                          data.ageRange === age
                            ? 'bg-[#C9A84C] text-black border-[#C9A84C]'
                            : 'bg-white/5 border-white/10 hover:border-white/30'
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Style Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {styleTypes.map((style) => (
                      <button
                        key={style}
                        onClick={() => setData({ ...data, styleType: style })}
                        className={`py-3 rounded-xl text-sm font-medium border transition-all capitalize ${
                          data.styleType === style
                            ? 'bg-[#C9A84C]/20 border-[#C9A84C]/50 text-[#C9A84C]'
                            : 'bg-white/5 border-white/10 hover:border-white/30'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Body Measurements */}
          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-serif mb-2">Body Measurements</h2>
                <p className="text-[#F5F0E8]/50 text-sm">Enter your measurements for perfect fit predictions.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'height', label: 'Height (cm)', placeholder: 'e.g. 165' },
                  { key: 'weight', label: 'Weight (kg)', placeholder: 'e.g. 60' },
                  { key: 'chest', label: 'Chest (cm)', placeholder: 'e.g. 88' },
                  { key: 'waist', label: 'Waist (cm)', placeholder: 'e.g. 68' },
                  { key: 'hips', label: 'Hips (cm)', placeholder: 'e.g. 92' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs text-[#F5F0E8]/50 uppercase tracking-wider mb-1.5">{label}</label>
                    <input
                      type="number"
                      value={data[key as keyof OnboardingState] as string}
                      onChange={(e) => setData({ ...data, [key]: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>

              <p className="text-xs text-[#F5F0E8]/30">
                Or use our AI Body Scan after setup to auto-detect measurements from a photo.
              </p>
            </div>
          )}

          {/* Step 4: Favourite Brands */}
          {step === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-serif mb-2">Favourite Brands</h2>
                <p className="text-[#F5F0E8]/50 text-sm">Select brands you love. We'll prioritise them in recommendations.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className={`py-3 px-2 rounded-xl text-sm text-center border transition-all ${
                      data.favoriteBrands.includes(brand)
                        ? 'bg-[#C9A84C]/20 border-[#C9A84C]/50 text-[#C9A84C]'
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>

              {data.favoriteBrands.length > 0 && (
                <p className="text-xs text-[#C9A84C]">{data.favoriteBrands.length} brands selected</p>
              )}
            </div>
          )}

          {/* Step 5: Budget */}
          {step === 5 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-serif mb-2">Budget Range</h2>
                <p className="text-[#F5F0E8]/50 text-sm">Set your typical spend per clothing item.</p>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-2xl p-6 text-center">
                  <p className="text-4xl font-serif text-[#C9A84C] mb-1">
                    £{data.budgetMin} – £{data.budgetMax}
                  </p>
                  <p className="text-xs text-[#F5F0E8]/40">per item</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-[#F5F0E8]/40 mb-2">
                      <span>Minimum: £{data.budgetMin}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={500}
                      step={10}
                      value={data.budgetMin}
                      onChange={(e) => setData({ ...data, budgetMin: Number(e.target.value) })}
                      className="w-full accent-[#C9A84C]"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-[#F5F0E8]/40 mb-2">
                      <span>Maximum: £{data.budgetMax}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={2000}
                      step={25}
                      value={data.budgetMax}
                      onChange={(e) => setData({ ...data, budgetMax: Number(e.target.value) })}
                      className="w-full accent-[#C9A84C]"
                    />
                  </div>
                </div>

                <div className="flex justify-between gap-3">
                  {[
                    { label: 'Budget', range: '£0–£80' },
                    { label: 'Mid-range', range: '£80–£300' },
                    { label: 'Premium', range: '£300+' },
                  ].map((tier) => (
                    <button
                      key={tier.label}
                      onClick={() => {
                        if (tier.label === 'Budget') setData({ ...data, budgetMin: 0, budgetMax: 80 })
                        if (tier.label === 'Mid-range') setData({ ...data, budgetMin: 80, budgetMax: 300 })
                        if (tier.label === 'Premium') setData({ ...data, budgetMin: 300, budgetMax: 2000 })
                      }}
                      className="flex-1 py-2 rounded-xl text-xs border border-white/10 bg-white/5 hover:border-[#C9A84C]/40 transition-all"
                    >
                      <div className="font-medium">{tier.label}</div>
                      <div className="text-[#F5F0E8]/40">{tier.range}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8 flex items-center justify-between max-w-lg mx-auto w-full">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="flex items-center gap-2 text-sm text-[#F5F0E8]/50 hover:text-[#F5F0E8] transition-colors disabled:opacity-0"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <button
          onClick={handleSkip}
          className="text-xs text-[#F5F0E8]/30 hover:text-[#F5F0E8]/60 transition-colors"
        >
          Skip for now
        </button>

        {step < TOTAL_STEPS ? (
          <button
            onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}
            className="flex items-center gap-2 bg-[#C9A84C] text-black text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#E2C97A] transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="flex items-center gap-2 bg-[#C9A84C] text-black text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#E2C97A] transition-colors"
          >
            Get Started <Sparkles className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
