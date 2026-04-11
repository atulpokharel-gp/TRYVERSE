'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Globe,
  Plus,
  Trash2,
  Play,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Package,
  X,
} from 'lucide-react'

interface ScrapeSite {
  id: string
  name: string
  url: string
  brand: string
  category: string
  isActive: boolean
  createdAt: string
  _count: { scrapedProducts: number; scrapeJobs: number }
  scrapeJobs: { id: string; status: string; productsFound: number; completedAt: string | null }[]
}

const statusColors: Record<string, string> = {
  completed: 'text-emerald-400',
  running: 'text-[#C9A84C]',
  pending: 'text-white/40',
  failed: 'text-red-400',
}

export default function ScrapingAdminPage() {
  const [sites, setSites] = useState<ScrapeSite[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [scraping, setScraping] = useState<Record<string, boolean>>({})
  const [scrapingAll, setScrapingAll] = useState(false)
  const [form, setForm] = useState({ name: '', url: '', brand: '', category: 'all' })

  const fetchSites = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/sites')
      const data = await res.json()
      setSites(data.sites ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSites()
  }, [fetchSites])

  const handleAdd = async () => {
    if (!form.name || !form.url || !form.brand) return
    await fetch('/api/admin/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForm({ name: '', url: '', brand: '', category: 'all' })
    setShowAddForm(false)
    fetchSites()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/sites?id=${id}`, { method: 'DELETE' })
    fetchSites()
  }

  const handleScrape = async (siteId: string) => {
    setScraping((prev) => ({ ...prev, [siteId]: true }))
    try {
      await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId }),
      })
      fetchSites()
    } finally {
      setScraping((prev) => ({ ...prev, [siteId]: false }))
    }
  }

  const handleScrapeAll = async () => {
    setScrapingAll(true)
    try {
      await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      })
      fetchSites()
    } finally {
      setScrapingAll(false)
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await fetch('/api/admin/sites', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive: !isActive }),
    })
    fetchSites()
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#F5F0E8]">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 text-[#C9A84C]">
            <Sparkles className="w-5 h-5" />
            <span className="font-serif text-lg">TryVerse</span>
          </Link>
          <span className="text-white/20">/</span>
          <Link href="/admin" className="text-white/60 text-sm hover:text-white/80">
            Admin
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-white/60 text-sm">Web Scraping</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleScrapeAll}
            disabled={scrapingAll}
            className="flex items-center gap-2 text-sm bg-[#C9A84C]/20 border border-[#C9A84C]/30 text-[#C9A84C] rounded-xl px-4 py-2 hover:bg-[#C9A84C]/30 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${scrapingAll ? 'animate-spin' : ''}`} />
            {scrapingAll ? 'Scraping All…' : 'Scrape All Sites'}
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 text-sm bg-[#C9A84C] text-black rounded-xl px-4 py-2 hover:bg-[#C9A84C]/90 transition-colors font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Site
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-serif mb-1">Web Scraping Manager</h1>
          <p className="text-[#F5F0E8]/50 text-sm">
            Add brand websites to scrape product data. Scraping runs automatically every 3 days and
            stores brand name, categories, URL, price, and images for reverse search.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Active Sites', value: sites.filter((s) => s.isActive).length, icon: Globe },
            {
              label: 'Total Products',
              value: sites.reduce((sum, s) => sum + s._count.scrapedProducts, 0),
              icon: Package,
            },
            {
              label: 'Total Scrapes',
              value: sites.reduce((sum, s) => sum + s._count.scrapeJobs, 0),
              icon: RefreshCw,
            },
            {
              label: 'Last Run',
              value:
                sites
                  .flatMap((s) => s.scrapeJobs)
                  .sort(
                    (a, b) =>
                      new Date(b.completedAt ?? 0).getTime() -
                      new Date(a.completedAt ?? 0).getTime()
                  )[0]?.completedAt
                  ? 'Recent'
                  : 'Never',
              icon: Clock,
            },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
              >
                <Icon className="w-5 h-5 text-[#C9A84C] mx-auto mb-2" />
                <p className="text-xs text-[#F5F0E8]/40 mb-1">{stat.label}</p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Add Site Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Add Scrape Site</h2>
                <button onClick={() => setShowAddForm(false)}>
                  <X className="w-5 h-5 text-white/40 hover:text-white" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#F5F0E8]/50 mb-1 block">Site Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Gucci Handbags"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-[#C9A84C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#F5F0E8]/50 mb-1 block">URL</label>
                  <input
                    type="url"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    placeholder="https://www.gucci.com/us/en/ca/women/handbags-c-women-handbags"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-[#C9A84C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#F5F0E8]/50 mb-1 block">Brand</label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    placeholder="e.g. Gucci"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-[#C9A84C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#F5F0E8]/50 mb-1 block">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-[#C9A84C] focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="dresses">Dresses</option>
                    <option value="tops">Tops</option>
                    <option value="pants">Pants</option>
                    <option value="jackets">Jackets</option>
                    <option value="shoes">Shoes</option>
                    <option value="accessories">Accessories</option>
                    <option value="bags">Bags</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleAdd}
                disabled={!form.name || !form.url || !form.brand}
                className="w-full bg-[#C9A84C] text-black rounded-xl py-2.5 text-sm font-semibold hover:bg-[#C9A84C]/90 disabled:opacity-50 transition-colors"
              >
                Add Site
              </button>
            </div>
          </div>
        )}

        {/* Sites List */}
        <section>
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#C9A84C]" /> Configured Sites
          </h2>

          {loading ? (
            <div className="text-center py-12 text-[#F5F0E8]/40">Loading sites…</div>
          ) : sites.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="w-12 h-12 text-white/10 mx-auto mb-3" />
              <p className="text-[#F5F0E8]/40 text-sm">
                No scraping sites configured yet. Click &quot;Add Site&quot; to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sites.map((site) => {
                const lastJob = site.scrapeJobs[0]
                const isScraping = scraping[site.id]
                return (
                  <div
                    key={site.id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm truncate">{site.name}</p>
                        <span className="text-xs bg-[#C9A84C]/20 text-[#C9A84C] rounded-full px-2 py-0.5">
                          {site.brand}
                        </span>
                        <span className="text-xs bg-white/5 text-[#F5F0E8]/40 rounded-full px-2 py-0.5">
                          {site.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#F5F0E8]/30 truncate">{site.url}</p>
                      <div className="flex gap-4 mt-2 text-xs text-[#F5F0E8]/40">
                        <span>
                          Products:{' '}
                          <span className="text-[#C9A84C]">{site._count.scrapedProducts}</span>
                        </span>
                        <span>
                          Scrapes: <span className="text-[#F5F0E8]/60">{site._count.scrapeJobs}</span>
                        </span>
                        {lastJob && (
                          <span className="flex items-center gap-1">
                            Last:{' '}
                            <span className={statusColors[lastJob.status] ?? 'text-white/40'}>
                              {lastJob.status === 'completed' && (
                                <CheckCircle className="w-3 h-3 inline mr-0.5" />
                              )}
                              {lastJob.status === 'failed' && (
                                <AlertCircle className="w-3 h-3 inline mr-0.5" />
                              )}
                              {lastJob.status} ({lastJob.productsFound} items)
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleActive(site.id, site.isActive)}
                        className={`text-xs rounded-full px-3 py-1 border transition-colors ${
                          site.isActive
                            ? 'border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10'
                            : 'border-white/10 text-white/30 hover:bg-white/5'
                        }`}
                      >
                        {site.isActive ? 'Active' : 'Paused'}
                      </button>
                      <button
                        onClick={() => handleScrape(site.id)}
                        disabled={isScraping}
                        className="flex items-center gap-1 text-xs bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 hover:bg-white/10 disabled:opacity-50 transition-colors"
                      >
                        {isScraping ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Play className="w-3 h-3" />
                        )}
                        {isScraping ? 'Scraping…' : 'Scrape'}
                      </button>
                      <button
                        onClick={() => handleDelete(site.id)}
                        className="text-red-400/60 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-400/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Schedule Info */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-3">Automated Schedule</h2>
          <p className="text-sm text-[#F5F0E8]/50">
            All active sites are automatically scraped every <strong className="text-[#C9A84C]">3 days</strong> via the
            cron endpoint <code className="text-xs bg-white/5 rounded px-1.5 py-0.5">/api/cron/scrape</code>.
          </p>
          <p className="text-sm text-[#F5F0E8]/50 mt-2">
            Scraped data (brand name, categories, URL, price, images) is stored in the database and used to
            power the reverse fashion search feature.
          </p>
          <div className="mt-4 p-4 bg-white/5 rounded-xl">
            <p className="text-xs text-[#F5F0E8]/30 font-mono">
              Environment variables needed:
            </p>
            <ul className="text-xs text-[#F5F0E8]/50 font-mono mt-2 space-y-1">
              <li>PROXY_URL — optional HTTP proxy for scraping</li>
              <li>LLM_API_KEY — API key for LLM-powered extraction (OpenAI, Gemini, etc.)</li>
              <li>LLM_API_URL — LLM endpoint URL (defaults to OpenAI)</li>
              <li>LLM_MODEL — model name (defaults to gpt-4o-mini)</li>
              <li>CRON_SECRET — secret to protect the cron endpoint</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
