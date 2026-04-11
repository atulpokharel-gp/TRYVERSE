import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/admin/scraped-products — List scraped products with optional filters
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const brand = searchParams.get('brand')
    const category = searchParams.get('category')
    const siteId = searchParams.get('siteId')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (brand) where.brand = brand
    if (category) where.category = category
    if (siteId) where.siteId = siteId

    const [products, total] = await Promise.all([
      prisma.scrapedProduct.findMany({
        where,
        orderBy: { scrapedAt: 'desc' },
        skip,
        take: limit,
        include: { site: { select: { name: true, url: true } } },
      }),
      prisma.scrapedProduct.count({ where }),
    ])

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch scraped products' }, { status: 500 })
  }
}
