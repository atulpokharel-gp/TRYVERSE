'use client'

import Link from 'next/link'
import { ShoppingBag, Heart, User, Search, Menu } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-charcoal-100 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-serif text-2xl text-charcoal-900 tracking-tight">
              TryVerse
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/discover" className="text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors">
              Discover
            </Link>
            <Link href="/wardrobe" className="text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors">
              My Wardrobe
            </Link>
            <Link href="/stylist" className="text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors">
              AI Stylist
            </Link>
            <Link href="/occasions" className="text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors">
              Occasions
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-charcoal-600 hover:text-charcoal-900 transition-colors" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 text-charcoal-600 hover:text-charcoal-900 transition-colors" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </button>
            <button className="p-2 text-charcoal-600 hover:text-charcoal-900 transition-colors" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
            </button>
            <Link
              href="/profile"
              className="p-2 text-charcoal-600 hover:text-charcoal-900 transition-colors"
              aria-label="Profile"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              className="md:hidden p-2 text-charcoal-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-charcoal-100">
            <div className="flex flex-col gap-4">
              <Link href="/discover" className="text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors">
                Discover
              </Link>
              <Link href="/wardrobe" className="text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors">
                My Wardrobe
              </Link>
              <Link href="/stylist" className="text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors">
                AI Stylist
              </Link>
              <Link href="/occasions" className="text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors">
                Occasions
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
