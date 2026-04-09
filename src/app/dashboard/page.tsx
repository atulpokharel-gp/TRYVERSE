'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Scan, Upload, Wand2, Shirt, Cloud, Sparkles, Bell, ArrowRight, TrendingUp } from 'lucide-react'
import { getTrendingProducts } from '@/data/products'
import ProductCard from '@/components/ProductCard'

const quickActions = [
  { href: '/body-scan', label: 'Scan Body', icon: Scan, desc: 'Get your body profile', color: 'from-purple-500/20 to-purple-700/10' },
  { href: '/try-on', label: 'Upload Outfit', icon: Upload, desc: 'Try clothes virtually', color: 'from-[#C9A84C]/20 to-[#C9A84C]/5' },
  { href: '/stylist', label: 'Ask Stylist', icon: Wand2, desc: 'AI style advice', color: 'from-emerald-500/20 to-emerald-700/10' },
  { href: '/wardrobe', label: 'View Wardrobe', icon: Shirt, desc: 'Your saved items', color: 'from-sky-500/20 to-sky-700/10' },
]

const weatherOutfits = [
  { name: 'Linen Slip Dress + Sandals', tags: ['Breezy', 'Casual'] },
  { name: 'Crop Top + Palazzo Pants', tags: ['Trendy', 'Comfortable'] },
  { name: 'Oversized Tee + White Shorts', tags: ['Minimal', 'Cool'] },
]

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return null

  const firstName = session.user?.name?.split(' ')[0] ?? 'Darling'
  const trending = getTrendingProducts().slice(0, 4)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Feed refresh banner */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center gap-3 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-2xl px-5 py-3"
        >
          <Bell className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
          <span className="text-sm text-[#F5F0E8]/80">
            <span className="text-[#C9A84C] font-semibold">Your Feed was refreshed overnight</span>
            {' '}— 47 new items personalized for you.
          </span>
        </motion.div>

        {/* Greeting */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.05 }} className="mb-10">
          <p className="text-[#C9A84C] text-sm font-medium tracking-widest uppercase mb-1">Welcome back</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#F5F0E8]">
            Hello, {firstName} ✨
          </h1>
          <p className="mt-2 text-white/40 text-base">Your personal style universe is ready.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Quick actions */}
            <motion.section {...fadeUp} transition={{ delay: 0.1, duration: 0.4 }}>
              <h2 className="text-lg font-semibold text-[#F5F0E8] mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map(({ href, label, icon: Icon, desc, color }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`group relative rounded-2xl bg-gradient-to-br ${color} border border-white/10 p-5 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]`}
                  >
                    <Icon className="w-6 h-6 text-[#C9A84C] mb-3" />
                    <p className="font-semibold text-[#F5F0E8] text-sm">{label}</p>
                    <p className="text-white/40 text-xs mt-0.5">{desc}</p>
                    <ArrowRight className="w-3.5 h-3.5 text-white/30 absolute top-5 right-5 group-hover:text-[#C9A84C] transition-colors" />
                  </Link>
                ))}
              </div>
            </motion.section>

            {/* Trending */}
            <motion.section {...fadeUp} transition={{ delay: 0.15, duration: 0.4 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#C9A84C]" />
                  <h2 className="text-lg font-semibold text-[#F5F0E8]">Trending Now</h2>
                </div>
                <Link href="/shop" className="text-sm text-[#C9A84C] hover:underline">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {trending.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onTryOn={() => router.push('/try-on')}
                    onFindSimilar={() => router.push('/search')}
                  />
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar column */}
          <div className="space-y-6">

            {/* Body profile card */}
            <motion.div
              {...fadeUp}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Scan className="w-4 h-4 text-[#C9A84C]" />
                <h3 className="font-semibold text-[#F5F0E8] text-sm">Body Profile</h3>
              </div>
              <div className="space-y-3 mb-4">
                {[
                  { label: 'Body Shape', value: '—' },
                  { label: 'Size', value: '—' },
                  { label: 'Height', value: '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-white/40">{label}</span>
                    <span className="text-xs text-white/70">{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/40 mb-4">Complete your body profile for personalized recommendations.</p>
              <Link
                href="/body-scan"
                className="block w-full text-center bg-[#C9A84C] text-black text-sm font-semibold py-2.5 rounded-xl hover:bg-[#e0bb5a] transition-colors"
              >
                Complete Profile
              </Link>
            </motion.div>

            {/* Weather widget */}
            <motion.div
              {...fadeUp}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Cloud className="w-4 h-4 text-sky-400" />
                <h3 className="font-semibold text-[#F5F0E8] text-sm">Today's Weather</h3>
              </div>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-4xl">☀️</span>
                <div>
                  <p className="text-2xl font-bold text-[#F5F0E8]">24°C</p>
                  <p className="text-xs text-white/40">Sunny & warm</p>
                </div>
              </div>
              <p className="text-xs text-[#C9A84C] font-semibold uppercase tracking-wider mb-3">Outfit Suggestions</p>
              <div className="space-y-2">
                {weatherOutfits.map((outfit, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-[#F5F0E8] font-medium mb-1">{outfit.name}</p>
                    <div className="flex gap-1">
                      {outfit.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 px-1.5 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Personalized tip */}
            <motion.div
              {...fadeUp}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="rounded-2xl bg-gradient-to-br from-[#C9A84C]/10 to-purple-500/5 border border-[#C9A84C]/20 p-6"
            >
              <Sparkles className="w-5 h-5 text-[#C9A84C] mb-3" />
              <p className="text-sm font-semibold text-[#F5F0E8] mb-1">Stylist Tip</p>
              <p className="text-xs text-white/50 leading-relaxed">
                Pair earth tones with gold accessories for an effortlessly chic look this season.
              </p>
              <Link href="/stylist" className="mt-3 inline-flex items-center gap-1 text-xs text-[#C9A84C] hover:underline">
                Ask your stylist <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
