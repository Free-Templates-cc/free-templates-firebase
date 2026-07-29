import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useDownloads } from '../../hooks/useDownloads'
import { SEOHead } from '../../components/seo/SEOHead'
import { Card, CardContent } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { Navigate } from 'react-router-dom'
import { Download, ArrowLeft, FileCode, Calendar, ExternalLink } from 'lucide-react'
import { Button } from '../../components/ui/Button'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function DownloadHistorySkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800"
        >
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

export function DownloadHistoryPage() {
  const { user, isLoading: authLoading } = useAuthStore()
  const { data: downloads, isLoading, isError } = useDownloads(user?.uid)

  if (authLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-8 w-56" />
        <DownloadHistorySkeleton />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <SEOHead
        title="Download History — Free Templates"
        description="View your template download history on Free Templates."
        noIndex
      />

      {/* Back link */}
      <Link
        to="/account"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Account
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Download History</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Templates you've downloaded from Free Templates.
      </p>

      <div className="mt-8">
        {/* Loading state */}
        {isLoading && <DownloadHistorySkeleton />}

        {/* Error state */}
        {isError && (
          <Card>
            <CardContent>
              <div className="flex flex-col items-center py-8 text-center">
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Could not load download history
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Something went wrong. Please try again later.
                </p>
                <Link to="/account" className="mt-4">
                  <Button variant="outline" size="sm">
                    Go to Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {!isLoading && !isError && downloads && downloads.length === 0 && (
          <Card>
            <CardContent>
              <div className="flex flex-col items-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <Download className="h-8 w-8 text-gray-400" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  No downloads yet
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  When you download a template, it will appear here.
                </p>
                <Link to="/templates" className="mt-6">
                  <Button variant="premium" size="sm">
                    Browse Templates
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Download list */}
        {!isLoading && !isError && downloads && downloads.length > 0 && (
          <div className="space-y-3">
            {downloads.map((dl) => (
              <Link
                key={dl.id}
                to={`/templates/${dl.templateSlug}`}
                className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
                  <FileCode className="h-6 w-6" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                    {dl.templateName}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(dl.downloadedAt)}
                    </span>
                    {dl.templateCategory && (
                      <Badge variant="default" className="text-[10px]">
                        {dl.templateCategory}
                      </Badge>
                    )}
                    {dl.priceTier && (
                      <Badge variant={dl.priceTier} className="text-[10px]">
                        {dl.priceTier === 'premium' ? 'Premium' : 'Free'}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <div className="shrink-0 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  <ArrowLeft className="h-5 w-5 rotate-180" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
