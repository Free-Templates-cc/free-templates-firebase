import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { WifiOff } from 'lucide-react'

/**
 * A small banner that appears when the browser detects the user is offline.
 * Informs users that some features may be unavailable until connectivity resumes.
 */
export function NetworkStatusBanner() {
  const online = useNetworkStatus()

  if (online) return null

  return (
    <div
      role="alert"
      className="flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-center text-sm font-medium text-white"
    >
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>
        You are offline. Some features may be unavailable until your connection is restored.
      </span>
    </div>
  )
}
