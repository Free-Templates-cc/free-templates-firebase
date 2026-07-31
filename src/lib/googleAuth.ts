import {
  signInWithPopup,
  GoogleAuthProvider,
  getAdditionalUserInfo,
  type User,
} from 'firebase/auth'
import { auth } from './firebase'

/**
 * Run the Google sign-in popup and return the signed-in user together with
 * whether the account was just created. Shared by the login and register
 * pages so the popup + `isNewUser` detection logic lives in one place.
 */
export async function signInWithGooglePopup(): Promise<{
  user: User
  isNewUser: boolean
}> {
  const result = await signInWithPopup(auth, new GoogleAuthProvider())
  return { user: result.user, isNewUser: getAdditionalUserInfo(result)?.isNewUser ?? false }
}

/**
 * Normalize a Firebase auth error for display. Returns `null` when the user
 * closed the popup (that is not an error worth showing).
 */
export function googleAuthErrorMessage(err: unknown): string | null {
  const code = (err as { code?: string } | null)?.code
  if (code === 'auth/popup-closed-by-user') return null
  const message = (err as Error | null)?.message ?? String(err)
  return message.replace('Firebase: ', '').replace(/\(.*\)/, '')
}
