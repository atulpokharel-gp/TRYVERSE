import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/brands
 *
 * List all collected Phia brands with optional search, category filter,
 * and pagination.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.toLowerCase()
    const category = searchParams.get('category')
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '50', 10)))
    const offset = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (q) {
      where.OR = [
        { name: { contains: q } },
        { slug: { contains: q } },
        { description: { contains: q } },
      ]
    }

    if (category) {
      where.category = category
    }

    const [brands, total] = await Promise.all([
      prisma.phiaBrand.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: offset,
        take: limit,
        include: {
          _count: { select: { products: true } },
        },
      }),
      prisma.phiaBrand.count({ where }),
    ])

    return NextResponse.json({
      data: brands,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (err) {
    console.error('[api/brands] Error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 },
    )
  }
}
