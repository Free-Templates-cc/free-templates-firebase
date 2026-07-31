import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../lib/analytics'

/**
 * Tracks a GA4 `page_view` on every route change.
 * Mount once inside the router (see App.tsx).
 */
export function usePageTracking(): void {
  const { pathname, search } = useLocation()

  useEffect(() => {
    void trackPageView(pathname + search)
  }, [pathname, search])
}
