import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// In-memory store for demo (replace with Prisma in production)
const profileStore: Record<string, {
  height?: number
  weight?: number
  chest?: number
  waist?: number
  hips?: number
  shoulders?: number
  bodyShape?: string
  sizeCategory?: string
  fitNotes?: string
  updatedAt: string
}> = {}

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

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = profileStore[session.user.email]
    if (!profile) {
      return NextResponse.json({ data: null, message: 'No profile found' })
    }

    return NextResponse.json({ data: profile })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch body profile' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    const profile = {
      height: height ? parseFloat(height) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      chest: chest ? parseFloat(chest) : undefined,
      waist: waist ? parseFloat(waist) : undefined,
      hips: hips ? parseFloat(hips) : undefined,
      shoulders: shoulders ? parseFloat(shoulders) : undefined,
      bodyShape,
      sizeCategory,
      fitNotes,
      updatedAt: new Date().toISOString(),
    }

    profileStore[session.user.email] = profile

    return NextResponse.json({
      data: profile,
      message: 'Body profile saved successfully',
    }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to save body profile' }, { status: 500 })
  }
}
