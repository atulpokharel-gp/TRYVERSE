import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/admin/sites — List all scrape sites
 */
export async function GET() {
  try {
    const sites = await prisma.scrapeSite.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { scrapedProducts: true, scrapeJobs: true } },
        scrapeJobs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    return NextResponse.json({ sites })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch sites' }, { status: 500 })
  }
}

/**
 * POST /api/admin/sites — Create a new scrape site
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, url, brand, category } = body

    if (!name || !url || !brand) {
      return NextResponse.json(
        { error: 'name, url, and brand are required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    const site = await prisma.scrapeSite.create({
      data: {
        name,
        url,
        brand,
        category: category || 'all',
      },
    })

    return NextResponse.json({ site }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create site' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/sites — Delete a scrape site by id (query param)
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    await prisma.scrapeSite.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete site' }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/sites — Update a scrape site
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    // Validate URL if being updated
    if (updates.url) {
      try {
        new URL(updates.url)
      } catch {
        return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
      }
    }

    const site = await prisma.scrapeSite.update({
      where: { id },
      data: updates,
    })

    return NextResponse.json({ site })
  } catch {
    return NextResponse.json({ error: 'Failed to update site' }, { status: 500 })
  }
}
