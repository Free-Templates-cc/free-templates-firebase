import { useState } from 'react'
import type { User } from 'firebase/auth'
import { signInWithGooglePopup, googleAuthErrorMessage } from '../lib/googleAuth'

interface UseGoogleSignInOptions {
  /** Runs after a successful popup sign-in. */
  onSuccess: (user: User, isNewUser: boolean) => void | Promise<void>
  /** Receives a normalized error message, or an empty string when signing in. */
  onError: (message: string) => void
}

/**
 * Shared Google sign-in flow for the auth pages: handles the popup, filters
 * out `auth/popup-closed-by-user`, reports errors through `onError`, and
 * exposes the loading flag.
 */
export function useGoogleSignIn({ onSuccess, onError }: UseGoogleSignInOptions) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    onError('')
    setIsLoading(true)
    try {
      const { user, isNewUser } = await signInWithGooglePopup()
      await onSuccess(user, isNewUser)
    } catch (err: unknown) {
      const message = googleAuthErrorMessage(err)
      if (message) onError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return { handleSignIn, isLoading }
}
