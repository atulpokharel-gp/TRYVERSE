import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware to add CORS headers for mobile app access.
 * This allows cross-origin requests from mobile apps and other frontends.
 */

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:8081', // React Native / Expo
  'http://localhost:19006', // Expo web
  process.env.NEXTAUTH_URL,
  process.env.MOBILE_APP_ORIGIN,
].filter(Boolean) as string[]

function getCorsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
  }

  if (!origin) {
    // No origin = likely a native mobile app or server-to-server call.
    // Use wildcard without credentials.
    headers['Access-Control-Allow-Origin'] = '*'
  } else if (ALLOWED_ORIGINS.includes(origin)) {
    // Known origin — allow with credentials support.
    headers['Access-Control-Allow-Origin'] = origin
    headers['Access-Control-Allow-Credentials'] = 'true'
  } else {
    // Unknown origin — allow without credentials.
    headers['Access-Control-Allow-Origin'] = origin
  }

  return headers
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const origin = request.headers.get('origin')

  // Only apply CORS to API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: getCorsHeaders(origin),
    })
  }

  // Add CORS headers to response
  const response = NextResponse.next()
  const corsHeaders = getCorsHeaders(origin)
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value)
  }

  return response
}

export const config = {
  matcher: '/api/:path*',
}
