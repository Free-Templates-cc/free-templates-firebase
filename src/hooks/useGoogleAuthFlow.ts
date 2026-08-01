import { useNavigate } from 'react-router-dom'
import { useGoogleSignIn } from './useGoogleSignIn'
import { handleGoogleSignInSuccess } from '../lib/userProfile'

/**
 * Google sign-in wired to the shared post-auth flow (profile doc creation,
 * sign-up tracking, redirect). Used by both the login and register pages so
 * the Google button behaves identically regardless of entry point.
 */
export function useGoogleAuthFlow(redirectTo: string, onError: (message: string) => void) {
  const navigate = useNavigate()

  return useGoogleSignIn({
    onSuccess: async (user, isNewUser) => {
      await handleGoogleSignInSuccess(user, isNewUser, redirectTo, navigate)
    },
    onError,
  })
}
