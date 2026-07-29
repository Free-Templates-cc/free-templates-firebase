import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Search, SlidersHorizontal, X } from 'lucide-react'

const frameworks = ['Next.js', 'Gatsby.js', 'Nuxt.js', 'Vue.js', 'React']
const categories = ['Business', 'Portfolio', 'Landing', 'E-Commerce', 'Blog', 'SaaS', 'Agency', 'Education']

export function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const framework = searchParams.get('framework') || ''
  const priceTier = searchParams.get('priceTier') || 'all'
  const sort = searchParams.get('sort') || 'newest'

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    setSearchParams(params)
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  const hasFilters = search || category || framework || priceTier !== 'all'

  // Placeholder until Firebase integration
  const mockTemplates = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    name: ['Portfolio Pro', 'Business Plus', 'EduLearn', 'ConstructPro', 'StartupKit', 'DevPortfolio', 'AgencyX', 'ShopNow', 'BlogMind', 'AppLaunch', 'CreativePro', 'TechLand'][i],
    category: categories[i % categories.length],
    framework: frameworks[i % frameworks.length],
    priceTier: (i % 3 === 0 ? 'premium' : 'free') as 'free' | 'premium',
    downloads: Math.floor(Math.random() * 5000),
  }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Templates</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {hasFilters ? 'Showing filtered results' : 'Browse our collection of 1,000+ templates'}
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
            value={search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Search templates..."
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Active filters tags */}
      {hasFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {search && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
              Search: {search}
              <button onClick={() => updateFilter('search', '')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {category && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
              {category}
              <button onClick={() => updateFilter('category', '')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {framework && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
              {framework}
              <button onClick={() => updateFilter('framework', '')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {priceTier !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
              {priceTier === 'free' ? 'Free' : 'Premium'}
              <button onClick={() => updateFilter('priceTier', 'all')}><X className="h-3 w-3" /></button>
            </span>
          )}
          <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
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
                <button onClick={() => updateFilter('category', '')} className={`block w-full text-left rounded px-2 py-1 text-sm ${!category ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'}`}>
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateFilter('category', cat)}
                    className={`block w-full text-left rounded px-2 py-1 text-sm ${category === cat ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'}`}
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
                <button onClick={() => updateFilter('framework', '')} className={`block w-full text-left rounded px-2 py-1 text-sm ${!framework ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'}`}>
                  All
                </button>
                {frameworks.map((fw) => (
                  <button
                    key={fw}
                    onClick={() => updateFilter('framework', fw)}
                    className={`block w-full text-left rounded px-2 py-1 text-sm ${framework === fw ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'}`}
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
                    className={`block w-full text-left rounded px-2 py-1 text-sm ${priceTier === tier ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'}`}
                  >
                    {tier === 'all' ? 'All' : tier === 'free' ? 'Free' : 'Premium'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by</h4>
              <select
                value={sort}
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockTemplates.map((tmpl) => (
              <Link
                key={tmpl.id}
                to={`/templates/${tmpl.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group rounded-xl border border-gray-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-3 aspect-video rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" />
                <div className="flex items-center justify-between">
                  <Badge variant={tmpl.priceTier === 'premium' ? 'premium' : 'free'}>
                    {tmpl.priceTier === 'premium' ? 'Premium' : 'Free'}
                  </Badge>
                  <Badge variant={tmpl.framework.toLowerCase() as any}>{tmpl.framework}</Badge>
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
        </div>
      </div>
    </div>
  )
}
