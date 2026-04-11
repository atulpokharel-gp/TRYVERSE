'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Activity, Clock, CheckCircle, AlertCircle, RefreshCw, TrendingUp, Tag, Star, Package, Globe } from 'lucide-react'

const jobs = [
  {
    id: 'trend-refresh',
    name: 'Trend Refresh',
    icon: TrendingUp,
    schedule: '2:00 AM nightly',
    description: 'Fetches latest trending items from partner APIs, recalculates trending scores.',
    status: 'completed',
    lastRun: '2 hours ago',
    duration: '1m 23s',
    itemsProcessed: 4820,
  },
  {
    id: 'price-updates',
    name: 'Price Updates',
    icon: Tag,
    schedule: '3:00 AM nightly',
    description: 'Syncs current prices and discount data from all connected brand sources.',
    status: 'completed',
    lastRun: '1 hour ago',
    duration: '4m 51s',
    itemsProcessed: 12340,
  },
  {
    id: 'recommendation-updates',
    name: 'Recommendation Updates',
    icon: Star,
    schedule: '4:00 AM nightly',
    description: 'Re-runs personalisation model for all active users based on recent activity.',
    status: 'running',
    lastRun: 'In progress',
    duration: '—',
    itemsProcessed: 3201,
  },
  {
    id: 'restock-alerts',
    name: 'Restock Alerts',
    icon: Package,
    schedule: '5:00 AM nightly',
    description: 'Checks wishlist items for stock changes and sends restock notifications.',
    status: 'pending',
    lastRun: 'Scheduled',
    duration: '—',
    itemsProcessed: 0,
  },
]

const recentLogs = [
  { time: '04:02:13', job: 'Recommendation Updates', level: 'info', message: 'Processing user batch 32/58...' },
  { time: '03:59:41', job: 'Price Updates', level: 'success', message: 'Completed. 12,340 prices synced, 847 discounts added.' },
  { time: '03:01:08', job: 'Price Updates', level: 'warning', message: 'Brand API rate limit hit. Retrying in 30s...' },
  { time: '03:00:00', job: 'Price Updates', level: 'info', message: 'Job started. Target: 12,400 products.' },
  { time: '02:24:07', job: 'Trend Refresh', level: 'success', message: 'Completed. 4,820 items updated, 23 new trends detected.' },
  { time: '02:00:00', job: 'Trend Refresh', level: 'info', message: 'Job started. Querying partner trend APIs...' },
]

const statusColors: Record<string, string> = {
  completed: 'text-emerald-400',
  running: 'text-[#C9A84C]',
  pending: 'text-white/40',
  failed: 'text-red-400',
}

const logColors: Record<string, string> = {
  info: 'text-blue-400',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  error: 'text-red-400',
}

export default function AdminPage() {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise((r) => setTimeout(r, 1000))
    setRefreshing(false)
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#F5F0E8]">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2 text-[#C9A84C]">
            <Sparkles className="w-5 h-5" />
            <span className="font-serif text-lg">TryVerse</span>
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-white/60 text-sm">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/scraping"
            className="flex items-center gap-2 text-sm text-[#F5F0E8]/60 hover:text-[#F5F0E8] transition-colors"
          >
            <Globe className="w-4 h-4" />
            Web Scraping
          </Link>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 text-sm text-[#F5F0E8]/60 hover:text-[#F5F0E8] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {/* Quick Links */}
        <div className="flex gap-3">
          <Link
            href="/admin/brands"
            className="flex items-center gap-2 px-4 py-2.5 text-sm bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl text-[#C9A84C] hover:bg-[#C9A84C]/20 transition-colors"
          >
            <Globe className="w-4 h-4" />
            Phia Brand Collection
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-serif mb-1">Background Jobs</h1>
          <p className="text-[#F5F0E8]/50 text-sm">Architecture overview and nightly operation status.</p>
        </div>

        {/* Architecture Diagram */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#C9A84C]" /> Architecture Overview
          </h2>
          <pre className="text-xs text-[#F5F0E8]/70 font-mono leading-relaxed overflow-x-auto">
{`
  ┌─────────────────────────────────────────────────────────────┐
  │                     TRYVERSE SCHEDULER                       │
  │                  (Node-cron / Vercel Cron)                   │
  └──────────┬──────────────┬──────────────┬────────────────────┘
             │              │              │              │
          02:00           03:00          04:00          05:00
             │              │              │              │
    ┌────────▼────────┐  ┌──▼───────────┐ ┌▼──────────┐ ┌▼────────────┐
    │  Trend Refresh  │  │ Price Updates│ │ Reco Eng. │ │Restock Alert│
    │  (Trend API)    │  │ (Brand APIs) │ │ (ML Model)│ │ (Wishlist)  │
    └────────┬────────┘  └──┬───────────┘ └┬──────────┘ └┬────────────┘
             │              │              │              │
             └──────────────┴──────────────┴──────────────┘
                                     │
                            ┌────────▼────────┐
                            │   SQLite / PG   │
                            │  (Prisma ORM)   │
                            └─────────────────┘
`}
          </pre>
        </section>

        {/* Jobs Grid */}
        <section>
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#C9A84C]" /> Nightly Operations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {jobs.map((job) => {
              const Icon = job.icon
              return (
                <div key={job.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#C9A84C]" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{job.name}</p>
                        <p className="text-xs text-[#F5F0E8]/40">{job.schedule}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium capitalize ${statusColors[job.status]}`}>
                      {job.status === 'completed' && <CheckCircle className="w-3.5 h-3.5 inline mr-1" />}
                      {job.status === 'running' && <RefreshCw className="w-3.5 h-3.5 inline mr-1 animate-spin" />}
                      {job.status === 'pending' && <Clock className="w-3.5 h-3.5 inline mr-1" />}
                      {job.status === 'failed' && <AlertCircle className="w-3.5 h-3.5 inline mr-1" />}
                      {job.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#F5F0E8]/50 leading-relaxed">{job.description}</p>
                  <div className="flex gap-4 text-xs text-[#F5F0E8]/40 border-t border-white/5 pt-3">
                    <span>Last run: <span className="text-[#F5F0E8]/70">{job.lastRun}</span></span>
                    <span>Duration: <span className="text-[#F5F0E8]/70">{job.duration}</span></span>
                    {job.itemsProcessed > 0 && (
                      <span>Items: <span className="text-[#C9A84C]">{job.itemsProcessed.toLocaleString()}</span></span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* System Status */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-5">System Status</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Database', status: 'Healthy', ok: true },
              { label: 'Job Queue', status: 'Running', ok: true },
              { label: 'Trend API', status: 'Connected', ok: true },
              { label: 'Brand APIs', status: '3 / 4 OK', ok: false },
            ].map((item) => (
              <div key={item.label} className="text-center p-4 bg-white/5 rounded-xl">
                <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-2 ${item.ok ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <p className="text-xs text-[#F5F0E8]/40 mb-0.5">{item.label}</p>
                <p className={`text-xs font-semibold ${item.ok ? 'text-emerald-400' : 'text-amber-400'}`}>{item.status}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Job Logs */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-5">Recent Logs</h2>
          <div className="space-y-1 font-mono text-xs">
            {recentLogs.map((log, i) => (
              <div key={i} className="flex gap-4 py-2 border-b border-white/5 last:border-0">
                <span className="text-[#F5F0E8]/30 shrink-0">{log.time}</span>
                <span className="text-[#C9A84C]/70 shrink-0 w-40 truncate">{log.job}</span>
                <span className={`shrink-0 uppercase w-16 ${logColors[log.level]}`}>[{log.level}]</span>
                <span className="text-[#F5F0E8]/60">{log.message}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
