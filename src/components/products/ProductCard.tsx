"use client";

import Image from "next/image";
import { useState } from "react";
import { Star, Heart, Shirt, Search } from "lucide-react";
import type { Product } from "@/types/product";
import { cn, formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onSave?: (product: Product, category: "wishlist" | "wardrobe" | "try-later") => void;
  onTryOn?: (product: Product) => void;
  onFindSimilar?: (product: Product) => void;
  showFitBadge?: boolean;
}

export default function ProductCard({
  product,
  onSave,
  onTryOn,
  onFindSimilar,
  showFitBadge = true,
}: ProductCardProps) {
  const [saved, setSaved] = useState(false);
  const [imgError, setImgError] = useState(false);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleSave = () => {
    setSaved(true);
    onSave?.(product, "wishlist");
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
        {!imgError ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-50 to-pink-50">
            <Shirt className="h-16 w-16 text-indigo-200" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {discount && (
            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">
              -{discount}%
            </span>
          )}
          {product.tags?.includes("trending") && (
            <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white">
              Trending
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className={cn(
            "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full transition-all",
            saved
              ? "bg-rose-500 text-white"
              : "bg-white/80 text-gray-500 hover:bg-white hover:text-rose-500"
          )}
          aria-label="Save to wishlist"
        >
          <Heart className={cn("h-4 w-4", saved && "fill-current")} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          {product.brand}
        </p>
        <h3 className="mt-1 text-sm font-semibold text-gray-900 line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mt-1.5 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs text-gray-500">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Fit badge */}
        {showFitBadge && (
          <div className="mt-2 flex items-center gap-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              ✓ {product.fitEstimate}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onTryOn?.(product)}
            className="flex items-center justify-center gap-1 rounded-lg bg-indigo-600 px-2 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            <Shirt className="h-3 w-3" />
            Try On
          </button>
          <button
            onClick={handleSave}
            className={cn(
              "flex items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors",
              saved
                ? "border-rose-200 bg-rose-50 text-rose-600"
                : "border-gray-200 text-gray-700 hover:border-indigo-200 hover:text-indigo-600"
            )}
          >
            <Heart className="h-3 w-3" />
            Save
          </button>
          <button
            onClick={() => onFindSimilar?.(product)}
            className="flex items-center justify-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-semibold text-gray-700 hover:border-indigo-200 hover:text-indigo-600 transition-colors"
          >
            <Search className="h-3 w-3" />
            Similar
          </button>
        </div>
      </div>
    </div>
  );
}
