'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Sparkles, Home, ShoppingBag, Eye, Shirt, Wand2, Menu, X, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/shop', label: 'Shop', icon: ShoppingBag },
  { href: '/try-on', label: 'Try On', icon: Eye },
  { href: '/wardrobe', label: 'Wardrobe', icon: Shirt },
  { href: '/stylist', label: 'Stylist', icon: Wand2 },
]

export default function Header() {
  const { data: session, status } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-charcoal-100 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Sparkles className="w-5 h-5 text-[#C9A84C] group-hover:rotate-12 transition-transform duration-200" />
            <span className="font-serif text-xl text-charcoal-900 tracking-tight">TryVerse</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-2 text-sm text-charcoal-600 hover:text-charcoal-900 hover:bg-charcoal-50 rounded-lg transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-3">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-charcoal-100 animate-pulse" />
            ) : session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-charcoal-50 transition-colors"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? 'User'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C]/60 to-purple-500/60 flex items-center justify-center text-xs font-semibold text-white">
                      {(session.user.name ?? session.user.email ?? 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-charcoal-700">
                    {session.user.name?.split(' ')[0] ?? 'You'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-charcoal-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-premium border border-charcoal-100 py-1 z-50">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-charcoal-700 hover:bg-charcoal-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-charcoal-700 hover:bg-charcoal-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/wardrobe"
                      className="block px-4 py-2 text-sm text-charcoal-700 hover:bg-charcoal-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Wardrobe
                    </Link>
                    <hr className="my-1 border-charcoal-100" />
                    <button
                      onClick={() => { signOut({ callbackUrl: '/' }); setUserMenuOpen(false) }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-charcoal-600 hover:text-charcoal-900 px-3 py-2 rounded-lg hover:bg-charcoal-50 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm font-semibold bg-[#0f0f0f] text-[#F5F0E8] px-5 py-2 rounded-full hover:bg-charcoal-800 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-charcoal-600 hover:text-charcoal-900 rounded-lg hover:bg-charcoal-50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-charcoal-100 pt-4">
            <nav className="flex flex-col gap-1 mb-4">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-charcoal-700 hover:bg-charcoal-50 rounded-lg transition-colors"
                >
                  <Icon className="w-4 h-4 text-charcoal-400" />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 pt-4 border-t border-charcoal-100">
              {session?.user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-charcoal-700 px-3 py-2">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false) }}
                    className="text-left text-sm font-medium text-red-600 px-3 py-2"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="btn-secondary text-center">
                    Log in
                  </Link>
                  <Link href="/auth/signup" onClick={() => setMobileOpen(false)} className="btn-primary text-center">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
