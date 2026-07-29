import { useParams, Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { LazyImage } from '../components/ui/LazyImage'
import { SEOHead } from '../components/seo/SEOHead'
import { useAuthStore } from '../stores/authStore'
import { useTemplate, useRelatedTemplates } from '../hooks/useTemplate'
import { useTemplateDownloadCount } from '../hooks/useTemplateDownloadCount'

function LiveDownloadCount({ slug, staticCount }: { slug: string; staticCount: number }) {
  const { data: liveCount } = useTemplateDownloadCount(slug)
  const display =
    liveCount !== undefined ? liveCount.toLocaleString() : staticCount.toLocaleString()
  return <>{display}</>
}
import { ArrowLeft, Download, ExternalLink, GitFork, Check } from 'lucide-react'

/** Normalize framework name for Badge variant (e.g. 'Next.js' → 'nextjs'). */
const fwVariant = (fw: string) =>
  fw.toLowerCase().replace(/[.\\s]/g, '') as 'nextjs' | 'gatsby' | 'nuxt' | 'vue' | 'react'

export function TemplateDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { user, isPremium, isLoading: authLoading } = useAuthStore()

  const { data: template, isLoading, isError } = useTemplate(slug ?? '')
  const { data: relatedTemplates } = useRelatedTemplates(slug ?? '', template?.category ?? '')

  // Loading state
  if (isLoading || authLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SEOHead title="Loading Template... — Free Templates" noIndex />
        <Skeleton className="mb-6 h-4 w-32" />
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-video w-full rounded-lg" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="mt-4 h-10 w-3/4" />
            <Skeleton className="mt-3 h-20 w-full" />
            <Skeleton className="mt-6 h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  // Error / not found
  if (isError || !template) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SEOHead title="Template Not Found — Free Templates" noIndex />
        <Link
          to="/templates"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to templates
        </Link>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-white">Template not found</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            The template you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/templates" className="mt-4">
            <Button variant="outline" size="sm">
              Browse templates
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SEOHead
        title={`${template.name} — Free ${template.framework} Template`}
        description={template.description}
        ogImage={template.mainImage}
        canonicalUrl={`https://free-templates.cc/templates/${template.slug}`}
      />
      {/* Back */}
      <Link
        to="/templates"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to templates
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-5">
        {/* Gallery */}
        <div className="lg:col-span-3">
          <LazyImage
            src={template.mainImage}
            alt={template.name}
            aspectRatio="16/9"
            className="rounded-xl"
            wrapperClassName="rounded-xl"
          />
          {template.previewImages.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {template.previewImages.slice(0, 4).map((img, i) => (
                <LazyImage
                  key={i}
                  src={img}
                  alt={`${template.name} preview ${i + 1}`}
                  aspectRatio="16/9"
                  className="rounded-lg"
                  wrapperClassName="rounded-lg"
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <Badge variant={template.priceTier}>
              {template.priceTier === 'premium' ? 'Premium' : 'Free'}
            </Badge>
            <Badge variant={fwVariant(template.framework)}>{template.framework}</Badge>
          </div>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{template.name}</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">{template.description}</p>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>
              Category:{' '}
              <strong className="text-gray-900 dark:text-white">{template.category}</strong>
            </span>
            <span>
              Downloads:{' '}
              <strong className="text-gray-900 dark:text-white">
                <LiveDownloadCount slug={template.slug} staticCount={template.downloads} />
              </strong>
            </span>
          </div>

          {/* Download section */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
            {template.priceTier === 'free' ? (
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
            {template.demoUrl && (
              <a
                href={template.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </a>
            )}
            {template.githubUrl && (
              <a
                href={template.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <GitFork className="h-4 w-4" />
                GitHub
              </a>
            )}
          </div>

          {/* Features */}
          {template.features.length > 0 && (
            <div className="mt-8">
              <h2 className="font-semibold text-gray-900 dark:text-white">Features</h2>
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {template.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Related Templates */}
      {relatedTemplates && relatedTemplates.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            More in <span className="text-primary-600">{template.category}</span>
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Templates you might also like
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedTemplates.map((rt) => (
              <Link
                key={rt.id}
                to={`/templates/${rt.slug}`}
                className="group rounded-xl border border-gray-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <LazyImage
                  src={rt.mainImage}
                  alt={rt.name}
                  aspectRatio="16/9"
                  className="rounded-lg"
                  wrapperClassName="mb-3 rounded-lg"
                />
                <div className="flex items-center justify-between">
                  <Badge variant={rt.priceTier}>
                    {rt.priceTier === 'premium' ? 'Premium' : 'Free'}
                  </Badge>
                  <Badge variant={fwVariant(rt.framework)}>{rt.framework}</Badge>
                </div>
                <h3 className="mt-2 font-semibold text-gray-900 dark:text-white group-hover:text-primary-600">
                  {rt.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {rt.downloads.toLocaleString()} downloads
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
