import { NextRequest, NextResponse } from 'next/server'
import { authenticateMobileRequest } from '@/lib/mobile-auth'
import { prisma } from '@/lib/db'

/**
 * GET /api/mobile/profile
 *
 * Get the authenticated user's profile.
 */
export async function GET(req: NextRequest) {
  const user = await authenticateMobileRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        gender: true,
        stylePreference: true,
        bodyType: true,
        sizeCategory: true,
        favoriteBrands: true,
        budgetMin: true,
        budgetMax: true,
        occasionPreferences: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ data: fullUser })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

/**
 * PUT /api/mobile/profile
 *
 * Update the authenticated user's profile.
 */
export async function PUT(req: NextRequest) {
  const user = await authenticateMobileRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, gender, stylePreference, bodyType, favoriteBrands, budgetMin, budgetMax, occasionPreferences } = body

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(gender !== undefined && { gender }),
        ...(stylePreference !== undefined && { stylePreference }),
        ...(bodyType !== undefined && { bodyType }),
        ...(favoriteBrands !== undefined && { favoriteBrands }),
        ...(budgetMin !== undefined && { budgetMin: budgetMin ? Number(budgetMin) : null }),
        ...(budgetMax !== undefined && { budgetMax: budgetMax ? Number(budgetMax) : null }),
        ...(occasionPreferences !== undefined && { occasionPreferences }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        gender: true,
        stylePreference: true,
        bodyType: true,
        sizeCategory: true,
        favoriteBrands: true,
        budgetMin: true,
        budgetMax: true,
        occasionPreferences: true,
      },
    })

    return NextResponse.json({ data: updated, message: 'Profile updated successfully' })
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
