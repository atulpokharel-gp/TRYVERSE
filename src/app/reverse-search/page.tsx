"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Search, ExternalLink, Shirt } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

type FilterType = "all" | "cheapest" | "closest" | "premium" | "budget";

const sourceColors: Record<string, string> = {
  Zara: "bg-black text-white",
  Amazon: "bg-orange-500 text-white",
  Gucci: "bg-amber-800 text-white",
  "H&M": "bg-red-600 text-white",
  Temu: "bg-orange-400 text-white",
  ASOS: "bg-gray-900 text-white",
  Mango: "bg-pink-600 text-white",
  "Ralph Lauren": "bg-indigo-900 text-white",
};

interface SearchResult {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  source: string;
  similarity: number;
}

export default function ReverseSearchPage() {
  const [query, setQuery] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedPhoto(URL.createObjectURL(file));
  };

  const handleSearch = async () => {
    const searchQuery = query || imageUrl || uploadedPhoto || "fashion";
    setLoading(true);
    setSearched(false);
    try {
      const res = await fetch("/api/reverse-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, imageUrl }),
      });
      const data = await res.json();
      setResults(data.results ?? []);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = [...results].sort((a, b) => {
    if (filter === "cheapest") return a.price - b.price;
    if (filter === "premium") return b.price - a.price;
    if (filter === "closest") return b.similarity - a.similarity;
    if (filter === "budget") return a.price < 100 ? -1 : 1;
    return 0;
  });

  const filterTabs: { key: FilterType; label: string }[] = [
    { key: "all", label: "All Results" },
    { key: "closest", label: "Closest Match" },
    { key: "cheapest", label: "Cheapest" },
    { key: "premium", label: "Premium" },
    { key: "budget", label: "Under $100" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-gray-900">Reverse Fashion Search</h1>
        <p className="mt-2 text-gray-500">
          Upload a photo or paste an image URL to find similar items across multiple stores.
        </p>
      </div>

      {/* Search box */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 mb-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Upload */}
          <div>
            <p className="mb-2 text-xs font-semibold text-gray-700">Upload Fashion Photo</p>
            <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors overflow-hidden">
              {uploadedPhoto ? (
                <div className="relative h-full w-full">
                  <Image src={uploadedPhoto} alt="Uploaded" fill className="object-cover" sizes="200px" />
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-300" />
                  <p className="mt-1 text-xs text-gray-400">Click to upload</p>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>

          {/* URL / text search */}
          <div className="flex flex-col gap-3">
            <div>
              <p className="mb-2 text-xs font-semibold text-gray-700">Paste Image URL</p>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/outfit.jpg"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-gray-700">Or Describe the Item</p>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='e.g. "red floral midi dress"'
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
        >
          <Search className="h-4 w-4" />
          {loading ? "Searching across stores…" : "Find Similar Items"}
        </button>
      </div>

      {/* Results */}
      {searched && (
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">{results.length} Similar Items Found</h2>
          </div>

          {/* Filter tabs */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
            {filterTabs.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                  filter === f.key
                    ? "bg-indigo-600 text-white"
                    : "border border-gray-200 text-gray-600 hover:border-indigo-300"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filteredResults.map((result) => (
              <div key={result.id} className="group flex flex-col rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                  <Image
                    src={result.imageUrl}
                    alt={result.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  {/* Source badge */}
                  <span className={cn(
                    "absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-bold",
                    sourceColors[result.source] ?? "bg-gray-800 text-white"
                  )}>
                    {result.source}
                  </span>
                  {/* Similarity */}
                  <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-gray-800">
                    {result.similarity}% match
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-indigo-600">{result.brand}</p>
                  <p className="text-xs font-bold text-gray-900 line-clamp-2">{result.name}</p>
                  <p className="mt-1 text-sm font-black text-gray-900">{formatPrice(result.price)}</p>
                  <button className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl bg-gray-900 py-2 text-xs font-bold text-white hover:bg-gray-700 transition-colors">
                    <ExternalLink className="h-3 w-3" /> Shop Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!searched && (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100">
            <Shirt className="h-10 w-10 text-indigo-400" />
          </div>
          <p className="mt-4 text-base font-semibold text-gray-600">
            Upload a photo or describe an item to find it across stores
          </p>
          <p className="mt-2 text-sm text-gray-400">
            We&apos;ll search Zara, Amazon, Gucci, H&M, ASOS, and more
          </p>
        </div>
      )}
    </div>
  );
}
