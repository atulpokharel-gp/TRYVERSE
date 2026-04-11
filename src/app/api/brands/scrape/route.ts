import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { startScrapeJob } from '@/lib/phia'
import type { JobType } from '@/lib/phia'

const VALID_JOB_TYPES = ['full', 'incremental', 'detail'] as const

/**
 * POST /api/brands/scrape
 *
 * Trigger a new Phia brand scrape job.
 * Body: { jobType?: "full"|"incremental"|"detail", targetUrl?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const jobType = VALID_JOB_TYPES.includes(body.jobType) ? body.jobType as JobType : 'full'
    const targetUrl = typeof body.targetUrl === 'string' ? body.targetUrl : undefined

    // Validate targetUrl if provided
    if (targetUrl) {
      try {
        const parsed = new URL(targetUrl)
        if (!parsed.hostname.endsWith('phia.com') && !parsed.hostname.endsWith('phia.co')) {
          return NextResponse.json(
            { error: 'Target URL must be a phia.com or phia.co domain' },
            { status: 400 },
          )
        }
      } catch {
        return NextResponse.json(
          { error: 'Invalid target URL' },
          { status: 400 },
        )
      }
    }

    // Prevent concurrent jobs
    const running = await prisma.brandScrapeJob.findFirst({
      where: { status: 'running' },
    })

    if (running) {
      return NextResponse.json(
        {
          error: 'A scrape job is already running',
          jobId: running.id,
        },
        { status: 409 },
      )
    }

    const { jobId } = await startScrapeJob({
      jobType,
      targetUrl,
      background: true,
    })

    return NextResponse.json({
      message: 'Scrape job started',
      jobId,
      jobType,
    })
  } catch (err) {
    console.error('[api/brands/scrape] POST error:', err)
    return NextResponse.json(
      { error: 'Failed to start scrape job' },
      { status: 500 },
    )
  }
}

/**
 * GET /api/brands/scrape
 *
 * Get scrape job status. Optionally pass ?jobId=<id> for a specific job,
 * otherwise returns the most recent jobs.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get('jobId')

    if (jobId) {
      const job = await prisma.brandScrapeJob.findUnique({
        where: { id: jobId },
        include: {
          logs: {
            orderBy: { createdAt: 'desc' },
            take: 50,
          },
        },
      })

      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
      }

      return NextResponse.json({ data: job })
    }

    // List recent jobs
    const jobs = await prisma.brandScrapeJob.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        _count: { select: { logs: true } },
      },
    })

    return NextResponse.json({ data: jobs })
  } catch (err) {
    console.error('[api/brands/scrape] GET error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch scrape jobs' },
      { status: 500 },
    )
  }
}
