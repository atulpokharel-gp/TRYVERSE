'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, Eye, EyeOff, AlertCircle, Check } from 'lucide-react'

const styleOptions = [
  'Casual', 'Formal', 'Streetwear', 'Bohemian',
  'Minimalist', 'Athleisure', 'Vintage', 'Romantic',
]

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Step 1 fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Step 2 fields
  const [gender, setGender] = useState('')
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [budget, setBudget] = useState(200)

  function handleStep1(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setStep(2)
  }

  function toggleStyle(style: string) {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          gender,
          stylePreferences: selectedStyles,
          budgetMax: budget,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.')
        setLoading(false)
        return
      }

      router.push('/auth/login?registered=true')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-[#0f0f0f] via-[#1a1040] to-[#0f0f0f] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(201,168,76,0.15),transparent_60%)]" />
        <Link href="/" className="relative flex items-center gap-2 text-[#F5F0E8]">
          <Sparkles className="w-5 h-5 text-[#C9A84C]" />
          <span className="font-serif text-2xl">TryVerse</span>
        </Link>
        <div className="relative">
          <h2 className="font-serif text-4xl text-[#F5F0E8] leading-snug mb-4">
            Your perfect fit,{' '}
            <span className="bg-gradient-to-r from-[#C9A84C] to-[#E2C97A] bg-clip-text text-transparent">
              every day
            </span>
          </h2>
          <p className="text-[#F5F0E8]/50 text-base leading-relaxed max-w-sm">
            Join 50,000+ people who stopped guessing their size and started dressing with confidence.
          </p>
          <div className="mt-8 space-y-3">
            {['AI-powered body measurements', 'Virtual try-on for any outfit', 'Personalised daily style picks'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-[#F5F0E8]/60">
                <Check className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-[#F5F0E8]/20 text-xs">© 2024 TryVerse</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#faf7f0]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Sparkles className="w-5 h-5 text-[#C9A84C]" />
            <span className="font-serif text-2xl text-charcoal-900">TryVerse</span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    s <= step
                      ? 'bg-[#C9A84C] text-[#0f0f0f]'
                      : 'bg-charcoal-200 text-charcoal-400'
                  }`}
                >
                  {s < step ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
                {s < 2 && (
                  <div className={`w-8 h-px ${s < step ? 'bg-[#C9A84C]' : 'bg-charcoal-200'}`} />
                )}
              </div>
            ))}
            <span className="text-xs text-charcoal-400 ml-1">Step {step} of 2</span>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {step === 1 ? (
            <>
              <h1 className="font-serif text-3xl text-charcoal-900 mb-2">Create your account</h1>
              <p className="text-charcoal-500 mb-8 text-sm">Free forever. No credit card required.</p>

              <form onSubmit={handleStep1} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1.5" htmlFor="name">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1.5" htmlFor="email">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1.5" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="input-base pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1.5" htmlFor="confirmPassword">
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className="input-base"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0f0f0f] text-[#F5F0E8] rounded-xl font-semibold hover:bg-charcoal-800 transition-colors"
                >
                  Continue
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="font-serif text-3xl text-charcoal-900 mb-2">Your style profile</h1>
              <p className="text-charcoal-500 mb-8 text-sm">Help us personalise your experience. You can change this later.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">Gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Female', 'Male', 'Non-binary'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                          gender === g
                            ? 'bg-[#0f0f0f] text-[#F5F0E8] border-[#0f0f0f]'
                            : 'border-charcoal-200 text-charcoal-700 hover:border-charcoal-400'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">Style preferences</label>
                  <div className="flex flex-wrap gap-2">
                    {styleOptions.map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => toggleStyle(style)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          selectedStyles.includes(style)
                            ? 'bg-[#C9A84C] text-[#0f0f0f] border-[#C9A84C] font-medium'
                            : 'border-charcoal-200 text-charcoal-600 hover:border-charcoal-400'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-charcoal-700">Monthly budget</label>
                    <span className="text-sm font-semibold text-[#C9A84C]">${budget}</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={2000}
                    step={50}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full accent-[#C9A84C]"
                  />
                  <div className="flex justify-between text-xs text-charcoal-400 mt-1">
                    <span>$50</span>
                    <span>$2,000+</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-charcoal-200 text-charcoal-700 rounded-xl font-semibold hover:bg-charcoal-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-[#0f0f0f] text-[#F5F0E8] rounded-xl font-semibold hover:bg-charcoal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating account…' : 'Create account'}
                  </button>
                </div>
              </form>
            </>
          )}

          <p className="text-center text-sm text-charcoal-500 mt-8">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#C9A84C] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
