import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../../components/ui/Button'
import { SEOHead } from '../../components/seo/SEOHead'
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../../lib/firebase'
import toast from 'react-hot-toast'
import { Mail, Lock, User } from 'lucide-react'

const registerSchema = z
  .object({
    displayName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the Terms of Service' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterForm = z.infer<typeof registerSchema>

export function RegisterPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const createUserDoc = async (uid: string, name: string, email: string) => {
    await setDoc(doc(db, 'users', uid), {
      uid,
      displayName: name,
      email,
      role: 'user',
      subscription: {
        status: 'incomplete',
        tier: 'free',
      },
      downloadCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  const onEmailRegister = async (data: RegisterForm) => {
    setError('')
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password)
      await updateProfile(cred.user, { displayName: data.displayName })
      await createUserDoc(cred.user.uid, data.displayName, data.email)
      // Send email verification
      await sendEmailVerification(cred.user)
      toast.success(
        'Account created! Please check your email to verify your address before signing in.',
        { duration: 6000 },
      )
      navigate('/login')
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', '').replace(/\(.*\)/, ''))
    }
  }

  const handleGoogleRegister = async () => {
    setError('')
    setGoogleLoading(true)
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider())
      await createUserDoc(result.user.uid, result.user.displayName || 'User', result.user.email!)
      navigate('/')
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message.replace('Firebase: ', '').replace(/\(.*\)/, ''))
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-16">
      <SEOHead
        title="Create Account — Free Templates"
        description="Create a Free Templates account to download premium templates and manage your subscriptions."
      />
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Start browsing free templates today.
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onEmailRegister)} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <div className="relative mt-1">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                {...register('displayName')}
                className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-sm focus:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-white ${
                  errors.displayName
                    ? 'border-red-300 focus:border-red-500 focus-visible:ring-red-500/20'
                    : 'border-gray-300 focus:border-primary-500 focus-visible:ring-primary-500/20 dark:border-gray-700'
                }`}
                placeholder="Your name"
              />
            </div>
            {errors.displayName && (
              <p className="mt-1 text-xs text-red-500">{errors.displayName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="relative mt-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <div className="relative mt-1">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                {...register('confirmPassword')}
                className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-sm focus:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-white ${
                  errors.confirmPassword
                    ? 'border-red-300 focus:border-red-500 focus-visible:ring-red-500/20'
                    : 'border-gray-300 focus:border-primary-500 focus-visible:ring-primary-500/20 dark:border-gray-700'
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms acceptance */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="termsAccepted"
              {...register('termsAccepted')}
              className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-primary-600 focus-visible:ring-primary-500 dark:border-gray-600"
            />
            <label htmlFor="termsAccepted" className="text-sm text-gray-600 dark:text-gray-400">
              I accept the{' '}
              <Link to="/terms" className="font-medium text-primary-600 hover:text-primary-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="font-medium text-primary-600 hover:text-primary-500">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.termsAccepted && (
            <p className="text-xs text-red-500">{errors.termsAccepted.message}</p>
          )}

          <Button type="submit" isLoading={isSubmitting} size="lg" className="w-full">
            Create Account
          </Button>
        </form>

        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="lg"
          className="mt-6 w-full"
          onClick={handleGoogleRegister}
          isLoading={googleLoading}
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
