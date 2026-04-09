import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// In-memory store for demo (replace with Prisma in production)
const wardrobeStore: Record<string, { productId: string; category: string; notes?: string; addedAt: string }[]> = {}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const userItems = wardrobeStore[session.user.email] ?? []
    const filtered = category ? userItems.filter(i => i.category === category) : userItems

    return NextResponse.json({ data: filtered })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch wardrobe' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { productId, category, notes } = body

    if (!productId || !category) {
      return NextResponse.json({ error: 'productId and category are required' }, { status: 400 })
    }

    if (!wardrobeStore[session.user.email]) {
      wardrobeStore[session.user.email] = []
    }

    // Prevent duplicates in same category
    const existing = wardrobeStore[session.user.email].find(
      i => i.productId === productId && i.category === category
    )
    if (existing) {
      return NextResponse.json({ message: 'Item already in wardrobe', data: existing })
    }

    const newItem = { productId, category, notes, addedAt: new Date().toISOString() }
    wardrobeStore[session.user.email].push(newItem)

    return NextResponse.json({ data: newItem, message: 'Item added to wardrobe' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to update wardrobe' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')
    const category = searchParams.get('category')

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 })
    }

    const userItems = wardrobeStore[session.user.email] ?? []
    wardrobeStore[session.user.email] = userItems.filter(
      i => !(i.productId === productId && (!category || i.category === category))
    )

    return NextResponse.json({ message: 'Item removed from wardrobe' })
  } catch {
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 })
  }
}
