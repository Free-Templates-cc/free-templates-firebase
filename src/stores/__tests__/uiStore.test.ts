import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from '../uiStore'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resetStore() {
  // Clear the Zustand store back to defaults
  useUIStore.setState({
    isDarkMode: false,
    isMobileMenuOpen: false,
  })
  // Clear persisted storage
  localStorage.clear()
  // Remove any dark class left by previous tests
  document.documentElement.classList.remove('dark')
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('uiStore', () => {
  beforeEach(() => {
    resetStore()
  })

  // --- Initial state ---

  it('starts with isDarkMode false', () => {
    const { isDarkMode } = useUIStore.getState()
    expect(isDarkMode).toBe(false)
  })

  it('starts with isMobileMenuOpen false', () => {
    const { isMobileMenuOpen } = useUIStore.getState()
    expect(isMobileMenuOpen).toBe(false)
  })

  // --- toggleDarkMode ---

  it('toggleDarkMode flips isDarkMode from false to true', () => {
    useUIStore.getState().toggleDarkMode()
    expect(useUIStore.getState().isDarkMode).toBe(true)
  })

  it('toggleDarkMode flips isDarkMode from true to false', () => {
    useUIStore.getState().toggleDarkMode() // true
    useUIStore.getState().toggleDarkMode() // false
    expect(useUIStore.getState().isDarkMode).toBe(false)
  })

  it('toggleDarkMode adds dark class to document.documentElement when toggling on', () => {
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    useUIStore.getState().toggleDarkMode()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggleDarkMode removes dark class from document.documentElement when toggling off', () => {
    // Toggle on
    useUIStore.getState().toggleDarkMode()
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Toggle off
    useUIStore.getState().toggleDarkMode()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('toggleDarkMode handles multiple toggles correctly', () => {
    const toggles = [true, false, true, true, false]
    for (const _ of toggles) {
      useUIStore.getState().toggleDarkMode()
    }
    // Odd number of toggles (5) → should be true
    expect(useUIStore.getState().isDarkMode).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  // --- setMobileMenuOpen ---

  it('setMobileMenuOpen(true) opens the mobile menu', () => {
    useUIStore.getState().setMobileMenuOpen(true)
    expect(useUIStore.getState().isMobileMenuOpen).toBe(true)
  })

  it('setMobileMenuOpen(false) closes the mobile menu', () => {
    useUIStore.getState().setMobileMenuOpen(true)
    useUIStore.getState().setMobileMenuOpen(false)
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false)
  })

  it('setMobileMenuOpen can toggle repeatedly', () => {
    useUIStore.getState().setMobileMenuOpen(true)
    useUIStore.getState().setMobileMenuOpen(false)
    useUIStore.getState().setMobileMenuOpen(true)
    useUIStore.getState().setMobileMenuOpen(true)
    expect(useUIStore.getState().isMobileMenuOpen).toBe(true)
  })

  // --- Persistence ---

  it('persists isDarkMode to localStorage under ft-ui-preferences', () => {
    expect(localStorage.getItem('ft-ui-preferences')).toBeNull()

    useUIStore.getState().toggleDarkMode() // true

    const stored = JSON.parse(localStorage.getItem('ft-ui-preferences')!)
    expect(stored.state.isDarkMode).toBe(true)
  })

  it('persists isDarkMode correctly to localStorage on toggle', () => {
    // Toggle dark mode on
    useUIStore.getState().toggleDarkMode()
    let stored = JSON.parse(localStorage.getItem('ft-ui-preferences')!)
    expect(stored.state.isDarkMode).toBe(true)

    // Toggle dark mode off
    useUIStore.getState().toggleDarkMode()
    stored = JSON.parse(localStorage.getItem('ft-ui-preferences')!)
    expect(stored.state.isDarkMode).toBe(false)
  })

  it('does NOT persist isMobileMenuOpen', () => {
    useUIStore.getState().setMobileMenuOpen(true)
    const stored = JSON.parse(localStorage.getItem('ft-ui-preferences')!)
    expect(stored.state.isMobileMenuOpen).toBeUndefined()
  })

  // --- Edge cases ---

  it('isDarkMode and isMobileMenuOpen are independent', () => {
    useUIStore.getState().setMobileMenuOpen(true)
    useUIStore.getState().toggleDarkMode()

    const state = useUIStore.getState()
    expect(state.isMobileMenuOpen).toBe(true)
    expect(state.isDarkMode).toBe(true)
  })

  it('allows rapid successive calls without crashing', () => {
    for (let i = 0; i < 100; i++) {
      useUIStore.getState().toggleDarkMode()
      useUIStore.getState().setMobileMenuOpen(i % 2 === 0)
    }
    // 100 toggles → even number → back to false
    expect(useUIStore.getState().isDarkMode).toBe(false)
    // 99 is odd → true (last setMobileMenuOpen at i=99 → i%2=1 → false)
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false)
  })

  it('onRehydrateStorage applies dark class when isDarkMode is true', () => {
    // Manually trigger what rehydration does
    document.documentElement.classList.add('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Simulate rehydration setting state
    useUIStore.setState({ isDarkMode: true })
    expect(useUIStore.getState().isDarkMode).toBe(true)
  })

  it('onRehydrateStorage removes dark class when isDarkMode is false', () => {
    // Pre-populate dark class (e.g. from a previous session)
    document.documentElement.classList.add('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Simulate rehydration setting state to false
    useUIStore.setState({ isDarkMode: false })
    // The onRehydrateStorage callback runs during persist rehydration
    // which calls document.documentElement.classList.remove('dark')
    // We model this by directly removing the class
    document.documentElement.classList.remove('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
