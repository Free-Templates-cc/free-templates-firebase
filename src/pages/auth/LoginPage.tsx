import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../../components/ui/Button'
import { AuthDivider } from '../../components/auth/AuthDivider'
import { GoogleSignInButton } from '../../components/auth/GoogleSignInButton'
import { SEOHead } from '../../components/seo/SEOHead'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { trackSignUp } from '../../lib/analytics'
import { getFirebaseAuthErrorMessage } from '../../lib/errors'
import { useGoogleSignIn } from '../../hooks/useGoogleSignIn'
import { Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const [error, setError] = useState('')

  const { handleSignIn: handleGoogleLogin, isLoading: googleLoading } = useGoogleSignIn({
    onSuccess: async (_, isNewUser) => {
      if (isNewUser) void trackSignUp('google')
      navigate(redirectTo)
    },
    onError: setError,
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onEmailLogin = async (data: LoginForm) => {
    setError('')
    try {
      const cred = await signInWithEmailAndPassword(auth, data.email, data.password)
      if (!cred.user.emailVerified) {
        // Allow login but warn the user
        toast(
          'Please verify your email address. Check your inbox (and spam folder) for the verification link.',
          { duration: 8000, icon: '✉️' },
        )
      }
      navigate(redirectTo)
    } catch (err) {
      setError(getFirebaseAuthErrorMessage(err, 'Unable to sign in. Please try again.'))
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-16">
      <SEOHead
        title="Sign In — Free Templates"
        description="Sign in to your Free Templates account to download premium templates and manage your subscription."
      />
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to your account</p>

        {error && (
          <div
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onEmailLogin)} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <div className="relative mt-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="login-email"
                type="email"
                {...register('email')}
                className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-sm focus:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-white ${
                  errors.email
                    ? 'border-red-300 focus:border-red-500 focus-visible:ring-red-500/20'
                    : 'border-gray-300 focus:border-primary-500 focus-visible:ring-primary-500/20 dark:border-gray-700'
                }`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="login-password"
                type="password"
                {...register('password')}
                className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-sm focus:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-white ${
                  errors.password
                    ? 'border-red-300 focus:border-red-500 focus-visible:ring-red-500/20'
                    : 'border-gray-300 focus:border-primary-500 focus-visible:ring-primary-500/20 dark:border-gray-700'
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" isLoading={isSubmitting} size="lg" className="w-full">
            Sign In
          </Button>
        </form>

        <AuthDivider />

        <GoogleSignInButton onClick={handleGoogleLogin} isLoading={googleLoading} />

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
