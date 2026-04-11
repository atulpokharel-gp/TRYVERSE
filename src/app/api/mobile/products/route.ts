import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/data/products'

/**
 * GET /api/mobile/products
 *
 * Browse and filter products — no auth required.
 * Supports all the same filters as the web API.
 *
 * Query parameters:
 *   category, q, minPrice, maxPrice, occasion, bodyShape, trending, new, page, limit
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const q = searchParams.get('q')?.toLowerCase()
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const occasion = searchParams.get('occasion')
    const bodyShape = searchParams.get('bodyShape')
    const trending = searchParams.get('trending')
    const isNew = searchParams.get('new')
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const limit = parseInt(searchParams.get('limit') ?? '20', 10)

    let result = [...products]

    if (category && category !== 'all') {
      result = result.filter(p => p.category === category)
    }
    if (q) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      )
    }
    if (minPrice) {
      result = result.filter(p => p.price >= parseFloat(minPrice))
    }
    if (maxPrice) {
      result = result.filter(p => p.price <= parseFloat(maxPrice))
    }
    if (occasion) {
      result = result.filter(p => p.occasions?.includes(occasion))
    }
    if (bodyShape) {
      result = result.filter(p => p.bodyShapeCompatibility?.includes(bodyShape))
    }
    if (trending === 'true') {
      result = result.filter(p => p.isTrending)
    }
    if (isNew === 'true') {
      result = result.filter(p => p.isNew)
    }

    // Pagination
    const total = result.length
    const startIndex = (page - 1) * limit
    const paginated = result.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
