import { NextRequest, NextResponse } from "next/server";
import { mockProducts } from "@/data/products";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query: string = body.query ?? body.imageUrl ?? "";

    // Search scraped products in the database first
    const scrapedResults = await searchScrapedProducts(query);

    if (scrapedResults.length > 0) {
      // Combine DB results with mock fallback (DB results first)
      const shuffledMock = [...mockProducts].sort(() => Math.random() - 0.5).slice(0, 4);
      const mockMapped = shuffledMock.map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        imageUrl: p.imageUrl,
        source: p.source,
        similarity: Math.floor(Math.random() * 15 + 70), // 70-85%
        searchQuery: query,
      }));

      const results = [...scrapedResults, ...mockMapped];
      return NextResponse.json({ results, query });
    }

    // Fallback to mock products if no scraped data exists
    const shuffled = [...mockProducts].sort(() => Math.random() - 0.5);
    const results = shuffled.slice(0, 8).map((p) => ({
      ...p,
      similarity: Math.floor(Math.random() * 20 + 80), // 80-100%
      searchQuery: query,
    }));

    return NextResponse.json({ results, query });
  } catch {
    return NextResponse.json(
      { error: "Reverse search failed" },
      { status: 500 }
    );
  }
}

/**
 * Search scraped products by matching query against name, brand, and category.
 */
async function searchScrapedProducts(query: string) {
  // Skip generic/empty queries that wouldn't yield meaningful results
  const IGNORED_SEARCH_TERMS = ['fashion', '']
  if (!query || IGNORED_SEARCH_TERMS.includes(query.toLowerCase())) return [];

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  // Use Prisma to search — SQLite doesn't support full-text search,
  // so we use contains filters on key fields
  const products = await prisma.scrapedProduct.findMany({
    where: {
      OR: terms.flatMap((term) => [
        { name: { contains: term } },
        { brand: { contains: term } },
        { category: { contains: term } },
        { description: { contains: term } },
      ]),
    },
    take: 12,
    orderBy: { scrapedAt: "desc" },
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    price: p.price,
    imageUrl: p.imageUrl,
    source: p.brand,
    similarity: Math.floor(Math.random() * 10 + 85), // 85-95%
    searchQuery: query,
  }));
}
