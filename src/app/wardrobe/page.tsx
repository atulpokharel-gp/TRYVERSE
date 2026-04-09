"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Archive, Clock, Trash2, StickyNote, X } from "lucide-react";
import type { WardrobeItem } from "@/types/user";
import { cn, formatPrice } from "@/lib/utils";

type TabType = "wardrobe" | "wishlist" | "try-later";

const tabs: { key: TabType; label: string; icon: React.ElementType; color: string }[] = [
  { key: "wardrobe", label: "My Wardrobe", icon: Archive, color: "text-emerald-600" },
  { key: "wishlist", label: "Wishlist", icon: Heart, color: "text-rose-600" },
  { key: "try-later", label: "Try Later", icon: Clock, color: "text-amber-600" },
];

export default function WardrobePage() {
  const [activeTab, setActiveTab] = useState<TabType>("wardrobe");
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteItem, setNoteItem] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/wardrobe");
      const data = await res.json();
      setItems(data.items ?? []);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id: string) => {
    await fetch(`/api/wardrobe?id=${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const filtered = items.filter((i) => i.category === activeTab);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">My Wardrobe</h1>
        <p className="mt-1 text-gray-500">{items.length} saved items</p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-2 border-b border-gray-100">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const count = items.filter((i) => i.category === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 pb-3 text-sm font-semibold transition-colors",
                activeTab === tab.key
                  ? `border-indigo-600 text-indigo-600`
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <Icon className={cn("h-4 w-4", activeTab === tab.key ? tab.color : "")} />
              {tab.label}
              <span className={cn(
                "rounded-full px-1.5 py-0.5 text-xs font-bold",
                activeTab === tab.key ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Note modal */}
      {noteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-amber-500" /> Add Note
              </h3>
              <button onClick={() => setNoteItem(null)}><X className="h-4 w-4 text-gray-400" /></button>
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={3}
              placeholder="e.g. Good for dinner, buy next month…"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setItems((prev) => prev.map((i) => i.id === noteItem ? { ...i, note: noteText } : i));
                  setNoteItem(null);
                  setNoteText("");
                }}
                className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
              >
                Save Note
              </button>
              <button onClick={() => setNoteItem(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <p className="text-5xl">👗</p>
          <p className="mt-4 text-lg font-bold text-gray-900">Nothing here yet</p>
          <p className="mt-1 text-sm text-gray-500">Save items from the feed to build your wardrobe.</p>
          <a href="/feed" className="mt-6 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
            Browse Feed
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <div key={item.id} className="group relative flex flex-col rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
              <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                {/* Remove button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-indigo-600">{item.productBrand}</p>
                <p className="text-xs font-bold text-gray-900 truncate">{item.productName}</p>
                <p className="text-xs text-gray-500">{formatPrice(item.productPrice)}</p>
                {item.note && (
                  <p className="mt-1 rounded-lg bg-amber-50 px-2 py-1 text-xs text-amber-700 truncate">
                    📝 {item.note}
                  </p>
                )}
                <button
                  onClick={() => { setNoteItem(item.id); setNoteText(item.note ?? ""); }}
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-gray-200 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <StickyNote className="h-3 w-3" />
                  {item.note ? "Edit Note" : "Add Note"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
