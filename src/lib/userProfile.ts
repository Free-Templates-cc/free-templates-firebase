import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db } from './firebase'
import { trackSignUp } from './analytics'

/**
 * Create the `users/{uid}` profile document on first sign-up.
 *
 * Only creates the profile if it does not exist yet. Returning users (e.g. a
 * Google account that already exists) must keep their existing document — a
 * plain set() would wipe subscription state and the Stripe customer ID.
 *
 * Shared by the register and login pages so a new Google user gets a profile
 * doc regardless of which entry point they sign up through.
 */
export const createUserDoc = async (uid: string, name: string, email: string) => {
  const userDocRef = doc(db, 'users', uid)
  const userDoc = await getDoc(userDocRef)
  if (userDoc.exists()) return

  await setDoc(userDocRef, {
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

/**
 * Shared Google sign-in success flow for the auth pages: create the profile
 * doc when missing, track new sign-ups, then navigate to the redirect target.
 */
export const handleGoogleSignInSuccess = async (
  user: User,
  isNewUser: boolean,
  redirectTo: string,
  navigate: (to: string) => void,
) => {
  await createUserDoc(user.uid, user.displayName || 'User', user.email ?? '')
  if (isNewUser) void trackSignUp('google')
  navigate(redirectTo)
}
