import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Navigate } from 'react-router-dom'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import toast from 'react-hot-toast'
import { User, Crown, Download, Lock } from 'lucide-react'

export function AccountPage() {
  const { user, profile, isLoading, isPremium } = useAuthStore()

  // Change password state
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

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
      const credential = EmailAuthProvider.credential(user.email!, currentPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)

      toast.success('Password updated successfully')
      setShowPasswordForm(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      const msg = err.code
        ? err.code.replace('auth/', '').replace(/-/g, ' ')
        : err.message
      toast.error(msg.charAt(0).toUpperCase() + msg.slice(1))
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const isGoogleUser = user.providerData.some((p) => p?.providerId === 'google.com')

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
