import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-cream-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-xl text-cream-100 mb-4">TryVerse</h3>
            <p className="text-sm text-charcoal-400 leading-relaxed">
              Your AI-powered personal stylist. Discover fashion that fits your body, lifestyle, and budget.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-cream-100 mb-4">Discover</h4>
            <ul className="space-y-2 text-sm text-charcoal-400">
              <li><Link href="/discover" className="hover:text-cream-100 transition-colors">New Arrivals</Link></li>
              <li><Link href="/trending" className="hover:text-cream-100 transition-colors">Trending</Link></li>
              <li><Link href="/occasions" className="hover:text-cream-100 transition-colors">By Occasion</Link></li>
              <li><Link href="/brands" className="hover:text-cream-100 transition-colors">Brands</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-cream-100 mb-4">My Style</h4>
            <ul className="space-y-2 text-sm text-charcoal-400">
              <li><Link href="/wardrobe" className="hover:text-cream-100 transition-colors">My Wardrobe</Link></li>
              <li><Link href="/stylist" className="hover:text-cream-100 transition-colors">AI Stylist</Link></li>
              <li><Link href="/profile" className="hover:text-cream-100 transition-colors">Style Profile</Link></li>
              <li><Link href="/wishlist" className="hover:text-cream-100 transition-colors">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-cream-100 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-charcoal-400">
              <li><Link href="/about" className="hover:text-cream-100 transition-colors">About</Link></li>
              <li><Link href="/privacy" className="hover:text-cream-100 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-cream-100 transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-cream-100 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-charcoal-800 mt-8 pt-8 text-center text-sm text-charcoal-500">
          <p>© {new Date().getFullYear()} TryVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
