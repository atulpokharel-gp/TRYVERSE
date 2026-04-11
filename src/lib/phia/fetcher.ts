/**
 * Rate-limiter and fetch utilities for the Phia scraper.
 * Enforces polite crawling with configurable delays and retries.
 */

import type { ScrapeConfig } from './types'

/** Sleep for the specified number of milliseconds. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Fetch a URL with retry logic, timeout, and configurable user-agent.
 * Returns the response body as a string or throws on permanent failure.
 */
export async function fetchWithRetry(
  url: string,
  config: ScrapeConfig,
): Promise<string> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), config.timeoutMs)

      const response = await fetch(url, {
        headers: {
          'User-Agent': config.userAgent,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        signal: controller.signal,
        redirect: 'follow',
      })

      clearTimeout(timer)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.text()
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (attempt < config.maxRetries) {
        // Exponential backoff: 2s, 4s, 8s ...
        await sleep(2000 * Math.pow(2, attempt - 1))
      }
    }
  }

  throw lastError ?? new Error(`Failed to fetch ${url}`)
}

/**
 * Simple concurrency-limited task runner.
 * Executes tasks in batches of `concurrency`, with a delay between batches.
 */
export async function runWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  delayMs: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency)
    const batchResults = await Promise.allSettled(batch.map(fn))

    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value)
      }
      // Rejections are swallowed here; callers should handle errors within fn
    }

    // Polite delay between batches
    if (i + concurrency < items.length) {
      await sleep(delayMs)
    }
  }

  return results
}
