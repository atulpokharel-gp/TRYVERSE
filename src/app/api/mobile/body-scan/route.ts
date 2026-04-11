import { NextRequest, NextResponse } from 'next/server'
import { analyzeBody } from '@/lib/body-analysis'
import type { SizeProfile } from '@/types/user'

/**
 * POST /api/mobile/body-scan
 *
 * Analyze body measurements and return recommendations.
 * No auth required.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const measurements: SizeProfile = body.measurements ?? {}

    const result = analyzeBody(measurements)

    return NextResponse.json({
      ...result,
      measurements,
      generatedAt: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json(
      { error: 'Body scan analysis failed' },
      { status: 500 }
    )
  }
}
