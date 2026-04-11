import { NextRequest, NextResponse } from 'next/server'

const mockResponses: Record<string, string> = {
  rain: "For rainy days, I'd suggest layering with a classic trench coat over a cosy turtleneck. Pair with ankle boots in a water-resistant leather and carry a structured tote. Earth tones — camel, dark brown, navy — are perfect for gloomy weather while still looking polished. 🌧️",
  summer: "Summer dressing is all about breathable fabrics and easy silhouettes! Try a linen slip dress in ivory or sage with flat raffia sandals. Add a minimal gold belt to define your waist. For evenings, layer a lightweight denim jacket. ☀️",
  party: "For a party, you want to stand out! Consider a sleek bodycon midi dress in a rich colour — midnight navy or champagne. Pair with strappy block heels for elegance without sacrificing comfort on the dance floor. ✨",
  office: "A polished office look starts with well-tailored trousers in beige or black. Tuck in a silk blouse and add a structured blazer for authority. Loafers or low block heels keep it comfortable for long days. 💼",
  casual: "Casual doesn't mean careless! An oversized graphic tee tucked into high-rise jeans creates an effortless look. Add white sneakers and a crossbody bag. Layer fine gold necklaces for that effortless polish. 🌿",
  winter: "Winter layering is an art! Start with a cashmere turtleneck, add wide-leg tailored trousers, and top with a quilted puffer or wool coat. Knee-high leather boots look stunning and keep you warm. Rich tones — burgundy, forest green, camel — are your winter palette. ❄️",
}

const getAIResponse = (message: string): string => {
  const lower = message.toLowerCase()
  for (const [keyword, response] of Object.entries(mockResponses)) {
    if (lower.includes(keyword)) return response
  }
  return "Great question! Fashion is all about expressing your unique self. I'd recommend starting with well-fitting basics — a crisp white blouse, tailored trousers, and quality shoes. Would you like specific advice on a particular occasion, season, or body shape? ✨"
}

/**
 * POST /api/mobile/chat
 *
 * AI fashion stylist chat — no auth required.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'message is required' }, { status: 400 })
    }

    // Simulate AI processing delay
    await new Promise(res => setTimeout(res, 500))

    const response = getAIResponse(message)

    return NextResponse.json({
      data: {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        createdAt: new Date().toISOString(),
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
  }
}
