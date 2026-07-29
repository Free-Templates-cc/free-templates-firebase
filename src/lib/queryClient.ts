import { QueryClient, onlineManager } from '@tanstack/react-query'

/**
 * Register the browser's online/offline status with React Query
 * so paused queries refetch automatically when connectivity returns.
 */
onlineManager.setEventListener((setOnline) => {
  const handleOnline = () => setOnline(true)
  const handleOffline = () => setOnline(false)

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  setOnline(navigator.onLine)

  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // 2s, 4s, capped at 10s
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
})
