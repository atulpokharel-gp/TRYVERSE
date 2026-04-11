import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { createMobileToken } from '@/lib/mobile-auth'

/**
 * POST /api/mobile/auth
 *
 * Mobile login — authenticates with email/password and returns a Bearer token.
 *
 * Request body:
 *   { email: string, password: string }
 *
 * Response:
 *   { token, expiresAt, user: { id, email, name, image } }
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password, action } = await req.json()

    if (action === 'register') {
      return handleRegister(req, email, password)
    }

    // --- Login ---
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    const { token, expiresAt } = await createMobileToken(user.id)

    return NextResponse.json({
      token,
      expiresAt,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
    })
  } catch (error) {
    console.error('[mobile/auth] login error:', error)
    return NextResponse.json(
      { error: 'Authentication failed.' },
      { status: 500 }
    )
  }
}

async function handleRegister(
  _req: NextRequest,
  email: string | undefined,
  password: string | undefined
) {
  try {
    // Read full body from the already-parsed JSON via closure isn't possible,
    // so we accept minimal fields from the parent call.
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      )
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { email, password: hashed },
    })

    const { token, expiresAt } = await createMobileToken(user.id)

    return NextResponse.json(
      {
        token,
        expiresAt,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        },
        message: 'Account created successfully.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[mobile/auth] register error:', error)
    return NextResponse.json(
      { error: 'Registration failed.' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/mobile/auth
 *
 * Logout — revokes the Bearer token.
 */
export async function DELETE(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided.' },
        { status: 400 }
      )
    }

    const token = auth.slice(7)
    const { revokeMobileToken } = await import('@/lib/mobile-auth')
    await revokeMobileToken(token)

    return NextResponse.json({ message: 'Logged out successfully.' })
  } catch (error) {
    console.error('[mobile/auth] logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed.' },
      { status: 500 }
    )
  }
}
