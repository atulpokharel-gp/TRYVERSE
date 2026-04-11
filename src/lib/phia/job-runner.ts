/**
 * Phia Brand Scrape Job Runner.
 *
 * Orchestrates the full scraping pipeline:
 * 1. Fetch seed listing pages (/brands, /brands/all)
 * 2. Parse brand cards and discover brand detail URLs
 * 3. Incrementally fetch brand detail pages
 * 4. Persist results to the database via Prisma
 *
 * Designed for incremental collection — brands already in the DB
 * are updated rather than duplicated.
 */

import { prisma } from '@/lib/db'
import { DEFAULT_CONFIG, SEED_URLS } from './config'
import { fetchWithRetry, runWithConcurrency, sleep } from './fetcher'
import { parseBrandListingPage, parseBrandDetailPage } from './parser'
import type {
  ScrapeConfig,
  ScrapeJobResult,
  ScrapedBrand,
  ScrapedProduct,
  LogLevel,
} from './types'

export type JobType = 'full' | 'incremental' | 'detail'

interface RunOptions {
  jobType?: JobType
  targetUrl?: string
  config?: Partial<ScrapeConfig>
}

/**
 * Create and execute a brand scrape job.
 * Returns the job ID immediately if `background` is true.
 */
export async function startScrapeJob(
  options: RunOptions & { background?: boolean } = {},
): Promise<{ jobId: string; result?: ScrapeJobResult }> {
  const job = await prisma.brandScrapeJob.create({
    data: {
      jobType: options.jobType ?? 'full',
      targetUrl: options.targetUrl ?? null,
      status: 'pending',
    },
  })

  if (options.background) {
    // Fire-and-forget: run in background
    runScrapeJob(job.id, options).catch((err) => {
      console.error(`[phia-scraper] Background job ${job.id} failed:`, err)
    })
    return { jobId: job.id }
  }

  const result = await runScrapeJob(job.id, options)
  return { jobId: job.id, result }
}

/**
 * Core scrape job execution.
 */
async function runScrapeJob(
  jobId: string,
  options: RunOptions,
): Promise<ScrapeJobResult> {
  const config = { ...DEFAULT_CONFIG, ...options.config }
  const result: ScrapeJobResult = {
    brandsFound: 0,
    productsFound: 0,
    pagesScraped: 0,
    errorCount: 0,
    errors: [],
  }

  const log = createLogger(jobId)

  try {
    await prisma.brandScrapeJob.update({
      where: { id: jobId },
      data: { status: 'running', startedAt: new Date() },
    })

    await log('info', 'Scrape job started', config.baseUrl)

    // ── Phase 1: Scrape brand listing pages ──
    const allBrands: ScrapedBrand[] = []
    const allDetailUrls: string[] = []

    if (options.targetUrl) {
      // Scrape a specific URL only
      await scrapeSingleUrl(options.targetUrl, config, allBrands, allDetailUrls, result, log)
    } else {
      // Scrape all seed URLs
      for (const seedPath of SEED_URLS) {
        let url: string | null = `${config.baseUrl}${seedPath}`

        while (url) {
          await scrapeSingleUrl(url, config, allBrands, allDetailUrls, result, log)
          // If the page has pagination, follow it
          // (the URL is updated inside scrapeSingleUrl wouldn't work, so do it here)
          const html = await fetchWithRetry(url, config).catch(() => null)
          if (!html) break
          const pageResult = parseBrandListingPage(html, url, config.baseUrl)
          url = pageResult.nextPageUrl
          if (url) {
            await sleep(config.requestDelayMs)
          }
        }
      }
    }

    await log('info', `Listing phase complete: ${allBrands.length} brands discovered`)

    // ── Phase 2: Persist discovered brands ──
    for (const brand of allBrands) {
      await upsertBrand(brand)
      result.brandsFound++
    }

    await log('success', `${result.brandsFound} brands persisted to database`)

    // ── Phase 3: Scrape brand detail pages (incremental) ──
    const detailUrls = config.maxDetailPages > 0
      ? allDetailUrls.slice(0, config.maxDetailPages)
      : allDetailUrls

    if (detailUrls.length > 0) {
      await log('info', `Scraping ${detailUrls.length} brand detail pages`)

      await runWithConcurrency(
        detailUrls,
        config.maxConcurrency,
        config.requestDelayMs,
        async (detailUrl) => {
          try {
            const html = await fetchWithRetry(detailUrl, config)
            const { brand: brandUpdate, products } = parseBrandDetailPage(
              html,
              detailUrl,
              config.baseUrl,
            )
            result.pagesScraped++

            // Update brand with detail info
            const slug = extractSlugFromUrl(detailUrl)
            if (slug) {
              await prisma.phiaBrand.updateMany({
                where: { slug },
                data: {
                  description: brandUpdate.description ?? undefined,
                  websiteUrl: brandUpdate.websiteUrl ?? undefined,
                  logoUrl: brandUpdate.logoUrl ?? undefined,
                  lastScrapedAt: new Date(),
                  productCount: products.length,
                },
              })
            }

            // Persist products
            for (const product of products) {
              await upsertProduct(slug!, product)
              result.productsFound++
            }

            await log('info', `Scraped ${detailUrl}: ${products.length} products`, detailUrl)
          } catch (err) {
            result.errorCount++
            const msg = err instanceof Error ? err.message : String(err)
            result.errors.push({ url: detailUrl, message: msg })
            await log('error', `Failed to scrape ${detailUrl}: ${msg}`, detailUrl)
          }
        },
      )
    }

    await prisma.brandScrapeJob.update({
      where: { id: jobId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        brandsFound: result.brandsFound,
        productsFound: result.productsFound,
        pagesScraped: result.pagesScraped,
        errorCount: result.errorCount,
      },
    })

    await log('success', `Job completed: ${result.brandsFound} brands, ${result.productsFound} products`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    result.errorCount++
    result.errors.push({ url: config.baseUrl, message: msg })

    await prisma.brandScrapeJob.update({
      where: { id: jobId },
      data: {
        status: 'failed',
        completedAt: new Date(),
        errorMessage: msg,
        brandsFound: result.brandsFound,
        productsFound: result.productsFound,
        pagesScraped: result.pagesScraped,
        errorCount: result.errorCount,
      },
    })

    await log('error', `Job failed: ${msg}`)
  }

  return result
}

// ─── Helpers ──────────────────────────────────────────────────────

async function scrapeSingleUrl(
  url: string,
  config: ScrapeConfig,
  allBrands: ScrapedBrand[],
  allDetailUrls: string[],
  result: ScrapeJobResult,
  log: (level: LogLevel, message: string, url?: string) => Promise<void>,
) {
  try {
    const html = await fetchWithRetry(url, config)
    const pageResult = parseBrandListingPage(html, url, config.baseUrl)
    result.pagesScraped++

    for (const brand of pageResult.brands) {
      if (!allBrands.some((b) => b.slug === brand.slug)) {
        allBrands.push(brand)
      }
    }

    for (const detailUrl of pageResult.brandDetailUrls) {
      if (!allDetailUrls.includes(detailUrl)) {
        allDetailUrls.push(detailUrl)
      }
    }

    await log('info', `Scraped ${url}: ${pageResult.brands.length} brands`, url)
    await sleep(config.requestDelayMs)
  } catch (err) {
    result.errorCount++
    const msg = err instanceof Error ? err.message : String(err)
    result.errors.push({ url, message: msg })
    await log('error', `Failed to scrape ${url}: ${msg}`, url)
  }
}

async function upsertBrand(brand: ScrapedBrand) {
  await prisma.phiaBrand.upsert({
    where: { slug: brand.slug },
    update: {
      name: brand.name,
      logoUrl: brand.logoUrl,
      category: brand.category,
      sourceUrl: brand.sourceUrl,
    },
    create: {
      slug: brand.slug,
      name: brand.name,
      logoUrl: brand.logoUrl,
      description: brand.description,
      websiteUrl: brand.websiteUrl,
      category: brand.category,
      sourceUrl: brand.sourceUrl,
    },
  })
}

async function upsertProduct(brandSlug: string, product: ScrapedProduct) {
  const brand = await prisma.phiaBrand.findUnique({ where: { slug: brandSlug } })
  if (!brand) return

  // Use name + productUrl as the natural key for upsert
  const existing = await prisma.phiaBrandProduct.findFirst({
    where: {
      brandId: brand.id,
      name: product.name,
      productUrl: product.productUrl ?? '',
    },
  })

  if (existing) {
    await prisma.phiaBrandProduct.update({
      where: { id: existing.id },
      data: {
        price: product.price,
        originalPrice: product.originalPrice,
        imageUrl: product.imageUrl,
        category: product.category,
        description: product.description,
        sizes: JSON.stringify(product.sizes),
        colors: JSON.stringify(product.colors),
        inStock: product.inStock,
        lastSeenAt: new Date(),
      },
    })
  } else {
    await prisma.phiaBrandProduct.create({
      data: {
        brandId: brand.id,
        externalId: product.externalId,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        currency: product.currency,
        imageUrl: product.imageUrl,
        productUrl: product.productUrl,
        category: product.category,
        description: product.description,
        sizes: JSON.stringify(product.sizes),
        colors: JSON.stringify(product.colors),
        inStock: product.inStock,
        sourceUrl: product.sourceUrl,
      },
    })
  }
}

function extractSlugFromUrl(url: string): string | null {
  const match = url.match(/\/brands\/([a-zA-Z0-9_-]+)/)
  return match ? match[1].toLowerCase() : null
}

function createLogger(jobId: string) {
  return async (level: LogLevel, message: string, url?: string) => {
    console.log(`[phia-scraper][${level}] ${message}`)
    try {
      await prisma.brandScrapeLog.create({
        data: { jobId, level, message, url },
      })
    } catch {
      // Logging should never crash the job
    }
  }
}
