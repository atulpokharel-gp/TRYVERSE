import { NextRequest, NextResponse } from 'next/server'
import { runScrapeForAllSites } from '@/lib/scrape-job-runner'

/**
 * GET /api/cron/scrape
 *
 * Cron endpoint that scrapes all active sites.
 * Designed to be called by Vercel Cron (vercel.json) or an external scheduler
 * every 3 days.
 *
 * Protected by CRON_SECRET to prevent unauthorized access.
 */
export async function GET(req: NextRequest) {
  // Verify cron secret
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const results = await runScrapeForAllSites()

    const summary = {
      totalSites: results.length,
      completed: results.filter((r) => r.status === 'completed').length,
      failed: results.filter((r) => r.status === 'failed').length,
      totalProducts: results.reduce((sum, r) => sum + r.productsFound, 0),
    }

    return NextResponse.json({
      message: 'Cron scrape completed',
      summary,
      results,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Cron scrape failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
