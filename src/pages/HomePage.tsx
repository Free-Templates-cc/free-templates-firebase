import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { LazyImage } from '../components/ui/LazyImage'
import { SEOHead } from '../components/seo/SEOHead'
import { Search, ArrowRight, Star, Download, Grid3X3, Layers } from 'lucide-react'

const categories = [
  {
    name: 'Business',
    count: 245,
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  },
  {
    name: 'Portfolio',
    count: 189,
    color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
  },
  {
    name: 'Landing',
    count: 312,
    color: 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400',
  },
  {
    name: 'E-Commerce',
    count: 98,
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
  },
  {
    name: 'Blog',
    count: 134,
    color: 'bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-400',
  },
  {
    name: 'SaaS',
    count: 87,
    color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400',
  },
]

const featuredTemplates = [
  {
    name: 'Portfolio 2',
    description: 'Modern portfolio template for creatives',
    framework: 'Next.js',
    tier: 'free' as const,
  },
  {
    name: 'Busicol',
    description: 'Business landing page template',
    framework: 'Next.js',
    tier: 'free' as const,
  },
  {
    name: 'OnlineEdu',
    description: 'E-learning platform template',
    framework: 'Next.js',
    tier: 'premium' as const,
  },
  {
    name: 'Sintec',
    description: 'Construction company website',
    framework: 'Next.js',
    tier: 'free' as const,
  },
  {
    name: 'OnePro',
    description: 'One-page business template',
    framework: 'Next.js',
    tier: 'free' as const,
  },
  {
    name: 'AppPro',
    description: 'SaaS application landing page',
    framework: 'Gatsby.js',
    tier: 'premium' as const,
  },
]

const stats = [
  { icon: Grid3X3, value: '1,000+', label: 'Templates' },
  { icon: Download, value: '50K+', label: 'Downloads' },
  { icon: Star, value: '4.8', label: 'Avg. Rating' },
  { icon: Layers, value: '6+', label: 'Frameworks' },
]

export function HomePage() {
  return (
    <div>
      <SEOHead
        title="Free Website Templates — Next.js, Gatsby & More"
        description="Browse 1,000+ free and premium website templates for Next.js, Gatsby.js, Nuxt.js, and React. Download production-ready starter templates for your next project."
      />
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
              1,000+ Free Website
              <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                {' '}
                Templates
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
              Jumpstart your next project with production-ready templates for Next.js, Gatsby.js,
              Nuxt.js, and more. Free and premium starter templates for every need.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link to="/templates">
                <Button size="lg">
                  Browse Templates
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg">
                  View Pricing
                </Button>
              </Link>
            </div>

            {/* Search */}
            <div className="mx-auto mt-12 max-w-xl">
              <div className="relative">
                <label htmlFor="hero-search" className="sr-only">
                  Search templates
                </label>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="hero-search"
                  type="text"
                  placeholder="Search templates..."
                  className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-base shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Popular:</span>
                {['Portfolio', 'Business', 'Landing', 'Blog'].map((tag) => (
                  <Link
                    key={tag}
                    to={`/templates?search=${tag}`}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto h-6 w-6 text-primary-500" />
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-gray-200 py-16 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Browse by Category</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Find the perfect template for your project.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/templates?category=${cat.name.toLowerCase()}`}
                className={`rounded-xl p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-md ${cat.color}`}
              >
                <p className="font-semibold">{cat.name}</p>
                <p className="mt-1 text-sm opacity-75">{cat.count} templates</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Templates */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Featured Templates
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Hand-picked templates to get you started.
              </p>
            </div>
            <Link to="/templates">
              <Button variant="ghost">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTemplates.map((tmpl) => (
              <div
                key={tmpl.name}
                className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                <LazyImage
                  src={`https://picsum.photos/seed/${tmpl.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}/640/360`}
                  alt={tmpl.name}
                  aspectRatio="16/9"
                  className="rounded-lg"
                  wrapperClassName="mb-4 rounded-lg"
                />
                <div className="flex items-center justify-between">
                  <Badge variant={tmpl.tier === 'premium' ? 'premium' : 'free'}>
                    {tmpl.tier === 'premium' ? 'Premium' : 'Free'}
                  </Badge>
                  <Badge
                    variant={
                      tmpl.framework.toLowerCase().replace(/[.\s]/g, '') as
                        'nextjs' | 'gatsby' | 'nuxt' | 'vue' | 'react'
                    }
                  >
                    {tmpl.framework}
                  </Badge>
                </div>
                <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">{tmpl.name}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{tmpl.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Go Premium</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            Get unlimited access to all premium templates, priority support, and early access to new
            releases.
          </p>
          <div className="mt-8">
            <Link to="/pricing">
              <Button variant="premium" size="xl">
                See Plans <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
