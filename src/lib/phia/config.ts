import type { ScrapeConfig } from './types'

/**
 * Default scraper configuration.
 * Rate-limits and concurrency are intentionally conservative
 * to be a respectful crawler.
 */
export const DEFAULT_CONFIG: ScrapeConfig = {
  baseUrl: 'https://phia.com',
  requestDelayMs: 1500,
  maxConcurrency: 2,
  timeoutMs: 30_000,
  userAgent:
    'TryVerse-BrandCollector/1.0 (+https://github.com/atulpokharel-gp/TRYVERSE)',
  maxDetailPages: 50,
  maxRetries: 3,
}

/** Well-known Phia brand listing URLs to seed the crawl. */
export const SEED_URLS = [
  '/brands',
  '/brands/all',
] as const
