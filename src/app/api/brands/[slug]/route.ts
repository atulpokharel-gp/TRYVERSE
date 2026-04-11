import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/brands/[slug]
 *
 * Get a single brand by slug, including its products.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params

    const brand = await prisma.phiaBrand.findUnique({
      where: { slug },
      include: {
        products: {
          orderBy: { lastSeenAt: 'desc' },
          take: 100,
        },
      },
    })

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    return NextResponse.json({ data: brand })
  } catch (err) {
    console.error('[api/brands/slug] Error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch brand' },
      { status: 500 },
    )
  }
}
