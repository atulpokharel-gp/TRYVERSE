/**
 * Type definitions for the Phia brand scraper.
 */

/** A brand discovered on the Phia brands listing page. */
export interface ScrapedBrand {
  slug: string
  name: string
  logoUrl: string | null
  description: string | null
  websiteUrl: string | null
  category: string | null
  sourceUrl: string
}

/** A product discovered on a Phia brand detail page. */
export interface ScrapedProduct {
  externalId: string | null
  name: string
  price: number | null
  originalPrice: number | null
  currency: string
  imageUrl: string | null
  productUrl: string | null
  category: string | null
  description: string | null
  sizes: string[]
  colors: string[]
  inStock: boolean
  sourceUrl: string
}

/** Configuration for the scraper. */
export interface ScrapeConfig {
  /** Base URL of the Phia website. */
  baseUrl: string
  /** Delay between requests in milliseconds to respect rate limits. */
  requestDelayMs: number
  /** Maximum number of concurrent requests. */
  maxConcurrency: number
  /** Request timeout in milliseconds. */
  timeoutMs: number
  /** User agent string for requests. */
  userAgent: string
  /** Maximum number of brand detail pages to scrape per run (0 = unlimited). */
  maxDetailPages: number
  /** Maximum number of retries per request. */
  maxRetries: number
}

/** Result of a single page scrape. */
export interface PageScrapeResult {
  url: string
  brands: ScrapedBrand[]
  products: ScrapedProduct[]
  nextPageUrl: string | null
  brandDetailUrls: string[]
  error: string | null
}

/** Summary result of an entire scrape job. */
export interface ScrapeJobResult {
  brandsFound: number
  productsFound: number
  pagesScraped: number
  errorCount: number
  errors: Array<{ url: string; message: string }>
}

export type LogLevel = 'info' | 'warn' | 'error' | 'success'
