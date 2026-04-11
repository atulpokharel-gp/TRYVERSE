import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/health
 *
 * Health check endpoint for deployment monitoring and uptime checks.
 * Returns server status, database connectivity, and version info.
 */
export async function GET() {
  const health: {
    status: string
    timestamp: string
    version: string
    database: string
    uptime: number
  } = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '0.1.0',
    database: 'disconnected',
    uptime: process.uptime(),
  }

  try {
    // Test database connectivity
    await prisma.$queryRaw`SELECT 1`
    health.database = 'connected'
  } catch {
    health.status = 'degraded'
    health.database = 'disconnected'
  }

  const statusCode = health.status === 'ok' ? 200 : 503
  return NextResponse.json(health, { status: statusCode })
}
