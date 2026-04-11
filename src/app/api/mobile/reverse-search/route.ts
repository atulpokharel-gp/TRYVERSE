import { NextRequest, NextResponse } from 'next/server'
import { mockProducts } from '@/data/products'

/**
 * POST /api/mobile/reverse-search
 *
 * Reverse image search for similar products — no auth required.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const query: string = body.query ?? body.imageUrl ?? ''

    // Mock: return a shuffled subset of products
    const shuffled = [...mockProducts].sort(() => Math.random() - 0.5)
    const results = shuffled.slice(0, 8).map((p) => ({
      ...p,
      similarity: Math.floor(Math.random() * 20 + 80),
      searchQuery: query,
    }))

    return NextResponse.json({ results, query })
  } catch {
    return NextResponse.json(
      { error: 'Reverse search failed' },
      { status: 500 }
    )
  }
}
