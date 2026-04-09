"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Shirt, Sparkles, Download } from "lucide-react";
import { mockProducts } from "@/data/products";
import { cn } from "@/lib/utils";

export default function TryOnPage() {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const selectedProduct = mockProducts.find((p) => p.id === selectedProductId);
  const displayProducts = mockProducts.slice(0, 8);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUserPhoto(URL.createObjectURL(file));
    setShowResult(false);
  };

  const handleTryOn = () => {
    if (userPhoto && selectedProductId) {
      setShowResult(true);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 border border-amber-200">
          <Sparkles className="h-3.5 w-3.5" /> Beta Virtual Try-On
        </span>
        <h1 className="mt-4 text-3xl font-black text-gray-900">Virtual Try-On Mirror</h1>
        <p className="mt-2 text-gray-500">
          Upload your photo, select an outfit, and see how it looks on you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: Setup */}
        <div className="space-y-6">
          {/* Upload photo */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="mb-4 text-base font-bold text-gray-900">1. Upload Your Photo</h2>
            <label className="flex aspect-[3/4] max-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors overflow-hidden">
              {userPhoto ? (
                <div className="relative h-full w-full">
                  <Image src={userPhoto} alt="Your photo" fill className="object-cover" sizes="300px" />
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-400">Click to upload full-body photo</p>
                  <p className="text-xs text-gray-300">PNG, JPG up to 10MB</p>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>

          {/* Select outfit */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="mb-4 text-base font-bold text-gray-900">2. Choose an Outfit</h2>
            <div className="grid grid-cols-4 gap-2">
              {displayProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => { setSelectedProductId(product.id); setShowResult(false); }}
                  className={cn(
                    "relative aspect-[3/4] overflow-hidden rounded-xl ring-2 transition-all",
                    selectedProductId === product.id
                      ? "ring-indigo-600 scale-95"
                      : "ring-transparent hover:ring-indigo-200"
                  )}
                >
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
            {selectedProduct && (
              <div className="mt-3 rounded-xl bg-indigo-50 p-3">
                <p className="text-xs font-bold text-indigo-900">{selectedProduct.name}</p>
                <p className="text-xs text-indigo-600">{selectedProduct.brand} · ${selectedProduct.price}</p>
              </div>
            )}
          </div>

          {/* Try On button */}
          <button
            onClick={handleTryOn}
            disabled={!userPhoto || !selectedProductId}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 text-sm font-bold text-white shadow-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <Shirt className="h-5 w-5" /> Try On Now
          </button>
        </div>

        {/* Right: Result */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-base font-bold text-gray-900">3. Your Virtual Try-On</h2>

          {showResult && userPhoto && selectedProduct ? (
            <div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
                {/* User photo as base */}
                <Image
                  src={userPhoto}
                  alt="Your photo"
                  fill
                  className="object-cover"
                  sizes="400px"
                />
                {/* Outfit overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-3/4 w-2/3 opacity-75">
                    <Image
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      fill
                      className="object-contain mix-blend-multiply"
                      sizes="250px"
                    />
                  </div>
                </div>
                {/* Beta watermark */}
                <div className="absolute top-3 right-3 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">
                  BETA
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4" /> Save Look
                </button>
                <button
                  onClick={() => setShowResult(false)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Try Another
                </button>
              </div>

              <p className="mt-3 text-xs text-gray-400 text-center">
                This is a simulated try-on. AR/WebXR integration coming soon.
              </p>
            </div>
          ) : (
            <div className="flex aspect-[3/4] flex-col items-center justify-center rounded-2xl bg-gray-50 text-center">
              <Shirt className="h-16 w-16 text-gray-200" />
              <p className="mt-4 text-sm font-semibold text-gray-400">
                Upload a photo and select an outfit to see your virtual try-on
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Note */}
      <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-700">
        <strong>Beta Feature:</strong> This virtual try-on uses a simple overlay preview. Full AI-powered AR body fitting with WebXR and pose estimation is in development.
      </div>
    </div>
  );
}
