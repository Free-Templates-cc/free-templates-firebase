import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Navigate } from 'react-router-dom'
import { User, Crown, Download } from 'lucide-react'

export function AccountPage() {
  const { user, profile, isLoading, isPremium } = useAuthStore()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-32 rounded-xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Account</h1>

      <div className="mt-8 grid gap-6">
        {/* Profile card */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900 dark:text-white">Profile</h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                <User className="h-8 w-8" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{profile?.displayName || 'User'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-white">Subscription</h2>
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                isPremium
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                <Crown className="h-3 w-3" />
                {isPremium ? 'Premium' : 'Free'}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isPremium
                ? 'You have full access to all premium templates.'
                : 'Upgrade to Premium to unlock unlimited template downloads.'}
            </p>
            {!isPremium && (
              <div className="mt-4">
                <a href="/pricing">
                  <Button variant="premium" size="sm">Upgrade to Premium</Button>
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Download history card */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900 dark:text-white">Download History</h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <Download className="h-5 w-5" />
              <span>
                Total downloads: <strong className="text-gray-900 dark:text-white">{profile?.downloadCount || 0}</strong>
              </span>
            </div>
            {profile?.downloadCount === 0 && (
              <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">
                You haven't downloaded any templates yet.{' '}
                <a href="/templates" className="text-primary-600 hover:text-primary-500">Browse templates</a>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
