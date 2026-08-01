import { create } from 'zustand'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import type { UserProfile } from '../types'

interface AuthState {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  isPremium: boolean
  isAdmin: boolean
  initialized: boolean
}

export const useAuthStore = create<AuthState>(() => ({
  user: null,
  profile: null,
  isLoading: true,
  isPremium: false,
  isAdmin: false,
  initialized: false,
}))

// Initialize auth listener (call this once in main.tsx)
let authUnsubscribe: (() => void) | null = null
let profileUnsubscribe: (() => void) | null = null

export function initAuthListener() {
  if (authUnsubscribe) return // already initialized

  authUnsubscribe = onAuthStateChanged(
    auth,
    (user) => {
      if (user) {
        useAuthStore.setState({ user, isLoading: true })

        // onAuthStateChanged re-fires on token refresh / sign-in changes —
        // unsubscribe the previous profile listener before attaching a new one.
        if (profileUnsubscribe) {
          profileUnsubscribe()
          profileUnsubscribe = null
        }

        // Listen to user profile in Firestore
        const userDocRef = doc(db, 'users', user.uid)
        profileUnsubscribe = onSnapshot(
          userDocRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const profile = snapshot.data() as UserProfile
              const periodEnd = profile.subscription?.currentPeriodEnd
              useAuthStore.setState({
                profile,
                // Mirror the server-side gate in the getDownloadUrl Cloud
                // Function: premium access requires an unexpired billing
                // period, not just tier/status. Otherwise a subscriber whose
                // period ended (but who hasn't been flipped by the daily
                // cleanup job yet) keeps premium UI and passes PremiumRoute
                // while the backend correctly rejects downloads with 403.
                isPremium:
                  profile.subscription?.tier === 'premium' &&
                  profile.subscription?.status === 'active' &&
                  (periodEnd ? periodEnd.toDate() > new Date() : false),
                isAdmin: profile.role === 'admin',
                isLoading: false,
                initialized: true,
              })
            } else {
              // User document doesn't exist yet (just signed up)
              useAuthStore.setState({
                profile: null,
                isPremium: false,
                isAdmin: false,
                isLoading: false,
                initialized: true,
              })
            }
          },
          (error) => {
            console.error('Firestore onSnapshot error for user profile:', error)
            useAuthStore.setState({
              profile: null,
              isPremium: false,
              isAdmin: false,
              isLoading: false,
              initialized: true,
            })
          },
        )
      } else {
        // Clean up profile listener
        if (profileUnsubscribe) {
          profileUnsubscribe()
          profileUnsubscribe = null
        }
        useAuthStore.setState({
          user: null,
          profile: null,
          isPremium: false,
          isAdmin: false,
          isLoading: false,
          initialized: true,
        })
      }
    },
    (error) => {
      // Auth state could not be determined (e.g. token refresh failure)
      console.error('Auth state change error:', error)
      if (profileUnsubscribe) {
        profileUnsubscribe()
        profileUnsubscribe = null
      }
      useAuthStore.setState({
        user: null,
        profile: null,
        isPremium: false,
        isAdmin: false,
        isLoading: false,
        initialized: true,
      })
    },
  )
}

export function cleanupAuthListener() {
  if (profileUnsubscribe) {
    profileUnsubscribe()
    profileUnsubscribe = null
  }
  if (authUnsubscribe) {
    authUnsubscribe()
    authUnsubscribe = null
  }
}
