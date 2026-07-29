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

  authUnsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      useAuthStore.setState({ user, isLoading: true })

      // Listen to user profile in Firestore
      const userDocRef = doc(db, 'users', user.uid)
      profileUnsubscribe = onSnapshot(
        userDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const profile = snapshot.data() as UserProfile
            useAuthStore.setState({
              profile,
              isPremium:
                profile.subscription?.tier === 'premium' && profile.subscription?.status === 'active',
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
  })
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
