import { NextRequest } from 'next/server'
import { randomBytes } from 'crypto'
import { prisma } from './db'

/**
 * JWT-like token utilities for mobile API authentication.
 *
 * Tokens are stored in the MobileToken table and validated on each request.
 * This avoids cookie/session dependencies so native mobile apps can
 * authenticate with a simple `Authorization: Bearer <token>` header.
 */

/**
 * Generate a cryptographically secure random token string.
 */
export function generateToken(): string {
  return randomBytes(48).toString('base64url')
}

/**
 * Extract the Bearer token from an Authorization header.
 */
export function extractBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  return auth.slice(7)
}

/**
 * Validate a mobile token and return the associated user.
 * Returns null if the token is invalid or expired.
 */
export async function validateMobileToken(token: string) {
  try {
    const mobileToken = await prisma.mobileToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!mobileToken) return null

    // Check expiry
    if (mobileToken.expiresAt < new Date()) {
      // Clean up expired token
      await prisma.mobileToken.delete({ where: { id: mobileToken.id } })
      return null
    }

    return {
      id: mobileToken.user.id,
      email: mobileToken.user.email,
      name: mobileToken.user.name,
      image: mobileToken.user.image,
    }
  } catch {
    return null
  }
}

/**
 * Create a new mobile token for a user.
 * Tokens expire after 30 days by default.
 */
export async function createMobileToken(userId: string, expiresInDays = 30) {
  const token = generateToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + expiresInDays)

  await prisma.mobileToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  })

  return { token, expiresAt: expiresAt.toISOString() }
}

/**
 * Revoke (delete) a mobile token.
 */
export async function revokeMobileToken(token: string) {
  try {
    await prisma.mobileToken.delete({ where: { token } })
    return true
  } catch {
    return false
  }
}

/**
 * Authenticate a mobile request.
 * Extracts the Bearer token, validates it, and returns the user or null.
 */
export async function authenticateMobileRequest(req: NextRequest) {
  const token = extractBearerToken(req)
  if (!token) return null
  return validateMobileToken(token)
}
