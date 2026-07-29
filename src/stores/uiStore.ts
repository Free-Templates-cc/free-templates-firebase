import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  isDarkMode: boolean
  isMobileMenuOpen: boolean
  toggleDarkMode: () => void
  setMobileMenuOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      isMobileMenuOpen: false,
      toggleDarkMode: () =>
        set((state) => {
          const next = !state.isDarkMode
          if (next) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { isDarkMode: next }
        }),
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
    }),
    {
      name: 'ft-ui-preferences',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
      onRehydrateStorage: () => (state) => {
        if (state?.isDarkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },
    },
  ),
)
