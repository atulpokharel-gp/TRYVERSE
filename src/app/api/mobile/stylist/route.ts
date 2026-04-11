import { NextRequest, NextResponse } from 'next/server'
import { generateStylistResponse } from '@/lib/mock-ai'

/**
 * POST /api/mobile/stylist
 *
 * Advanced AI stylist with product recommendations — no auth required.
 */
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const response = generateStylistResponse(message)

    return NextResponse.json({
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: response.content,
      products: response.products,
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json(
      { error: 'Stylist response failed' },
      { status: 500 }
    )
  }
}
