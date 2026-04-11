import { NextRequest, NextResponse } from 'next/server'
import { runScrapeForSite, runScrapeForAllSites } from '@/lib/scrape-job-runner'

/**
 * POST /api/admin/scrape
 * Trigger scraping for a specific site (body: { siteId }) or all sites (body: { all: true })
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.all) {
      const results = await runScrapeForAllSites()
      return NextResponse.json({ message: 'Scrape completed for all sites', results })
    }

    if (!body.siteId) {
      return NextResponse.json(
        { error: 'siteId is required (or pass { all: true } to scrape all sites)' },
        { status: 400 }
      )
    }

    const result = await runScrapeForSite(body.siteId)
    return NextResponse.json({ message: 'Scrape completed', ...result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Scrape failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
