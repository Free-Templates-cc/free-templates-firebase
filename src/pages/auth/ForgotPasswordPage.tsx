import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { SEOHead } from '../../components/seo/SEOHead'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', '').replace(/\(.*\)/, ''))
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-16">
        <SEOHead title="Password Reset Sent — Free Templates" noIndex />
        <div className="w-full text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Check your email
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We sent a password reset link to{' '}
            <strong className="text-gray-900 dark:text-white">{email}</strong>
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
            Didn't get it?{' '}
            <button
              onClick={() => setSent(false)}
              className="text-primary-600 hover:text-primary-500"
            >
              Try again
            </button>
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-16">
      <SEOHead
        title="Forgot Password — Free Templates"
        description="Reset your Free Templates account password."
        noIndex
      />
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset your password</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Enter your email and we'll send you a reset link.
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="relative mt-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <Button type="submit" isLoading={isLoading} size="lg" className="w-full">
            Send Reset Link
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Remember your password?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
