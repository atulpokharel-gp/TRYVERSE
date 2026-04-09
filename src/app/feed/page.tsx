"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import { mockProducts } from "@/data/products";
import type { Product } from "@/types/product";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["All", "dresses", "tops", "pants", "jackets", "shoes", "accessories"];
const occasions = ["All", "casual", "work", "party", "date", "formal", "sport", "beach"];
const priceRanges = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50–$100", min: 50, max: 100 },
  { label: "$100–$200", min: 100, max: 200 },
  { label: "Over $200", min: 200, max: Infinity },
];

export default function FeedPage() {
  const router = useRouter();
  const [category, setCategory] = useState("All");
  const [occasion, setOccasion] = useState("All");
  const [priceIdx, setPriceIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    const price = priceRanges[priceIdx];
    return mockProducts.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (occasion !== "All" && !p.occasions?.includes(occasion as never)) return false;
      if (p.price < price.min || p.price > price.max) return false;
      return true;
    });
  }, [category, occasion, priceIdx]);

  const handleTryOn = (product: Product) => {
    router.push(`/try-on?productId=${product.id}`);
  };

  const handleFindSimilar = (product: Product) => {
    router.push(`/reverse-search?name=${encodeURIComponent(product.name)}`);
  };

  const handleSave = async (product: Product) => {
    await fetch("/api/wardrobe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        productName: product.name,
        productBrand: product.brand,
        productImage: product.imageUrl,
        productPrice: product.price,
        category: "wishlist",
      }),
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Your Style Feed</h1>
          <p className="mt-1 text-gray-500">{filtered.length} items curated for you</p>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 md:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className={cn(
          "w-56 shrink-0 space-y-6",
          sidebarOpen ? "block" : "hidden md:block"
        )}>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">Filters</h3>
              <button onClick={() => { setCategory("All"); setOccasion("All"); setPriceIdx(0); }} className="text-xs text-indigo-600 hover:text-indigo-700">
                Clear all
              </button>
            </div>

            {/* Category */}
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Category</p>
              <div className="space-y-1">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={cn(
                      "w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors capitalize",
                      category === c ? "bg-indigo-50 font-semibold text-indigo-700" : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Occasion</p>
              <div className="space-y-1">
                {occasions.map((o) => (
                  <button
                    key={o}
                    onClick={() => setOccasion(o)}
                    className={cn(
                      "w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors capitalize",
                      occasion === o ? "bg-indigo-50 font-semibold text-indigo-700" : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Price Range</p>
              <div className="space-y-1">
                {priceRanges.map((r, i) => (
                  <button
                    key={r.label}
                    onClick={() => setPriceIdx(i)}
                    className={cn(
                      "w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors",
                      priceIdx === i ? "bg-indigo-50 font-semibold text-indigo-700" : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {/* Category pills (mobile-friendly quick filter) */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors capitalize",
                  category === c
                    ? "bg-indigo-600 text-white"
                    : "border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-5xl">🔍</p>
              <p className="mt-4 text-lg font-bold text-gray-900">No items match your filters</p>
              <button
                onClick={() => { setCategory("All"); setOccasion("All"); setPriceIdx(0); }}
                className="mt-4 flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <X className="h-4 w-4" /> Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSave={handleSave}
                  onTryOn={handleTryOn}
                  onFindSimilar={handleFindSimilar}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
