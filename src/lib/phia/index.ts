/**
 * Phia brand scraper — public API.
 */

export { startScrapeJob } from './job-runner'
export type { JobType } from './job-runner'
export { DEFAULT_CONFIG, SEED_URLS } from './config'
export type {
  ScrapeConfig,
  ScrapedBrand,
  ScrapedProduct,
  ScrapeJobResult,
  PageScrapeResult,
  LogLevel,
} from './types'
