import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { AuthDivider } from '../../components/auth/AuthDivider'
import { GoogleSignInButton } from '../../components/auth/GoogleSignInButton'
import { SEOHead } from '../../components/seo/SEOHead'
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../../lib/firebase'
import { trackSignUp } from '../../lib/analytics'
import { getFirebaseAuthErrorMessage } from '../../lib/errors'
import { useGoogleSignIn } from '../../hooks/useGoogleSignIn'
import { sanitizeRedirectPath } from '../../lib/utils'
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

const iconClass = 'h-4 w-4'

export function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = sanitizeRedirectPath(searchParams.get('redirect'))
  const [error, setError] = useState('')

  const { handleSignIn: handleGoogleRegister, isLoading: googleLoading } = useGoogleSignIn({
    onSuccess: async (user, isNewUser) => {
      await createUserDoc(user.uid, user.displayName || 'User', user.email ?? '')
      if (isNewUser) void trackSignUp('google')
      navigate(redirectTo)
    },
    onError: setError,
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onEmailRegister = async (data: RegisterForm) => {
    setError('')
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password)
      await updateProfile(cred.user, { displayName: data.displayName })
      await createUserDoc(cred.user.uid, data.displayName, data.email)
      // Send email verification
      await sendEmailVerification(cred.user)
      void trackSignUp('email')
      toast.success(
        'Account created! Please check your email to verify your address before signing in.',
        { duration: 6000 },
      )
      // Carry the intended destination through to the login page so the user
      // lands where they originally wanted to go after verifying + signing in.
      navigate(redirectTo === '/' ? '/login' : `/login?redirect=${encodeURIComponent(redirectTo)}`)
    } catch (err) {
      setError(getFirebaseAuthErrorMessage(err, 'Unable to create account. Please try again.'))
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
          <div
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onEmailRegister)} className="mt-8 space-y-4">
          <Input
            id="register-name"
            label="Name"
            type="text"
            icon={<User className={iconClass} />}
            placeholder="Your name"
            error={errors.displayName?.message}
            {...register('displayName')}
          />

          <Input
            id="register-email"
            label="Email"
            type="email"
            icon={<Mail className={iconClass} />}
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            id="register-password"
            label="Password"
            type="password"
            icon={<Lock className={iconClass} />}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            id="register-confirm-password"
            label="Confirm Password"
            type="password"
            icon={<Lock className={iconClass} />}
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

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

        <AuthDivider />

        <GoogleSignInButton onClick={handleGoogleRegister} isLoading={googleLoading} />

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to={redirectTo === '/' ? '/login' : `/login?redirect=${encodeURIComponent(redirectTo)}`}
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
