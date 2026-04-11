/**
 * HTML parser for Phia brand pages.
 *
 * Extracts brand listings from /brands and /brands/all pages,
 * and product listings from individual brand detail pages.
 *
 * The selectors are designed to degrade gracefully — if the page
 * structure changes, the parser returns empty arrays rather than
 * throwing. Each parse function also applies heuristic fallback
 * patterns when primary selectors miss.
 */

import * as cheerio from 'cheerio'
import type { AnyNode } from 'domhandler'
import type { ScrapedBrand, ScrapedProduct, PageScrapeResult } from './types'

// ─── Brand Listing Page ───────────────────────────────────────────

/**
 * Parse a Phia brand listing page (e.g. /brands, /brands/all).
 * Extracts brand cards, discovering slugs, names, logos, and links
 * to detail pages.
 */
export function parseBrandListingPage(
  html: string,
  pageUrl: string,
  baseUrl: string,
): PageScrapeResult {
  const $ = cheerio.load(html)
  const brands: ScrapedBrand[] = []
  const brandDetailUrls: string[] = []

  // Strategy 1: Look for anchor elements linking to /brands/<slug>
  $('a[href*="/brands/"]').each((_i, el) => {
    const href = $(el).attr('href') ?? ''
    const slug = extractBrandSlug(href)
    if (!slug || slug === 'all') return

    const name =
      $(el).find('h2, h3, h4, [class*="name"], [class*="title"]').first().text().trim() ||
      $(el).text().trim() ||
      slug

    const logoUrl =
      $(el).find('img').attr('src') ?? $(el).find('img').attr('data-src') ?? null

    const brand: ScrapedBrand = {
      slug,
      name: cleanText(name),
      logoUrl: resolveUrl(logoUrl, baseUrl),
      description: null,
      websiteUrl: null,
      category: $(el).closest('[data-category]').attr('data-category') ?? null,
      sourceUrl: pageUrl,
    }

    // Avoid duplicates within the same page
    if (!brands.some((b) => b.slug === slug)) {
      brands.push(brand)
      brandDetailUrls.push(resolveUrl(href, baseUrl) ?? `${baseUrl}/brands/${slug}`)
    }
  })

  // Strategy 2: Fallback — look for list items or cards with brand-like content
  if (brands.length === 0) {
    $('[class*="brand"], [class*="Brand"], li, .card').each((_i, el) => {
      const link = $(el).find('a').first()
      const href = link.attr('href') ?? ''
      const slug = extractBrandSlug(href)
      if (!slug || slug === 'all') return

      const name = link.text().trim() || $(el).text().trim().split('\n')[0]
      if (!name) return

      const logoUrl = $(el).find('img').attr('src') ?? null

      if (!brands.some((b) => b.slug === slug)) {
        brands.push({
          slug,
          name: cleanText(name),
          logoUrl: resolveUrl(logoUrl, baseUrl),
          description: null,
          websiteUrl: null,
          category: null,
          sourceUrl: pageUrl,
        })
        brandDetailUrls.push(resolveUrl(href, baseUrl) ?? `${baseUrl}/brands/${slug}`)
      }
    })
  }

  // Detect pagination / "next page" link
  const nextPageUrl = findNextPageUrl($, pageUrl, baseUrl)

  return {
    url: pageUrl,
    brands,
    products: [],
    nextPageUrl,
    brandDetailUrls,
    error: null,
  }
}

// ─── Brand Detail Page ────────────────────────────────────────────

/**
 * Parse a Phia brand detail page (e.g. /brands/nike).
 * Extracts brand metadata and any product cards.
 */
export function parseBrandDetailPage(
  html: string,
  pageUrl: string,
  baseUrl: string,
): { brand: Partial<ScrapedBrand>; products: ScrapedProduct[] } {
  const $ = cheerio.load(html)

  // Extract brand metadata
  const brand: Partial<ScrapedBrand> = {
    description:
      $('meta[name="description"]').attr('content') ??
      $('[class*="description"], [class*="bio"], [class*="about"]').first().text().trim() ??
      null,
    websiteUrl:
      $('a[rel="noopener"][href*="http"]').attr('href') ??
      $('a[class*="website"], a[class*="external"]').attr('href') ??
      null,
    logoUrl:
      $('[class*="logo"] img, [class*="brand-image"] img, header img')
        .first()
        .attr('src') ?? null,
  }

  if (brand.logoUrl) {
    brand.logoUrl = resolveUrl(brand.logoUrl, baseUrl)
  }

  // Extract products
  const products: ScrapedProduct[] = []
  const productSelectors = [
    '[class*="product"]',
    '[class*="Product"]',
    '[class*="item"]',
    '[data-product]',
    '.card',
  ]

  for (const selector of productSelectors) {
    $(selector).each((_i, el) => {
      const product = parseProductCard($, el, pageUrl, baseUrl)
      if (product && !products.some((p) => p.name === product.name && p.productUrl === product.productUrl)) {
        products.push(product)
      }
    })
    if (products.length > 0) break // Use first matching selector
  }

  return { brand, products }
}

// ─── Helpers ──────────────────────────────────────────────────────

function parseProductCard(
  $: cheerio.CheerioAPI,
  el: AnyNode,
  pageUrl: string,
  baseUrl: string,
): ScrapedProduct | null {
  const $el = $(el)

  const name =
    $el.find('[class*="name"], [class*="title"], h3, h4').first().text().trim()
  if (!name || name.length < 2) return null

  const priceText =
    $el.find('[class*="price"], [class*="Price"]').first().text().trim()
  const prices = extractPrices(priceText)

  const imageUrl =
    $el.find('img').attr('src') ?? $el.find('img').attr('data-src') ?? null

  const productUrl =
    $el.find('a').attr('href') ?? null

  return {
    externalId: $el.attr('data-product-id') ?? $el.attr('data-id') ?? null,
    name: cleanText(name),
    price: prices.current,
    originalPrice: prices.original,
    currency: 'USD',
    imageUrl: resolveUrl(imageUrl, baseUrl),
    productUrl: resolveUrl(productUrl, baseUrl),
    category: null,
    description: $el.find('[class*="desc"]').text().trim() || null,
    sizes: extractList($el.find('[class*="size"]').text()),
    colors: extractList($el.find('[class*="color"]').text()),
    inStock: !$el.text().toLowerCase().includes('out of stock'),
    sourceUrl: pageUrl,
  }
}

/** Extract a brand slug from a URL path like /brands/nike or https://phia.com/brands/nike */
function extractBrandSlug(href: string): string | null {
  const match = href.match(/\/brands\/([a-zA-Z0-9_-]+)/)
  return match ? match[1].toLowerCase() : null
}

/** Resolve a potentially-relative URL against a base. */
function resolveUrl(url: string | null | undefined, baseUrl: string): string | null {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('//')) return `https:${url}`
  if (url.startsWith('/')) return `${baseUrl}${url}`
  return `${baseUrl}/${url}`
}

/** Clean whitespace and truncate. */
function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim().slice(0, 500)
}

/** Extract current and original prices from a price string. */
function extractPrices(text: string): { current: number | null; original: number | null } {
  const numbers = text.match(/[\d,]+\.?\d*/g)?.map((n) => parseFloat(n.replace(/,/g, ''))) ?? []
  if (numbers.length === 0) return { current: null, original: null }
  if (numbers.length === 1) return { current: numbers[0], original: null }
  // When two prices are present, the smaller is assumed to be the current
  // (sale) price and the larger is the original (strikethrough) price.
  const sorted = [...numbers].sort((a, b) => a - b)
  return { current: sorted[0], original: sorted[sorted.length - 1] !== sorted[0] ? sorted[sorted.length - 1] : null }
}

/** Split a comma/space separated string into a list. */
function extractList(text: string): string[] {
  if (!text.trim()) return []
  return text.split(/[,|/]+/).map((s) => s.trim()).filter(Boolean)
}

/** Find pagination "next" link. */
function findNextPageUrl(
  $: cheerio.CheerioAPI,
  _currentUrl: string,
  baseUrl: string,
): string | null {
  const nextLink =
    $('a[rel="next"]').attr('href') ??
    $('a:contains("Next")').attr('href') ??
    $('[class*="next"] a').attr('href') ??
    $('a[aria-label="Next"]').attr('href') ??
    null

  return resolveUrl(nextLink, baseUrl)
}
