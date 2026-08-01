import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { SEOHead } from '../components/seo/SEOHead'
import { Navigate, Link, useLocation } from 'react-router-dom'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import {
  cancelSubscription as apiCancelSubscription,
  reactivateSubscription as apiReactivateSubscription,
  createBillingPortalSession,
} from '../lib/api'
import { getErrorMessage } from '../lib/errors'
import toast from 'react-hot-toast'
import {
  User,
  Crown,
  Download,
  Lock,
  AlertTriangle,
  ExternalLink,
  Calendar,
  RefreshCw,
  XCircle,
} from 'lucide-react'
import type { Timestamp } from 'firebase/firestore'
import type { UserProfile } from '../types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(ts: Timestamp | undefined | null): string | null {
  if (!ts?.toDate) return null
  return ts.toDate().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** True if the subscription is in a grace period (past_due or canceled but period not ended). */
function isInGracePeriod(profile: UserProfile | null): boolean {
  if (!profile?.subscription) return false
  const { status, currentPeriodEnd } = profile.subscription
  if (!currentPeriodEnd?.toDate) return false
  const now = new Date()
  const periodEnd = currentPeriodEnd.toDate()
  return (status === 'past_due' || status === 'canceled') && periodEnd > now
}

// ---------------------------------------------------------------------------
// SubscriptionBadge
// ---------------------------------------------------------------------------

function SubscriptionBadge({ status, isPremium }: { status?: string; isPremium: boolean }) {
  const label =
    status === 'past_due'
      ? 'Past Due'
      : status === 'canceled'
        ? 'Canceled'
        : isPremium
          ? 'Premium'
          : 'Free'

  const color =
    status === 'past_due'
      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      : status === 'canceled'
        ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
        : isPremium
          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${color}`}
    >
      {status === 'past_due' ? (
        <AlertTriangle className="h-3 w-3" />
      ) : isPremium ? (
        <Crown className="h-3 w-3" />
      ) : null}
      {label}
    </span>
  )
}

// ---------------------------------------------------------------------------
// SubscriptionContent
// ---------------------------------------------------------------------------

function SubscriptionContent({
  profile,
  isPremium,
  userUid,
}: {
  profile: UserProfile | null
  isPremium: boolean
  userUid: string | undefined
}) {
  const sub = profile?.subscription
  const status = sub?.status
  const periodEnd = formatDate(sub?.currentPeriodEnd)
  const canceledAt = formatDate(sub?.canceledAt)

  // --- Loading states ---
  const [isCanceling, setIsCanceling] = useState(false)
  const [isReactivating, setIsReactivating] = useState(false)
  const [isOpeningPortal, setIsOpeningPortal] = useState(false)

  // --- Handlers ---

  const handleCancel = async () => {
    if (!userUid) return
    setIsCanceling(true)
    try {
      await apiCancelSubscription(userUid)
      toast.success('Subscription will be canceled at the end of the billing period.')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to cancel subscription. Please try again.'))
    } finally {
      setIsCanceling(false)
    }
  }

  const handleReactivate = async () => {
    if (!userUid) return
    setIsReactivating(true)
    try {
      await apiReactivateSubscription(userUid)
      toast.success('Subscription reactivated successfully!')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to reactivate subscription. Please try again.'))
    } finally {
      setIsReactivating(false)
    }
  }

  const handleBillingPortal = async () => {
    if (!userUid) return
    setIsOpeningPortal(true)
    try {
      const { url } = await createBillingPortalSession(userUid)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to open billing portal. Please try again.'))
    } finally {
      setIsOpeningPortal(false)
    }
  }

  // --- Past Due ---
  if (status === 'past_due') {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div className="text-sm text-red-700 dark:text-red-300">
            <p className="font-medium">Payment Issue</p>
            <p className="mt-1">
              Your last payment failed. Your access will be suspended soon if the issue isn't
              resolved.
            </p>
            {periodEnd && (
              <p className="mt-1 text-xs text-red-500">Current period ends: {periodEnd}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="premium"
            size="sm"
            isLoading={isOpeningPortal}
            onClick={handleBillingPortal}
          >
            <ExternalLink className="mr-1.5 h-4 w-4" />
            Update Payment Method
          </Button>
        </div>
        {isInGracePeriod(profile) && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            You still have full access during the grace period.
          </p>
        )}
      </div>
    )
  }

  // --- Canceled at period end, still within the billing period ---
  // `isPremium` already requires status 'active', so the scheduled-cancellation
  // state is identified by the presence of `canceledAt` (set by the
  // cancelSubscription Cloud Function), not by status === 'canceled'.
  if (isPremium && canceledAt) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div className="text-sm text-amber-700 dark:text-amber-300">
            <p className="font-medium">Cancellation Scheduled</p>
            {periodEnd && (
              <p className="mt-1">
                Your Premium access will continue until <strong>{periodEnd}</strong>. After that,
                you will be reverted to the Free plan.
              </p>
            )}
            {canceledAt && <p className="mt-1 text-xs text-amber-500">Canceled on {canceledAt}</p>}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" isLoading={isReactivating} onClick={handleReactivate}>
            <RefreshCw className="mr-1.5 h-4 w-4" />
            Reactivate Subscription
          </Button>
          <Button
            variant="ghost"
            size="sm"
            isLoading={isOpeningPortal}
            onClick={handleBillingPortal}
          >
            <ExternalLink className="mr-1.5 h-4 w-4" />
            Billing Details
          </Button>
        </div>
      </div>
    )
  }

  // --- Active Premium ---
  if (isPremium) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          You have full access to all premium templates.
        </p>
        {periodEnd && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>
              Next billing date:{' '}
              <strong className="text-gray-900 dark:text-white">{periodEnd}</strong>
            </span>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" isLoading={isCanceling} onClick={handleCancel}>
            <XCircle className="mr-1.5 h-4 w-4" />
            Cancel Subscription
          </Button>
          <Button
            variant="ghost"
            size="sm"
            isLoading={isOpeningPortal}
            onClick={handleBillingPortal}
          >
            <ExternalLink className="mr-1.5 h-4 w-4" />
            Manage Billing
          </Button>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Cancel anytime — you keep access until the end of your billing period.
        </p>
      </div>
    )
  }

  // --- Free / No Subscription ---
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Upgrade to Premium to unlock unlimited template downloads.
      </p>
      <Link to="/pricing">
        <Button variant="premium" size="sm">
          Upgrade to Premium
        </Button>
      </Link>
      {status === 'canceled' && periodEnd && (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Your previous Premium plan ended on {periodEnd}.
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// AccountPage (main)
// ---------------------------------------------------------------------------

export function AccountPage() {
  const { user, profile, isLoading } = useAuthStore()
  const location = useLocation()

  // Change password state
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <SEOHead title="Account — Free Templates" noIndex />
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-32 rounded-xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    )
  }

  if (!user) {
    // Send the user back here after they sign in.
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    )
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    setIsUpdatingPassword(true)
    try {
      // Re-authenticate first
      const credential = EmailAuthProvider.credential(user.email ?? '', currentPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)

      toast.success('Password updated successfully')
      setShowPasswordForm(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      const code =
        err instanceof Error && 'code' in err && typeof err.code === 'string' ? err.code : ''
      const msg = code
        ? code.replace('auth/', '').replace(/-/g, ' ')
        : getErrorMessage(err, 'Failed to update password. Please try again.')
      toast.error(msg.charAt(0).toUpperCase() + msg.slice(1))
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const isGoogleUser = user.providerData.some((p) => p?.providerId === 'google.com')
  const isPremium =
    profile?.subscription?.tier === 'premium' && profile?.subscription?.status === 'active'

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <SEOHead
        title="My Account — Free Templates"
        description="Manage your Free Templates account, subscription, and downloads."
        noIndex
      />
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
                <p className="font-medium text-gray-900 dark:text-white">
                  {profile?.displayName || 'User'}
                </p>
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
              <SubscriptionBadge status={profile?.subscription?.status} isPremium={isPremium} />
            </div>
          </CardHeader>
          <CardContent>
            <SubscriptionContent profile={profile} isPremium={isPremium} userUid={user?.uid} />
          </CardContent>
        </Card>

        {/* Change Password card — only for email/password users */}
        {!isGoogleUser && (
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-gray-900 dark:text-white">Password</h2>
            </CardHeader>
            <CardContent>
              {showPasswordForm ? (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <Input
                    label="Current password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter your current password"
                  />
                  <Input
                    label="New password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                  />
                  <Input
                    label="Confirm new password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-enter new password"
                  />
                  <div className="flex items-center gap-3">
                    <Button type="submit" isLoading={isUpdatingPassword} size="sm">
                      Update Password
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowPasswordForm(false)
                        setCurrentPassword('')
                        setNewPassword('')
                        setConfirmPassword('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <Lock className="h-5 w-5" />
                    <span>Manage your password</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowPasswordForm(true)}>
                    Change Password
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Download history card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-white">Download History</h2>
              <Link
                to="/account/downloads"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <Download className="h-5 w-5" />
              <span>
                Total downloads:{' '}
                <strong className="text-gray-900 dark:text-white">
                  {profile?.downloadCount || 0}
                </strong>
              </span>
            </div>
            {(!profile?.downloadCount || profile.downloadCount === 0) && (
              <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">
                You haven't downloaded any templates yet.{' '}
                <Link to="/templates" className="text-primary-600 hover:text-primary-500">
                  Browse templates
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
