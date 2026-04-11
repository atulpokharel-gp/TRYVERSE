import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { authenticateMobileRequest } from '@/lib/mobile-auth'
import { Prisma } from '@prisma/client'

/**
 * Resolve the current user from either a NextAuth session (web) or
 * a Bearer token (mobile).  Returns { id, email } or null.
 */
async function resolveUser(req: NextRequest) {
  // Try session first (web)
  const session = await getServerSession(authOptions)
  if (session?.user?.id && session.user.email) {
    return { id: session.user.id, email: session.user.email }
  }
  // Fall back to Bearer token (mobile)
  const mobileUser = await authenticateMobileRequest(req)
  if (mobileUser) {
    return { id: mobileUser.id, email: mobileUser.email }
  }
  return null
}

export async function GET(req: NextRequest) {
  try {
    const user = await resolveUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const where: Prisma.WardrobeItemWhereInput = { userId: user.id }
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

export async function POST(req: NextRequest) {
  try {
    const user = await resolveUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { productId, category, notes } = body

    if (!productId || !category) {
      return NextResponse.json({ error: 'productId and category are required' }, { status: 400 })
    }

    // Prevent duplicates in same category
    const existing = await prisma.wardrobeItem.findFirst({
      where: { userId: user.id, productId, category },
    })
    if (existing) {
      return NextResponse.json({ message: 'Item already in wardrobe', data: existing })
    }

    const newItem = await prisma.wardrobeItem.create({
      data: {
        userId: user.id,
        productId,
        category,
        notes: notes ?? null,
      },
      include: { product: true },
    })

    return NextResponse.json({ data: newItem, message: 'Item added to wardrobe' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to update wardrobe' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await resolveUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')
    const category = searchParams.get('category')

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 })
    }

    const where: Prisma.WardrobeItemWhereInput = { userId: user.id, productId }
    if (category) {
      where.category = category
    }

    await prisma.wardrobeItem.deleteMany({ where })

    return NextResponse.json({ message: 'Item removed from wardrobe' })
  } catch {
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 })
  }
}
