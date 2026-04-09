'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Camera,
  Eye,
  Sparkles,
  Cloud,
  Search,
  Shirt,
  ChevronRight,
  Star,
  ArrowRight,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
}

const features = [
  {
    icon: Camera,
    title: 'AI Body Scan',
    description: 'Upload a photo and our AI maps your exact measurements in seconds.',
  },
  {
    icon: Eye,
    title: 'Virtual Try-On',
    description: 'See how any outfit looks on your body before you buy.',
  },
  {
    icon: Sparkles,
    title: 'Smart Stylist',
    description: 'Chat with your AI personal stylist for outfit ideas and advice.',
  },
  {
    icon: Cloud,
    title: 'Weather Styling',
    description: 'Get outfit suggestions based on today\'s local weather automatically.',
  },
  {
    icon: Search,
    title: 'Reverse Search',
    description: 'Upload any image and find similar items across thousands of brands.',
  },
  {
    icon: Shirt,
    title: 'Smart Wardrobe',
    description: 'Organise your clothes and discover new combinations you never thought of.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Scan Your Body',
    description: 'Upload a simple full-length photo. Our AI extracts your measurements and body shape in under 10 seconds.',
  },
  {
    number: '02',
    title: 'Set Your Style',
    description: 'Tell us your aesthetic, occasion, and budget. The more you share, the better we personalise.',
  },
  {
    number: '03',
    title: 'Try & Shop',
    description: 'Browse AI-curated looks, virtually try them on, and checkout with confidence knowing they fit.',
  },
]

const testimonials = [
  {
    name: 'Aisha Mensah',
    role: 'Fashion blogger',
    quote: 'TryVerse completely changed how I shop online. The virtual try-on is scary accurate — I haven\'t had a wrong-size return since.',
    initials: 'AM',
  },
  {
    name: 'Jordan Lee',
    role: 'Creative director',
    quote: 'The AI Stylist feels like having a personal shopper on call 24/7. It actually understands my aesthetic.',
    initials: 'JL',
  },
  {
    name: 'Sofia Romero',
    role: 'Entrepreneur',
    quote: 'I was sceptical at first but the body scan nailed my measurements. Now I buy in bulk and everything fits perfectly.',
    initials: 'SR',
  },
]

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '200K+', label: 'Products' },
  { value: '98%', label: 'Fit Accuracy' },
  { value: '4.9★', label: 'App Rating' },
]

export default function LandingPage() {
  return (
    <div className="bg-[#0f0f0f] text-[#F5F0E8] overflow-x-hidden">
      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#0f0f0f]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C9A84C]" />
            <span className="font-serif text-xl tracking-tight">TryVerse</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#F5F0E8]/60">
            <a href="#features" className="hover:text-[#F5F0E8] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#F5F0E8] transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-[#F5F0E8] transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm text-[#F5F0E8]/70 hover:text-[#F5F0E8] transition-colors px-4 py-2"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm bg-[#C9A84C] text-[#0f0f0f] font-semibold px-5 py-2 rounded-full hover:bg-[#E2C97A] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#1a1040] to-[#0f0f0f]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(201,168,76,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(80,40,160,0.15),transparent_60%)]" />

        {/* Floating fashion images */}
        <div className="absolute top-24 right-8 md:right-24 w-32 md:w-48 h-44 md:h-64 rounded-2xl overflow-hidden opacity-40 rotate-6 shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop"
            alt="Fashion"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute bottom-32 right-4 md:right-56 w-24 md:w-36 h-32 md:h-48 rounded-2xl overflow-hidden opacity-30 -rotate-3 shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=450&fit=crop"
            alt="Fashion"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute top-40 left-4 md:left-20 w-20 md:w-32 h-28 md:h-44 rounded-2xl overflow-hidden opacity-25 rotate-3 shadow-2xl hidden sm:block">
          <Image
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=450&fit=crop"
            alt="Fashion"
            fill
            className="object-cover"
          />
        </div>

        {/* Hero content */}
        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto px-6"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#C9A84C] border border-[#C9A84C]/30 rounded-full px-4 py-1.5 mb-8">
              <Sparkles className="w-3 h-3" /> AI-Powered Fashion
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif leading-[1.05] mb-6"
          >
            Your AI{' '}
            <span className="bg-gradient-to-r from-[#C9A84C] via-[#E2C97A] to-[#C9A84C] bg-clip-text text-transparent">
              Fashion
            </span>
            <br />Universe
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-[#F5F0E8]/60 max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Scan your body. Find your style. Try before you buy.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-2 bg-[#C9A84C] text-[#0f0f0f] font-semibold text-base px-8 py-4 rounded-full hover:bg-[#E2C97A] transition-all duration-200 shadow-lg shadow-[#C9A84C]/20"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-[#F5F0E8]/70 hover:text-[#F5F0E8] text-base px-8 py-4 rounded-full border border-white/10 hover:border-white/20 transition-all duration-200"
            >
              See How it Works
            </a>
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-12 border-y border-white/5 bg-[#111111]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-serif text-[#C9A84C] mb-1">{s.value}</div>
              <div className="text-sm text-[#F5F0E8]/50 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-xs font-semibold tracking-widest uppercase text-[#C9A84C] mb-3">
              Everything You Need
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif mb-4">
              Fashion meets intelligence
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#F5F0E8]/50 max-w-xl mx-auto">
              A complete suite of AI tools that make getting dressed the best part of your day.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="group p-7 rounded-2xl bg-white/5 border border-white/8 hover:border-[#C9A84C]/30 hover:bg-white/8 backdrop-blur-sm transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mb-5 group-hover:bg-[#C9A84C]/20 transition-colors">
                  <f.icon className="w-5 h-5 text-[#C9A84C]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-[#F5F0E8]/50 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6 bg-[#111111]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-xs font-semibold tracking-widest uppercase text-[#C9A84C] mb-3">
              Simple Process
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif">
              Up and styled in minutes
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {steps.map((step, i) => (
              <motion.div key={step.number} variants={fadeUp} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-[#C9A84C]/30 to-transparent -translate-x-4" />
                )}
                <div className="text-5xl font-serif text-[#C9A84C]/20 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-sm text-[#F5F0E8]/50 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-xs font-semibold tracking-widest uppercase text-[#C9A84C] mb-3">
              Real People, Real Style
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif">
              Loved by fashion lovers
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                className="p-7 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm"
              >
                <div className="flex items-center gap-1 text-[#C9A84C] mb-5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-[#F5F0E8]/70 text-sm leading-relaxed mb-6">&quot;{t.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A84C]/60 to-[#8040C0]/60 flex items-center justify-center text-sm font-semibold">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-[#F5F0E8]/40">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-[#111111]">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 mb-8"
          >
            <Sparkles className="w-7 h-7 text-[#C9A84C]" />
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif mb-6">
            Start Your Style Journey
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#F5F0E8]/50 mb-10 text-lg">
            Join 50,000+ people who have transformed the way they dress.
            It&apos;s free to get started.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-2 bg-[#C9A84C] text-[#0f0f0f] font-semibold text-base px-10 py-4 rounded-full hover:bg-[#E2C97A] transition-all duration-200 shadow-lg shadow-[#C9A84C]/20"
            >
              Get Started Free
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C9A84C]" />
            <span className="font-serif text-lg">TryVerse</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-[#F5F0E8]/40">
            <a href="#" className="hover:text-[#F5F0E8] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#F5F0E8] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#F5F0E8] transition-colors">Contact</a>
            <a href="#" className="hover:text-[#F5F0E8] transition-colors">Blog</a>
          </div>
          <p className="text-sm text-[#F5F0E8]/30">© 2024 TryVerse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
