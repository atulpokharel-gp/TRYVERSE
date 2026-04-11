import { NextRequest, NextResponse } from 'next/server'
import { startScrapeJob } from '@/lib/phia'

/**
 * POST /api/cron/scrape-brands
 *
 * Cron-triggered endpoint for scheduled brand data collection.
 * Designed for Vercel Cron or external cron services.
 *
 * Expects a CRON_SECRET header for authentication in production.
 */
export async function POST(req: NextRequest) {
  // Verify cron secret in production
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const { jobId } = await startScrapeJob({
      jobType: 'incremental',
      background: true,
    })

    return NextResponse.json({
      message: 'Cron scrape job started',
      jobId,
    })
  } catch (err) {
    console.error('[cron/scrape-brands] Error:', err)
    return NextResponse.json(
      { error: 'Failed to start cron scrape job' },
      { status: 500 },
    )
  }
}

/**
 * GET handler — health check for cron monitoring tools.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'scrape-brands',
    schedule: 'Every 3 days',
  })
}
