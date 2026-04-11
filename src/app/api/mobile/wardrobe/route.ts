import { NextRequest, NextResponse } from 'next/server'
import { authenticateMobileRequest } from '@/lib/mobile-auth'
import { prisma } from '@/lib/db'

/**
 * GET /api/mobile/wardrobe
 *
 * Get the authenticated user's wardrobe items.
 * Optionally filter by category.
 */
export async function GET(req: NextRequest) {
  const user = await authenticateMobileRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const where: Record<string, unknown> = { userId: user.id }
    if (category) {
      where.category = category
    }

    const items = await prisma.wardrobeItem.findMany({
      where,
      include: { product: true },
      orderBy: { addedAt: 'desc' },
    })

    return NextResponse.json({ data: items })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch wardrobe' }, { status: 500 })
  }
}

/**
 * POST /api/mobile/wardrobe
 *
 * Add an item to the user's wardrobe.
 */
export async function POST(req: NextRequest) {
  const user = await authenticateMobileRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { productId, category, notes } = await req.json()

    if (!productId || !category) {
      return NextResponse.json(
        { error: 'productId and category are required' },
        { status: 400 }
      )
    }

    // Prevent duplicates
    const existing = await prisma.wardrobeItem.findFirst({
      where: { userId: user.id, productId, category },
    })
    if (existing) {
      return NextResponse.json({ message: 'Item already in wardrobe', data: existing })
    }

    const item = await prisma.wardrobeItem.create({
      data: {
        userId: user.id,
        productId,
        category,
        notes: notes ?? null,
      },
      include: { product: true },
    })

    return NextResponse.json(
      { data: item, message: 'Item added to wardrobe' },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to update wardrobe' }, { status: 500 })
  }
}

/**
 * DELETE /api/mobile/wardrobe
 *
 * Remove an item from the user's wardrobe.
 * Query params: ?productId=xxx&category=xxx
 */
export async function DELETE(req: NextRequest) {
  const user = await authenticateMobileRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')
    const category = searchParams.get('category')

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 })
    }

    const where: Record<string, unknown> = { userId: user.id, productId }
    if (category) {
      where.category = category
    }

    await prisma.wardrobeItem.deleteMany({ where })

    return NextResponse.json({ message: 'Item removed from wardrobe' })
  } catch {
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 })
  }
}
