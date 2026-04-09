'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { User, Camera, Ruler, Heart, DollarSign, Save, ChevronRight, Sparkles } from 'lucide-react'

const styleOptions = ['casual', 'formal', 'streetwear', 'bohemian', 'minimalist', 'athleisure']
const brandOptions = ['Zara', 'H&M', 'ASOS', 'Nike', 'Adidas', 'COS', 'Massimo Dutti', 'Free People', "Levi's", 'AllSaints', 'Urban Outfitters', 'Mango']

export default function ProfilePage() {
  const { data: session } = useSession()

  const [form, setForm] = useState({
    name: session?.user?.name ?? '',
    email: session?.user?.email ?? '',
    gender: '',
    stylePreference: '',
    favoriteBrands: [] as string[],
    budgetMin: 30,
    budgetMax: 300,
  })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleBrandToggle = (brand: string) => {
    setForm((prev) => ({
      ...prev,
      favoriteBrands: prev.favoriteBrands.includes(brand)
        ? prev.favoriteBrands.filter((b) => b !== brand)
        : [...prev.favoriteBrands, brand],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#F5F0E8]">
      {/* Header */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2 text-[#C9A84C]">
          <Sparkles className="w-5 h-5" />
          <span className="font-serif text-lg">TryVerse</span>
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-white/60 text-sm">Profile</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-serif mb-1">Your Profile</h1>
          <p className="text-[#F5F0E8]/50 text-sm">Manage your personal details and style preferences.</p>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C9A84C]/60 to-purple-700/60 flex items-center justify-center text-3xl font-serif">
              {form.name ? form.name[0].toUpperCase() : <User className="w-10 h-10" />}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center text-black hover:bg-[#E2C97A] transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-lg">{form.name || 'Your Name'}</p>
            <p className="text-[#F5F0E8]/50 text-sm">{form.email || 'your@email.com'}</p>
          </div>
        </div>

        {/* Basic Info */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User className="w-5 h-5 text-[#C9A84C]" /> Basic Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#F5F0E8]/50 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-xs text-[#F5F0E8]/50 uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-xs text-[#F5F0E8]/50 uppercase tracking-wider mb-1.5">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
              >
                <option value="">Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </section>

        {/* Style Preferences */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C9A84C]" /> Style Preferences
          </h2>
          <div className="flex flex-wrap gap-3">
            {styleOptions.map((style) => (
              <button
                key={style}
                onClick={() => setForm({ ...form, stylePreference: style })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  form.stylePreference === style
                    ? 'bg-[#C9A84C] text-black border-[#C9A84C]'
                    : 'bg-white/5 border-white/10 hover:border-[#C9A84C]/40'
                }`}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* Body Profile Card */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Ruler className="w-5 h-5 text-[#C9A84C]" /> Body Profile
            </h2>
            <Link
              href="/body-scan"
              className="text-sm text-[#C9A84C] flex items-center gap-1 hover:text-[#E2C97A] transition-colors"
            >
              Update scan <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-sm text-[#F5F0E8]/50 mt-2 mb-4">
            Your AI-generated body measurements power accurate virtual try-ons.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Height', value: '165 cm' },
              { label: 'Chest', value: '88 cm' },
              { label: 'Waist', value: '68 cm' },
              { label: 'Hips', value: '92 cm' },
              { label: 'Body Shape', value: 'Hourglass' },
              { label: 'Size', value: 'S / EU 36' },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xs text-[#F5F0E8]/40 mb-1">{item.label}</p>
                <p className="text-sm font-medium text-[#C9A84C]">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Favourite Brands */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#C9A84C]" /> Favourite Brands
          </h2>
          <div className="flex flex-wrap gap-2">
            {brandOptions.map((brand) => (
              <button
                key={brand}
                onClick={() => handleBrandToggle(brand)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  form.favoriteBrands.includes(brand)
                    ? 'bg-[#C9A84C]/20 border-[#C9A84C]/50 text-[#C9A84C]'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </section>

        {/* Budget Range */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#C9A84C]" /> Budget Range
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-[#F5F0E8]/60">
              <span>Min: £{form.budgetMin}</span>
              <span>Max: £{form.budgetMax}</span>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-[#F5F0E8]/40">Minimum budget per item</label>
              <input
                type="range"
                min={0}
                max={500}
                step={10}
                value={form.budgetMin}
                onChange={(e) => setForm({ ...form, budgetMin: Number(e.target.value) })}
                className="w-full accent-[#C9A84C]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-[#F5F0E8]/40">Maximum budget per item</label>
              <input
                type="range"
                min={0}
                max={1000}
                step={10}
                value={form.budgetMax}
                onChange={(e) => setForm({ ...form, budgetMax: Number(e.target.value) })}
                className="w-full accent-[#C9A84C]"
              />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#C9A84C] text-black font-semibold px-8 py-3 rounded-full hover:bg-[#E2C97A] transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
