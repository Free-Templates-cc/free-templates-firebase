import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useAuthStore, initAuthListener, cleanupAuthListener } from '../authStore'

const { mockOnAuthStateChanged, mockOnSnapshot, mockDoc, mockUnsubscribe } = vi.hoisted(() => {
  const mockOnAuthStateChanged = vi.fn()
  const mockUnsubscribe = vi.fn()
  const mockOnSnapshot = vi.fn()
  const mockDoc = vi.fn(() => ({ id: 'test-uid' }))
  return { mockOnAuthStateChanged, mockOnSnapshot, mockDoc, mockUnsubscribe }
})

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn((...args: unknown[]) => {
    mockOnAuthStateChanged(...args)
    return vi.fn()
  }),
  signOut: vi.fn(),
}))

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: (...args: unknown[]) => mockDoc(...args),
  onSnapshot: (...args: unknown[]) => mockOnSnapshot(...args),
}))

vi.mock('../../lib/firebase', () => ({
  auth: {},
  db: {},
}))

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset store to initial state
    useAuthStore.setState({
      user: null,
      profile: null,
      isLoading: true,
      isPremium: false,
      isAdmin: false,
      initialized: false,
    })
  })

  afterEach(() => {
    cleanupAuthListener()
  })

  // --- Initial state ---

  it('starts with default values', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.profile).toBeNull()
    expect(state.isLoading).toBe(true)
    expect(state.isPremium).toBe(false)
    expect(state.isAdmin).toBe(false)
    expect(state.initialized).toBe(false)
  })

  // --- initAuthListener ---

  it('registers onAuthStateChanged on init', () => {
    mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (user: unknown) => void) => {
      callback(null) // no user
      return vi.fn()
    })

    initAuthListener()

    expect(mockOnAuthStateChanged).toHaveBeenCalled()
    // After init with no user, store should be updated
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.isLoading).toBe(false)
    expect(state.initialized).toBe(true)
  })

  it('does not register auth listener twice', () => {
    mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (user: unknown) => void) => {
      callback(null)
      return vi.fn()
    })

    initAuthListener()
    initAuthListener() // second call should be no-op

    expect(mockOnAuthStateChanged).toHaveBeenCalledTimes(1)
  })

  // --- Auth state changes ---

  it('sets user and starts profile listener when user signs in', () => {
    const mockUser = { uid: 'test-uid', email: 'test@example.com' }

    mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (user: unknown) => void) => {
      callback(mockUser)
      return vi.fn()
    })

    initAuthListener()

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.isLoading).toBe(true)
  })

  it('handles non-existing user document (just signed up)', () => {
    const mockUser = { uid: 'new-uid', email: 'new@example.com' }

    mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (user: unknown) => void) => {
      callback(mockUser)
      return vi.fn()
    })

    mockOnSnapshot.mockImplementation((_docRef: unknown, onNext: (snapshot: unknown) => void) => {
      onNext({
        exists: () => false,
      })
      return mockUnsubscribe
    })

    initAuthListener()

    const state = useAuthStore.getState()
    expect(state.profile).toBeNull()
    expect(state.isPremium).toBe(false)
    expect(state.isLoading).toBe(false)
    expect(state.initialized).toBe(true)
  })

  it('detects premium user with active subscription', () => {
    const mockUser = { uid: 'premium-uid', email: 'premium@example.com' }

    mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (user: unknown) => void) => {
      callback(mockUser)
      return vi.fn()
    })

    mockOnSnapshot.mockImplementation((_docRef: unknown, onNext: (snapshot: unknown) => void) => {
      onNext({
        exists: () => true,
        data: () => ({
          displayName: 'Premium User',
          email: 'premium@example.com',
          role: 'user',
          subscription: { tier: 'premium', status: 'active' },
        }),
      })
      return mockUnsubscribe
    })

    initAuthListener()

    const state = useAuthStore.getState()
    expect(state.isPremium).toBe(true)
    expect(state.isAdmin).toBe(false)
  })

  it('detects admin role', () => {
    const mockUser = { uid: 'admin-uid', email: 'admin@example.com' }

    mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (user: unknown) => void) => {
      callback(mockUser)
      return vi.fn()
    })

    mockOnSnapshot.mockImplementation((_docRef: unknown, onNext: (snapshot: unknown) => void) => {
      onNext({
        exists: () => true,
        data: () => ({
          displayName: 'Admin',
          email: 'admin@example.com',
          role: 'admin',
          subscription: { tier: 'free', status: 'active' },
        }),
      })
      return mockUnsubscribe
    })

    initAuthListener()

    const state = useAuthStore.getState()
    expect(state.isAdmin).toBe(true)
    expect(state.isPremium).toBe(false)
  })

  it('handles Firestore onSnapshot error', () => {
    const mockUser = { uid: 'err-uid', email: 'err@example.com' }
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (user: unknown) => void) => {
      callback(mockUser)
      return vi.fn()
    })

    mockOnSnapshot.mockImplementation((_docRef: unknown, _onNext: unknown, onError?: (error: Error) => void) => {
      if (onError) {
        onError(new Error('Permission denied'))
      }
      return mockUnsubscribe
    })

    initAuthListener()

    const state = useAuthStore.getState()
    expect(state.profile).toBeNull()
    expect(state.isPremium).toBe(false)
    expect(state.isLoading).toBe(false)
    expect(state.initialized).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith(
      'Firestore onSnapshot error for user profile:',
      expect.any(Error),
    )

    consoleSpy.mockRestore()
  })

  it('handles sign out by clearing user data', () => {
    // Track callbacks
    let authCallback: ((user: unknown) => void) | null = null

    mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (user: unknown) => void) => {
      authCallback = callback
      // Call with user first
      callback({ uid: 'test-uid', email: 'test@example.com' })
      return vi.fn()
    })

    initAuthListener()

    // Now simulate sign out
    if (authCallback) {
      authCallback(null)
    }

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.profile).toBeNull()
    expect(state.isPremium).toBe(false)
    expect(state.isAdmin).toBe(false)
    expect(state.isLoading).toBe(false)
    expect(state.initialized).toBe(true)
  })

  // --- cleanupAuthListener ---

  it('cleans up profile and auth listeners', () => {
    mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (user: unknown) => void) => {
      const mockUser = { uid: 'test-uid', email: 'test@example.com' }
      callback(mockUser)
      return vi.fn()
    })

    mockOnSnapshot.mockImplementation((_docRef: unknown, onNext: (snapshot: unknown) => void) => {
      onNext({
        exists: () => true,
        data: () => ({
          displayName: 'Test User',
          email: 'test@example.com',
          role: 'user',
          subscription: { tier: 'free', status: 'active' },
        }),
      })
      return mockUnsubscribe
    })

    initAuthListener()
    cleanupAuthListener()

    // Profile listener should have been unsubscribed (called at cleanup and by auth change)
    expect(mockUnsubscribe).toHaveBeenCalled()
  })

  it('handles cleanup when no listeners are active', () => {
    // cleanup should not throw when no listeners were initialized
    expect(() => cleanupAuthListener()).not.toThrow()
  })
})
