'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Search,
  Play,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Globe,
  Package,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'

interface Brand {
  id: string
  slug: string
  name: string
  logoUrl: string | null
  description: string | null
  websiteUrl: string | null
  category: string | null
  productCount: number
  sourceUrl: string
  firstSeenAt: string
  lastScrapedAt: string | null
  _count?: { products: number }
}

interface ScrapeJob {
  id: string
  status: string
  jobType: string
  brandsFound: number
  productsFound: number
  pagesScraped: number
  errorCount: number
  errorMessage: string | null
  startedAt: string | null
  completedAt: string | null
  createdAt: string
  _count?: { logs: number }
}

const statusColors: Record<string, string> = {
  completed: 'text-emerald-400',
  running: 'text-[#C9A84C]',
  pending: 'text-white/40',
  failed: 'text-red-400',
}

const statusIcons: Record<string, typeof CheckCircle> = {
  completed: CheckCircle,
  running: RefreshCw,
  pending: Clock,
  failed: AlertCircle,
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [jobs, setJobs] = useState<ScrapeJob[]>([])
  const [totalBrands, setTotalBrands] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [scraping, setScraping] = useState(false)
  const [activeTab, setActiveTab] = useState<'brands' | 'jobs'>('brands')

  const fetchBrands = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (search) params.set('q', search)

      const res = await fetch(`/api/brands?${params}`)
      const json = await res.json()
      setBrands(json.data ?? [])
      setTotalBrands(json.pagination?.total ?? 0)
      setTotalPages(json.pagination?.totalPages ?? 1)
    } catch (err) {
      console.error('Failed to fetch brands:', err)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch('/api/brands/scrape')
      const json = await res.json()
      setJobs(json.data ?? [])
    } catch (err) {
      console.error('Failed to fetch jobs:', err)
    }
  }, [])

  useEffect(() => {
    fetchBrands()
    fetchJobs()
  }, [fetchBrands, fetchJobs])

  const handleStartScrape = async (jobType: string) => {
    setScraping(true)
    try {
      const res = await fetch('/api/brands/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobType }),
      })
      const json = await res.json()
      if (json.jobId) {
        await fetchJobs()
      }
    } catch (err) {
      console.error('Failed to start scrape:', err)
    } finally {
      setScraping(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchBrands()
  }

  const isJobRunning = jobs.some((j) => j.status === 'running')

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
          <Link href="/admin" className="text-white/60 text-sm hover:text-white/80 transition-colors">
            Admin
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-white/60 text-sm">Brands</span>
        </div>
        <button
          onClick={() => { fetchBrands(); fetchJobs() }}
          className="flex items-center gap-2 text-sm text-[#F5F0E8]/60 hover:text-[#F5F0E8] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-serif mb-1">Phia Brand Collection</h1>
            <p className="text-[#F5F0E8]/50 text-sm">
              Incrementally collects brand data from Phia&apos;s public brand surface.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleStartScrape('incremental')}
              disabled={scraping || isJobRunning}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl text-[#C9A84C] hover:bg-[#C9A84C]/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              Incremental Scrape
            </button>
            <button
              onClick={() => handleStartScrape('full')}
              disabled={scraping || isJobRunning}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-[#F5F0E8]/70 hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Globe className="w-4 h-4" />
              Full Scrape
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Brands', value: totalBrands.toLocaleString(), icon: Globe },
            { label: 'Total Jobs', value: jobs.length.toString(), icon: Package },
            {
              label: 'Last Scrape',
              value: jobs[0]?.completedAt
                ? new Date(jobs[0].completedAt).toLocaleDateString()
                : 'Never',
              icon: Clock,
            },
            {
              label: 'Status',
              value: isJobRunning ? 'Running' : 'Idle',
              icon: isJobRunning ? RefreshCw : CheckCircle,
            },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <Icon className={`w-5 h-5 mx-auto mb-2 ${isJobRunning && stat.label === 'Status' ? 'animate-spin text-[#C9A84C]' : 'text-[#C9A84C]/60'}`} />
                <p className="text-xs text-[#F5F0E8]/40 mb-1">{stat.label}</p>
                <p className="text-lg font-semibold">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit">
          {(['brands', 'jobs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm rounded-lg capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-[#C9A84C]/20 text-[#C9A84C]'
                  : 'text-[#F5F0E8]/50 hover:text-[#F5F0E8]/70'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Brands Tab */}
        {activeTab === 'brands' && (
          <section className="space-y-6">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F0E8]/30" />
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-[#F5F0E8] placeholder:text-[#F5F0E8]/30 focus:outline-none focus:border-[#C9A84C]/40"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-[#F5F0E8]/70 hover:bg-white/10 transition-colors"
              >
                Search
              </button>
            </form>

            {/* Brand List */}
            {loading ? (
              <div className="text-center py-20 text-[#F5F0E8]/30">
                <RefreshCw className="w-6 h-6 mx-auto mb-3 animate-spin" />
                Loading brands...
              </div>
            ) : brands.length === 0 ? (
              <div className="text-center py-20 text-[#F5F0E8]/30">
                <Globe className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No brands collected yet.</p>
                <p className="text-xs mt-1">Start a scrape job to begin collecting brand data.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {brands.map((brand) => (
                    <div
                      key={brand.id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 hover:border-[#C9A84C]/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {brand.logoUrl ? (
                          <div className="w-10 h-10 rounded-xl bg-white/10 overflow-hidden flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center">
                            <span className="text-[#C9A84C] text-sm font-bold">
                              {brand.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{brand.name}</p>
                          <p className="text-xs text-[#F5F0E8]/40">/{brand.slug}</p>
                        </div>
                        {brand.websiteUrl && (
                          <a
                            href={brand.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#F5F0E8]/30 hover:text-[#C9A84C] transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      {brand.description && (
                        <p className="text-xs text-[#F5F0E8]/50 line-clamp-2 leading-relaxed">
                          {brand.description}
                        </p>
                      )}

                      <div className="flex gap-4 text-xs text-[#F5F0E8]/40 border-t border-white/5 pt-3">
                        <span>
                          Products: <span className="text-[#C9A84C]">{brand._count?.products ?? brand.productCount}</span>
                        </span>
                        {brand.category && (
                          <span className="text-[#F5F0E8]/30">{brand.category}</span>
                        )}
                        <span className="ml-auto">
                          {brand.lastScrapedAt
                            ? new Date(brand.lastScrapedAt).toLocaleDateString()
                            : 'Not scraped'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-[#F5F0E8]/50">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <section className="space-y-4">
            {jobs.length === 0 ? (
              <div className="text-center py-20 text-[#F5F0E8]/30">
                <Package className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No scrape jobs yet.</p>
              </div>
            ) : (
              jobs.map((job) => {
                const StatusIcon = statusIcons[job.status] ?? Clock
                return (
                  <div
                    key={job.id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                          <StatusIcon
                            className={`w-5 h-5 ${statusColors[job.status]} ${
                              job.status === 'running' ? 'animate-spin' : ''
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-sm capitalize">{job.jobType} Scrape</p>
                          <p className="text-xs text-[#F5F0E8]/40">
                            {new Date(job.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium capitalize ${statusColors[job.status]}`}>
                        {job.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-[#F5F0E8]/40 mb-1">Brands Found</p>
                        <p className="text-[#C9A84C] font-semibold">{job.brandsFound}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-[#F5F0E8]/40 mb-1">Products Found</p>
                        <p className="text-[#C9A84C] font-semibold">{job.productsFound}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-[#F5F0E8]/40 mb-1">Pages Scraped</p>
                        <p className="font-semibold">{job.pagesScraped}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-[#F5F0E8]/40 mb-1">Errors</p>
                        <p className={`font-semibold ${job.errorCount > 0 ? 'text-red-400' : ''}`}>
                          {job.errorCount}
                        </p>
                      </div>
                    </div>

                    {job.errorMessage && (
                      <div className="text-xs text-red-400/70 bg-red-400/5 border border-red-400/10 rounded-lg p-3">
                        {job.errorMessage}
                      </div>
                    )}

                    <div className="flex gap-4 text-xs text-[#F5F0E8]/30 border-t border-white/5 pt-3">
                      {job.startedAt && (
                        <span>Started: {new Date(job.startedAt).toLocaleTimeString()}</span>
                      )}
                      {job.completedAt && (
                        <span>Completed: {new Date(job.completedAt).toLocaleTimeString()}</span>
                      )}
                      <span>ID: {job.id.slice(0, 8)}…</span>
                    </div>
                  </div>
                )
              })
            )}
          </section>
        )}
      </div>
    </div>
  )
}
