import { NextRequest, NextResponse } from 'next/server'
import { authenticateMobileRequest } from '@/lib/mobile-auth'
import { prisma } from '@/lib/db'

const calculateBodyShape = (chest: number, waist: number, hips: number, shoulders: number): string => {
  const waistRatio = waist / hips
  const hipBustDiff = hips - chest
  const shoulderHipDiff = shoulders - hips
  if (waistRatio < 0.75 && Math.abs(chest - hips) < 5) return 'hourglass'
  if (hipBustDiff > 5 && waistRatio < 0.8) return 'pear'
  if (shoulderHipDiff > 5) return 'inverted-triangle'
  if (waistRatio > 0.85 && chest > hips) return 'apple'
  return 'rectangle'
}

const calculateSize = (chest: number, waist: number, hips: number): string => {
  const avg = (chest + waist + hips) / 3
  if (avg < 80) return 'XS'
  if (avg < 88) return 'S'
  if (avg < 96) return 'M'
  if (avg < 104) return 'L'
  if (avg < 112) return 'XL'
  return 'XXL'
}

/**
 * GET /api/mobile/body-profile
 *
 * Get the authenticated user's body profile.
 */
export async function GET(req: NextRequest) {
  const user = await authenticateMobileRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const profile = await prisma.bodyProfile.findUnique({
      where: { userId: user.id },
    })

    if (!profile) {
      return NextResponse.json({ data: null, message: 'No profile found' })
    }

    return NextResponse.json({ data: profile })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch body profile' }, { status: 500 })
  }
}

/**
 * POST /api/mobile/body-profile
 *
 * Create or update the authenticated user's body profile.
 */
export async function POST(req: NextRequest) {
  const user = await authenticateMobileRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { height, weight, chest, waist, hips, shoulders, fitNotes } = body

    let bodyShape: string | undefined
    let sizeCategory: string | undefined

    if (chest && waist && hips && shoulders) {
      bodyShape = calculateBodyShape(
        parseFloat(chest),
        parseFloat(waist),
        parseFloat(hips),
        parseFloat(shoulders)
      )
      sizeCategory = calculateSize(
        parseFloat(chest),
        parseFloat(waist),
        parseFloat(hips)
      )
    }

    const data = {
      height: height ? parseFloat(height) : null,
      weight: weight ? parseFloat(weight) : null,
      chest: chest ? parseFloat(chest) : null,
      waist: waist ? parseFloat(waist) : null,
      hips: hips ? parseFloat(hips) : null,
      shoulders: shoulders ? parseFloat(shoulders) : null,
      bodyShape: bodyShape ?? null,
      sizeCategory: sizeCategory ?? null,
      fitNotes: fitNotes ?? null,
    }

    const profile = await prisma.bodyProfile.upsert({
      where: { userId: user.id },
      create: { userId: user.id, ...data },
      update: data,
    })

    return NextResponse.json(
      { data: profile, message: 'Body profile saved successfully' },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to save body profile' }, { status: 500 })
  }
}
