import { useParams, Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../stores/authStore'
import { ArrowLeft, Download, ExternalLink, GitFork, Check } from 'lucide-react'

const features = [
  'Fully responsive layout',
  'Built with Next.js 14',
  'SEO optimized',
  'Fast loading performance',
  'Customizable components',
  'Cross-browser compatible',
  'Dark mode support',
  'Well documented',
]

export function TemplateDetailPage() {
  const { slug: _slug } = useParams()
  const { user, isPremium } = useAuthStore()

  const mockTemplate = {
    name: 'Portfolio 2',
    priceTier: 'premium' as const,
    framework: 'Next.js' as const,
    description: 'A stunning portfolio template designed for creative professionals and agencies. Features a modern design with smooth animations, a project showcase, and a fully responsive layout that looks great on any device.',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/example/portfolio-2',
    features,
    category: 'Portfolio',
    downloads: 3421,
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back */}
      <Link to="/templates" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        <ArrowLeft className="h-4 w-4" />
        Back to templates
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-5">
        {/* Gallery */}
        <div className="lg:col-span-3">
          <div className="aspect-video rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-video rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <Badge variant={mockTemplate.priceTier}>{mockTemplate.priceTier === 'premium' ? 'Premium' : 'Free'}</Badge>
            <Badge variant={mockTemplate.framework.toLowerCase() as any}>{mockTemplate.framework}</Badge>
          </div>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{mockTemplate.name}</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">{mockTemplate.description}</p>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>Category: <strong className="text-gray-900 dark:text-white">{mockTemplate.category}</strong></span>
            <span>Downloads: <strong className="text-gray-900 dark:text-white">{mockTemplate.downloads.toLocaleString()}</strong></span>
          </div>

          {/* Download section */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
            {(false) ? (  // free template path - placeholder
              <Button size="lg" className="w-full">
                <Download className="mr-2 h-5 w-5" />
                Download Free Template
              </Button>
            ) : isPremium ? (
              <Button size="lg" variant="premium" className="w-full">
                <Download className="mr-2 h-5 w-5" />
                Download Premium Template
              </Button>
            ) : user ? (
              <div>
                <Button size="lg" variant="premium" className="w-full" disabled>
                  <Download className="mr-2 h-5 w-5" />
                  Upgrade to Download
                </Button>
                <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                  You need an active Premium subscription to download this template.
                </p>
              </div>
            ) : (
              <div>
                <Link to="/pricing">
                  <Button size="lg" variant="premium" className="w-full">
                    Upgrade to Premium
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                  Sign up for a Premium plan to download this template.
                </p>
              </div>
            )}
          </div>

          {/* Links */}
          <div className="mt-4 flex gap-3">
            {mockTemplate.demoUrl && (
              <a href={mockTemplate.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </a>
            )}
            {mockTemplate.githubUrl && (
              <a href={mockTemplate.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                <GitFork className="h-4 w-4" />
                GitHub
              </a>
            )}
          </div>

          {/* Features */}
          <div className="mt-8">
            <h2 className="font-semibold text-gray-900 dark:text-white">Features</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
