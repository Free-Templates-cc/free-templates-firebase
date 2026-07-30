import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore, type UIState } from '../uiStore'

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

  it('onRehydrateStorage applies dark class when isDarkMode is true', async () => {
    // Clear state first
    document.documentElement.classList.remove('dark')

    // Set up localStorage to simulate persisted dark mode
    localStorage.setItem('ft-ui-preferences', JSON.stringify({ state: { isDarkMode: true } }))

    // Manually trigger rehydration so onRehydrateStorage runs
    await useUIStore.persist.rehydrate()

    // The callback should have added the dark class
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('onRehydrateStorage removes dark class when isDarkMode is false', () => {
    // Pre-populate dark class (e.g. from a previous session)
    document.documentElement.classList.add('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Access the real onRehydrateStorage callback via persist options
    const options = useUIStore.persist.getOptions()
    const onRehydrate = options.onRehydrateStorage

    // Invoke onRehydrate with a state where isDarkMode is false
    // This triggers the else branch → classList.remove('dark')
    if (onRehydrate) {
      const afterRehydrate = onRehydrate({
        isDarkMode: false,
        isMobileMenuOpen: false,
      } as UIState)
      afterRehydrate?.({ isDarkMode: false, isMobileMenuOpen: false } as UIState, undefined)
    }

    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('onRehydrateStorage handles null/undefined state gracefully (first visit)', () => {
    // Pre-populate dark class
    document.documentElement.classList.add('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Simulate first visit: no stored state → onRehydrateStorage called with undefined
    const options = useUIStore.persist.getOptions()
    const onRehydrate = options.onRehydrateStorage

    // When state is undefined, state?.isDarkMode is falsy → else branch → remove class
    if (onRehydrate) {
      const afterRehydrate = onRehydrate(undefined as unknown as UIState)
      afterRehydrate?.(undefined, undefined)
    }

    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
