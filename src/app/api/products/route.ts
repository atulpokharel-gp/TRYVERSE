import { NextRequest, NextResponse } from "next/server";
import { mockProducts } from "@/data/products";
import type { FilterOptions } from "@/types/product";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const filters: FilterOptions = {
    category: searchParams.get("category") as FilterOptions["category"] ?? undefined,
    minPrice: searchParams.has("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.has("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    occasion: searchParams.get("occasion") as FilterOptions["occasion"] ?? undefined,
    weather: searchParams.get("weather") as FilterOptions["weather"] ?? undefined,
    bodyShape: searchParams.get("bodyShape") as FilterOptions["bodyShape"] ?? undefined,
    size: searchParams.get("size") ?? undefined,
  };

  let results = [...mockProducts];

  if (filters.category) {
    results = results.filter((p) => p.category === filters.category);
  }
  if (filters.minPrice !== undefined) {
    results = results.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.occasion) {
    results = results.filter((p) => p.occasions.includes(filters.occasion!));
  }
  if (filters.weather) {
    results = results.filter((p) => p.weatherSuitability.includes(filters.weather!));
  }
  if (filters.bodyShape) {
    results = results.filter((p) => p.bodyShapes.includes(filters.bodyShape!));
  }
  if (filters.size) {
    results = results.filter((p) => p.sizes.includes(filters.size!));
  }

  return NextResponse.json({ products: results, total: results.length });
}
