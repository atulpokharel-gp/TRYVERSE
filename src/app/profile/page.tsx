"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Save, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const styleOptions = ["Casual", "Formal", "Streetwear", "Bohemian", "Minimalist", "Sporty", "Vintage", "Luxury"];
const bodyTypes = ["Hourglass", "Pear", "Apple", "Rectangle", "Inverted Triangle"];
const brandOptions = ["Zara", "H&M", "Mango", "ASOS", "Ralph Lauren", "Gucci", "Uniqlo", "Nike", "Adidas"];
const occasionOptions = ["Work", "Casual", "Date Night", "Party", "Formal Event", "Sports", "Beach", "Travel"];

export default function ProfilePage() {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: session?.user?.name ?? "",
    email: session?.user?.email ?? "",
    gender: "prefer-not-to-say",
    styles: [] as string[],
    bodyType: "",
    budgetMin: "50",
    budgetMax: "300",
    brands: [] as string[],
    occasions: [] as string[],
  });

  const toggle = (field: "styles" | "brands" | "occasions", value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save preferences to user profile in database
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">My Profile</h1>
        <p className="mt-1 text-gray-500">Personalise TryVerse to fit your style.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic info */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-base font-bold text-gray-900">Basic Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-gray-50 text-gray-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Gender</label>
            <div className="flex flex-wrap gap-2">
              {["female", "male", "non-binary", "prefer-not-to-say"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, gender: g }))}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors",
                    form.gender === g
                      ? "bg-indigo-600 text-white"
                      : "border border-gray-200 text-gray-600 hover:border-indigo-300"
                  )}
                >
                  {g.replace(/-/g, " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Style preferences */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-base font-bold text-gray-900">Style Preferences</h2>
          <div className="flex flex-wrap gap-2">
            {styleOptions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggle("styles", s)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                  form.styles.includes(s)
                    ? "bg-pink-600 text-white"
                    : "border border-gray-200 text-gray-600 hover:border-pink-300"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Body type */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-base font-bold text-gray-900">Body Type</h2>
          <div className="grid grid-cols-5 gap-2">
            {bodyTypes.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setForm((p) => ({ ...p, bodyType: b }))}
                className={cn(
                  "rounded-xl py-3 text-xs font-semibold transition-all text-center",
                  form.bodyType === b
                    ? "bg-indigo-600 text-white shadow-md scale-95"
                    : "border border-gray-200 text-gray-600 hover:border-indigo-200"
                )}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-base font-bold text-gray-900">Budget Range (USD)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Min Budget</label>
              <input
                type="number"
                value={form.budgetMin}
                onChange={(e) => setForm((p) => ({ ...p, budgetMin: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Max Budget</label>
              <input
                type="number"
                value={form.budgetMax}
                onChange={(e) => setForm((p) => ({ ...p, budgetMax: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Favorite brands */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-base font-bold text-gray-900">Favourite Brands</h2>
          <div className="flex flex-wrap gap-2">
            {brandOptions.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => toggle("brands", b)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                  form.brands.includes(b)
                    ? "bg-amber-500 text-white"
                    : "border border-gray-200 text-gray-600 hover:border-amber-300"
                )}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Occasions */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-base font-bold text-gray-900">Occasion Preferences</h2>
          <div className="flex flex-wrap gap-2">
            {occasionOptions.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => toggle("occasions", o)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                  form.occasions.includes(o)
                    ? "bg-emerald-600 text-white"
                    : "border border-gray-200 text-gray-600 hover:border-emerald-300"
                )}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <button
          type="submit"
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition-all",
            saved
              ? "bg-emerald-600"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
          )}
        >
          {saved ? (
            <>
              <CheckCircle className="h-5 w-5" /> Preferences Saved!
            </>
          ) : (
            <>
              <Save className="h-5 w-5" /> Save Preferences
            </>
          )}
        </button>
      </form>
    </div>
  );
}
