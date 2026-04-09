import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'TryVerse - Your AI Fashion Universe',
  description: 'Scan your body. Find your style. Try before you buy. AI-powered fashion recommendations tailored to you.',
  keywords: ['fashion', 'AI stylist', 'virtual try-on', 'body scan', 'style recommendations'],
  openGraph: {
    title: 'TryVerse - Your AI Fashion Universe',
    description: 'Scan your body. Find your style. Try before you buy.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
