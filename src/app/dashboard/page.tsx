"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Scan, MessageSquare, Archive, Search, Cloud, TrendingUp, Bell, RefreshCw } from "lucide-react";
import BodyAvatar from "@/components/body/BodyAvatar";

const quickActions = [
  { href: "/body-scan", label: "Scan Body", icon: Scan, color: "bg-violet-600" },
  { href: "/stylist", label: "Ask Stylist", icon: MessageSquare, color: "bg-pink-600" },
  { href: "/wardrobe", label: "My Wardrobe", icon: Archive, color: "bg-emerald-600" },
  { href: "/reverse-search", label: "Find Similar", icon: Search, color: "bg-amber-600" },
];

const trendingLooks = [
  { id: "t1", name: "Coastal Grandma", imageUrl: "https://picsum.photos/seed/trend1/300/400" },
  { id: "t2", name: "Quiet Luxury", imageUrl: "https://picsum.photos/seed/trend2/300/400" },
  { id: "t3", name: "Dark Academia", imageUrl: "https://picsum.photos/seed/trend3/300/400" },
  { id: "t4", name: "Y2K Revival", imageUrl: "https://picsum.photos/seed/trend4/300/400" },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const name = session?.user?.name ?? "there";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Background intelligence banner */}
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 px-5 py-3">
        <RefreshCw className="h-4 w-4 text-indigo-600 shrink-0" />
        <p className="text-sm text-indigo-700">
          <strong>Overnight update:</strong> Your feed was refreshed • 3 better deals found • 2 items back in stock
        </p>
        <Bell className="ml-auto h-4 w-4 text-indigo-400 shrink-0" />
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">
          Good morning, {name.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-gray-500">Here&apos;s your personalised fashion dashboard.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Quick actions */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all hover:bg-gray-50 hover:scale-105"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* AI stylist recommendations */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">AI Stylist Picks for You</h2>
              <Link href="/stylist" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                Open Chat →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { seed: "rec1", name: "Office Power Look", desc: "Tailored blazer + pleated trousers", price: "$228" },
                { seed: "rec2", name: "Weekend Casual", desc: "Linen shirt + wide-leg pants", price: "$124" },
                { seed: "rec3", name: "Evening Glam", desc: "Silk slip dress + strappy sandals", price: "$224" },
              ].map((rec) => (
                <div key={rec.seed} className="rounded-xl overflow-hidden ring-1 ring-gray-100 hover:shadow-md transition-shadow">
                  <div className="relative h-40 bg-gray-100">
                    <Image src={`https://picsum.photos/seed/${rec.seed}/300/200`} alt={rec.name} fill className="object-cover" sizes="200px" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold text-gray-900">{rec.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{rec.desc}</p>
                    <p className="text-xs font-semibold text-indigo-600 mt-1">{rec.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending looks */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <TrendingUp className="h-5 w-5 text-pink-600" /> Trending Now
              </h2>
              <Link href="/feed" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                Shop Feed →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {trendingLooks.map((look) => (
                <div key={look.id} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
                    <Image src={look.imageUrl} alt={look.name} fill className="object-cover transition-transform group-hover:scale-105" sizes="150px" />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-gray-700 text-center">{look.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Weather widget */}
          <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-6 text-white shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-75">Today&apos;s Weather</p>
                <p className="mt-1 text-3xl font-black">68°F</p>
                <p className="text-sm opacity-90">Partly Cloudy · New York</p>
              </div>
              <span className="text-5xl">⛅</span>
            </div>
            <div className="mt-4 rounded-xl bg-white/20 p-3">
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                <p className="text-xs font-medium">Spring vibes — try florals and a trench coat today!</p>
              </div>
            </div>
          </div>

          {/* Body profile */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Body Profile</h2>
              <Link href="/body-scan" className="text-xs font-semibold text-indigo-600">Update →</Link>
            </div>
            <div className="flex items-center gap-4">
              <BodyAvatar shape="hourglass" size="sm" />
              <div>
                <p className="text-sm font-bold text-gray-900">Hourglass</p>
                <p className="text-xs text-gray-500 mt-0.5">Size: M · Top: M · Bottom: 28</p>
                <div className="mt-2 space-y-1">
                  {["Wrap dresses ✓", "High-waisted ✓", "Fitted blazers ✓"].map((t) => (
                    <p key={t} className="text-xs text-emerald-600">{t}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Saved wardrobe preview */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">My Wardrobe</h2>
              <Link href="/wardrobe" className="text-xs font-semibold text-indigo-600">View All →</Link>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { seed: "blazer10", name: "Tailored Blazer" },
                { seed: "dress1", name: "Wrap Dress" },
                { seed: "knit9", name: "Knit Sweater" },
              ].map((item) => (
                <div key={item.seed} className="group cursor-pointer">
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                    <Image src={`https://picsum.photos/seed/${item.seed}/200/200`} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform" sizes="80px" />
                  </div>
                  <p className="mt-1 text-xs text-gray-600 text-center truncate">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
