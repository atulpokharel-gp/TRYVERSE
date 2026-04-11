import { prisma } from './db'
import { scrapeSite } from './scraper'

/**
 * Runs the scraping job for a single site: fetches products, upserts them
 * into ScrapedProduct, and records the job outcome in ScrapeJob.
 */
export async function runScrapeForSite(siteId: string) {
  const site = await prisma.scrapeSite.findUnique({ where: { id: siteId } })
  if (!site) throw new Error(`ScrapeSite ${siteId} not found`)

  // Create job record
  const job = await prisma.scrapeJob.create({
    data: {
      siteId: site.id,
      status: 'running',
      startedAt: new Date(),
    },
  })

  try {
    const products = await scrapeSite(site.url, site.brand, site.category)

    // Upsert scraped products using compound unique constraint (url + siteId)
    let count = 0
    for (const p of products) {
      await prisma.scrapedProduct.upsert({
        where: {
          url_siteId: { url: p.url, siteId: site.id },
        },
        create: {
          name: p.name,
          brand: p.brand,
          category: p.category,
          url: p.url,
          price: p.price,
          currency: p.currency,
          imageUrl: p.imageUrl,
          description: p.description ?? null,
          siteId: site.id,
        },
        update: {
          name: p.name,
          price: p.price,
          currency: p.currency,
          imageUrl: p.imageUrl,
          description: p.description ?? null,
          updatedAt: new Date(),
        },
      })
      count++
    }

    // Mark job as completed
    await prisma.scrapeJob.update({
      where: { id: job.id },
      data: {
        status: 'completed',
        productsFound: count,
        completedAt: new Date(),
      },
    })

    return { jobId: job.id, productsFound: count }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await prisma.scrapeJob.update({
      where: { id: job.id },
      data: {
        status: 'failed',
        error: message.slice(0, 500),
        completedAt: new Date(),
      },
    })
    throw error
  }
}

/**
 * Runs scraping for ALL active sites — used by the cron endpoint.
 */
export async function runScrapeForAllSites() {
  const sites = await prisma.scrapeSite.findMany({ where: { isActive: true } })

  const results: { siteId: string; siteName: string; status: string; productsFound: number; error?: string }[] = []

  for (const site of sites) {
    try {
      const result = await runScrapeForSite(site.id)
      results.push({
        siteId: site.id,
        siteName: site.name,
        status: 'completed',
        productsFound: result.productsFound,
      })
    } catch (error) {
      results.push({
        siteId: site.id,
        siteName: site.name,
        status: 'failed',
        productsFound: 0,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return results
}
