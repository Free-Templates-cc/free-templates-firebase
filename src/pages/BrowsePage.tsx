import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { SEOHead } from '../components/seo/SEOHead'
import { useTemplates, filtersFromParams } from '../hooks/useTemplates'
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react'

const frameworks = ['Next.js', 'Gatsby.js', 'Nuxt.js', 'Vue.js', 'React']
const categories = [
  'Business',
  'Portfolio',
  'Landing',
  'E-Commerce',
  'Blog',
  'SaaS',
  'Agency',
  'Education',
]

/** Normalize framework name for Badge variant (e.g. 'Next.js' → 'nextjs'). */
const fwVariant = (fw: string) =>
  fw.toLowerCase().replace(/[.\s]/g, '') as 'nextjs' | 'gatsby' | 'nuxt' | 'vue' | 'react'

export function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const filters = filtersFromParams(searchParams)
  const page = Number(searchParams.get('page')) || 1

  const pageTitle = searchParams.get('search')
    ? `Search: ${searchParams.get('search')} — Templates`
    : 'Browse Templates'

  const { data, isLoading, isFetching, isError } = useTemplates({ filters, page })

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    // Reset to page 1 when filters change
    params.delete('page')
    setSearchParams(params)
  }

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams)
    if (p > 1) {
      params.set('page', String(p))
    } else {
      params.delete('page')
    }
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  const hasFilters =
    filters.search || filters.category || filters.framework || filters.priceTier !== 'all'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SEOHead
        title={pageTitle}
        description="Browse our collection of free and premium website templates. Filter by category, framework, and price tier to find the perfect template."
      />
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Templates</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {hasFilters
              ? `${data?.total ?? 0} result${(data?.total ?? 0) !== 1 ? 's' : ''} found`
              : 'Browse our collection of 1,000+ templates'}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Search bar */}
      <div className="mt-6">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Search templates..."
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Active filter tags */}
      {hasFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {filters.search && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
              Search: {filters.search}
              <button
                onClick={() => updateFilter('search', '')}
                aria-label={`Remove search filter: ${filters.search}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
              {filters.category}
              <button
                onClick={() => updateFilter('category', '')}
                aria-label={`Remove category filter: ${filters.category}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.framework && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
              {filters.framework}
              <button
                onClick={() => updateFilter('framework', '')}
                aria-label={`Remove framework filter: ${filters.framework}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.priceTier !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
              {filters.priceTier === 'free' ? 'Free' : 'Premium'}
              <button
                onClick={() => updateFilter('priceTier', 'all')}
                aria-label={`Remove price filter: ${filters.priceTier === 'free' ? 'Free' : 'Premium'}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="mt-6 flex gap-8">
        {/* Filters sidebar — desktop */}
        <aside className={`${showFilters ? 'block' : 'hidden'} sm:block w-full sm:w-56 shrink-0`}>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>

            {/* Category */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</h4>
              <div className="mt-2 space-y-1">
                <button
                  onClick={() => updateFilter('category', '')}
                  className={`block w-full text-left rounded px-2 py-1 text-sm ${!filters.category ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'}`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateFilter('category', cat)}
                    className={`block w-full text-left rounded px-2 py-1 text-sm ${filters.category === cat ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Framework */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Framework</h4>
              <div className="mt-2 space-y-1">
                <button
                  onClick={() => updateFilter('framework', '')}
                  className={`block w-full text-left rounded px-2 py-1 text-sm ${!filters.framework ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'}`}
                >
                  All
                </button>
                {frameworks.map((fw) => (
                  <button
                    key={fw}
                    onClick={() => updateFilter('framework', fw)}
                    className={`block w-full text-left rounded px-2 py-1 text-sm ${filters.framework === fw ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'}`}
                  >
                    {fw}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Tier */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Price</h4>
              <div className="mt-2 space-y-1">
                {(['all', 'free', 'premium'] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => updateFilter('priceTier', tier)}
                    className={`block w-full text-left rounded px-2 py-1 text-sm ${filters.priceTier === tier ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'}`}
                  >
                    {tier === 'all' ? 'All' : tier === 'free' ? 'Free' : 'Premium'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="mt-6">
              <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort by
              </label>
              <select
                id="sort-select"
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Template Grid */}
        <div className="flex-1">
          {isLoading ? (
            /* Loading skeleton */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <Skeleton className="mb-3 aspect-video w-full rounded-lg" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="mt-3 h-5 w-3/4" />
                  <Skeleton className="mt-2 h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : isError ? (
            /* Error state */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Something went wrong
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Couldn't load templates. Please try again later.
              </p>
            </div>
          ) : data && data.items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                No templates found
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              {hasFilters && (
                <button onClick={clearFilters} className="mt-4">
                  <Button variant="outline" size="sm">
                    Clear all filters
                  </Button>
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Loading overlay for background refetches */}
              {isFetching && (
                <div className="mb-4 flex items-center justify-center">
                  <div className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                    <div className="h-full w-1/3 animate-pulse rounded-full bg-primary-500" />
                  </div>
                </div>
              )}

              {/* Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data!.items.map((tmpl) => (
                  <Link
                    key={tmpl.id}
                    to={`/templates/${tmpl.slug}`}
                    className="group rounded-xl border border-gray-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-3 aspect-video rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" />
                    <div className="flex items-center justify-between">
                      <Badge variant={tmpl.priceTier === 'premium' ? 'premium' : 'free'}>
                        {tmpl.priceTier === 'premium' ? 'Premium' : 'Free'}
                      </Badge>
                      <Badge variant={fwVariant(tmpl.framework)}>{tmpl.framework}</Badge>
                    </div>
                    <h3 className="mt-2 font-semibold text-gray-900 dark:text-white group-hover:text-primary-600">
                      {tmpl.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {tmpl.category} · {tmpl.downloads.toLocaleString()} downloads
                    </p>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {data!.totalPages > 1 && (
                <nav
                  className="mt-10 flex items-center justify-center gap-2"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <div className="hidden items-center gap-1 sm:flex">
                    {generatePageNumbers(page, data!.totalPages).map((p, i) =>
                      p === '...' ? (
                        <span
                          key={`ellipsis-${i}`}
                          className="px-2 text-sm text-gray-400 dark:text-gray-500"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => goToPage(p as number)}
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium ${
                            p === page
                              ? 'bg-primary-600 text-white'
                              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                          }`}
                          aria-current={p === page ? 'page' : undefined}
                          aria-label={`Page ${p}`}
                        >
                          {p}
                        </button>
                      ),
                    )}
                  </div>

                  {/* Mobile: page indicator */}
                  <span className="text-sm text-gray-500 sm:hidden">
                    Page {page} of {data!.totalPages}
                  </span>

                  <button
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= data!.totalPages}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Generate a compact list of page numbers with ellipsis.
 * E.g. [1, '...', 4, 5, 6, '...', 12]
 */
function generatePageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | '...')[] = []

  if (current <= 4) {
    // Near the start: 1 2 3 4 5 ... N
    for (let i = 1; i <= 5; i++) pages.push(i)
    pages.push('...')
    pages.push(total)
  } else if (current >= total - 3) {
    // Near the end: 1 ... N-4 N-3 N-2 N-1 N
    pages.push(1)
    pages.push('...')
    for (let i = total - 4; i <= total; i++) pages.push(i)
  } else {
    // Middle: 1 ... C-1 C C+1 ... N
    pages.push(1)
    pages.push('...')
    pages.push(current - 1)
    pages.push(current)
    pages.push(current + 1)
    pages.push('...')
    pages.push(total)
  }

  return pages
}
