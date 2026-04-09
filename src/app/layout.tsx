import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'TryVerse - Your AI Fashion Stylist',
  description: 'Discover your perfect style with AI-powered fashion recommendations tailored to your body, preferences, and occasion.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-cream-100 text-charcoal-900 antialiased`}>
        {children}
      </body>
    </html>
  )
}
