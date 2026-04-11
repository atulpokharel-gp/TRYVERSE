import { NextRequest, NextResponse } from 'next/server'
import { getMockWeather, getWeatherBasedSuggestion } from '@/lib/weather'

/**
 * GET /api/mobile/weather
 *
 * Get weather data and fashion suggestion — no auth required.
 * Query param: ?city=London
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const city = searchParams.get('city') ?? undefined

    const weather = getMockWeather(city)
    const suggestion = getWeatherBasedSuggestion(weather)

    return NextResponse.json({ ...weather, suggestion })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 })
  }
}
