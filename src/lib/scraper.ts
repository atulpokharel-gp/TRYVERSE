import * as cheerio from 'cheerio'
import { HttpsProxyAgent } from 'https-proxy-agent'

export interface ScrapedProductData {
  name: string
  brand: string
  category: string
  url: string
  price: number
  currency: string
  imageUrl: string
  description?: string
}

/**
 * Fetches HTML from a URL, optionally through a proxy.
 */
export async function fetchPage(url: string): Promise<string> {
  const proxyUrl = process.env.PROXY_URL

  const headers: Record<string, string> = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    Connection: 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
  }

  const fetchOptions: RequestInit & { agent?: HttpsProxyAgent<string> } = { headers }

  if (proxyUrl) {
    fetchOptions.agent = new HttpsProxyAgent(proxyUrl)
  }

  const response = await fetch(url, fetchOptions as RequestInit)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
  }

  return response.text()
}

/**
 * Generic HTML-based product extraction using common e-commerce patterns.
 * Falls back to LLM extraction if the generic parser finds nothing.
 */
export function extractProductsFromHTML(
  html: string,
  siteUrl: string,
  brand: string,
  category: string
): ScrapedProductData[] {
  const $ = cheerio.load(html)
  const products: ScrapedProductData[] = []

  // Common product card selectors across e-commerce sites
  const productSelectors = [
    '[data-testid*="product"]',
    '[class*="product-card"]',
    '[class*="product-item"]',
    '[class*="ProductCard"]',
    '[class*="product_card"]',
    '[class*="s-result-item"]',          // Amazon
    '[class*="search-card-item"]',       // Temu
    'article[class*="product"]',
    '.product-tile',
    '.product-grid-item',
    '.grid-item',
  ]

  const selector = productSelectors.join(', ')
  const elements = $(selector)

  elements.each((_index, element) => {
    const el = $(element)

    // Extract product name
    const name =
      el.find('[class*="product-name"], [class*="product-title"], [class*="ProductName"], h3, h4, [class*="title"]').first().text().trim() ||
      el.find('a[title]').attr('title') ||
      el.find('img[alt]').attr('alt') ||
      ''

    if (!name) return

    // Extract price
    const priceText =
      el.find('[class*="price"], [class*="Price"], [data-testid*="price"]').first().text().trim() ||
      ''
    const priceMatch = priceText.match(/[\d,.]+/)
    const price = priceMatch ? parseFloat(priceMatch[0].replace(/,/g, '')) : 0

    if (price <= 0) return

    // Extract currency
    const currency = priceText.includes('€') ? 'EUR' : priceText.includes('£') ? 'GBP' : 'USD'

    // Extract image URL
    let imageUrl =
      el.find('img[src]').first().attr('src') ||
      el.find('img[data-src]').first().attr('data-src') ||
      el.find('[style*="background-image"]').first().css('background-image') ||
      ''

    // Clean up background-image url()
    if (imageUrl.startsWith('url(')) {
      imageUrl = imageUrl.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '')
    }

    // Make relative URLs absolute
    if (imageUrl && !imageUrl.startsWith('http')) {
      try {
        imageUrl = new URL(imageUrl, siteUrl).href
      } catch {
        imageUrl = ''
      }
    }

    if (!imageUrl) return

    // Extract product URL
    let productUrl = el.find('a[href]').first().attr('href') || ''
    if (productUrl && !productUrl.startsWith('http')) {
      try {
        productUrl = new URL(productUrl, siteUrl).href
      } catch {
        productUrl = siteUrl
      }
    }
    if (!productUrl) productUrl = siteUrl

    products.push({
      name,
      brand,
      category,
      url: productUrl,
      price,
      currency,
      imageUrl,
    })
  })

  return products
}

/**
 * Uses an LLM API to extract structured product data from raw HTML.
 * Supports OpenAI-compatible APIs (OpenAI, Gemini, Claude via proxy, etc.)
 */
export async function extractProductsWithLLM(
  html: string,
  siteUrl: string,
  brand: string,
  category: string
): Promise<ScrapedProductData[]> {
  const apiKey = process.env.LLM_API_KEY
  const apiUrl = process.env.LLM_API_URL || 'https://api.openai.com/v1/chat/completions'
  const model = process.env.LLM_MODEL || 'gpt-4o-mini'

  if (!apiKey) {
    console.warn('No LLM_API_KEY configured — skipping LLM extraction')
    return []
  }

  // Trim HTML to avoid token limits — keep the body content only
  const $ = cheerio.load(html)
  $('script, style, nav, footer, header, iframe, noscript').remove()
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 12000)

  const prompt = `You are a product data extractor. Given the following text content scraped from the website "${siteUrl}" (brand: ${brand}, category: ${category}), extract all product listings you can find.

For each product, extract:
- name: the product name
- price: numeric price value
- currency: USD, EUR, GBP, etc.
- imageUrl: full URL of the product image (if partially visible, construct full URL from site domain)
- url: full URL to the product page
- description: brief description if available

Return a JSON array of products. If no products found, return an empty array [].
Only return valid JSON, no explanation.

Text content:
${bodyText}`

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      console.error('LLM API error:', response.status, await response.text())
      return []
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || '[]'

    // Parse JSON from LLM response (handle markdown code blocks)
    const jsonStr = content.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim()
    const parsed = JSON.parse(jsonStr)

    if (!Array.isArray(parsed)) return []

    return parsed
      .filter((p: Record<string, unknown>) => p.name && p.price)
      .map((p: Record<string, unknown>) => ({
        name: String(p.name || ''),
        brand,
        category,
        url: String(p.url || siteUrl),
        price: typeof p.price === 'number' ? p.price : parseFloat(String(p.price)) || 0,
        currency: String(p.currency || 'USD'),
        imageUrl: String(p.imageUrl || ''),
        description: p.description ? String(p.description) : undefined,
      }))
      .filter((p: ScrapedProductData) => p.price > 0)
  } catch (error) {
    console.error('LLM extraction failed:', error)
    return []
  }
}

/**
 * Main scraping pipeline for a site.
 * 1. Fetches page HTML via optional proxy
 * 2. Tries generic HTML parsing first
 * 3. Falls back to LLM extraction if generic finds < 2 products
 */
export async function scrapeSite(
  url: string,
  brand: string,
  category: string
): Promise<ScrapedProductData[]> {
  const html = await fetchPage(url)

  // Try generic HTML extraction first
  let products = extractProductsFromHTML(html, url, brand, category)

  // Fall back to LLM if generic extraction didn't find much
  if (products.length < 2) {
    const llmProducts = await extractProductsWithLLM(html, url, brand, category)
    if (llmProducts.length > products.length) {
      products = llmProducts
    }
  }

  return products
}
