/**
 * Analytics layer — Firebase Analytics (GA4).
 *
 * Lazy-initialized and fully optional:
 * - `firebase/analytics` is dynamically imported, so it only loads in browsers
 *   where tracking is enabled (keeps the main bundle lean).
 * - Tracking is a no-op until a real Firebase project + measurement ID are
 *   present in the environment (`VITE_FIREBASE_PROJECT_ID` +
 *   `VITE_FIREBASE_MEASUREMENT_ID`). This lets the app ship without
 *   credentials and automatically start tracking once `.env` is populated.
 * - All trackers are best-effort: failures are swallowed, never thrown.
 */

import type { Analytics } from 'firebase/analytics'
import app from './firebase'

let instance: Analytics | null | undefined // undefined = not resolved yet

/** True when a real Firebase project + measurement ID are configured. */
export function isAnalyticsEnabled(): boolean {
  if (typeof window === 'undefined') return false
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
  const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  return Boolean(projectId && measurementId)
}

/** Lazily resolve (and cache) the Analytics instance, or null if unavailable. */
async function getInstance(): Promise<Analytics | null> {
  if (instance !== undefined) return instance
  if (!isAnalyticsEnabled()) {
    instance = null
    return instance
  }
  try {
    const { getAnalytics } = await import('firebase/analytics')
    instance = getAnalytics(app)
  } catch {
    instance = null
  }
  return instance
}

async function track(name: string, params?: Record<string, unknown>): Promise<void> {
  const analytics = await getInstance()
  if (!analytics) return
  try {
    const { logEvent } = await import('firebase/analytics')
    logEvent(analytics, name, params)
  } catch {
    // Analytics is best-effort — never surface errors to app code.
  }
}

/** Reset the cached instance (test helper only). */
export function resetAnalyticsForTests(): void {
  instance = undefined
}

/** Standard GA4 page_view — call on every route change (SPA). */
export function trackPageView(pathname: string): Promise<void> {
  return track('page_view', {
    page_path: pathname,
    page_title: typeof document !== 'undefined' ? document.title : undefined,
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
  })
}

export interface TrackedTemplate {
  id: string
  name: string
  priceTier: string
  category?: string
}

/** Fired when a user downloads a template (free or premium). */
export function trackTemplateDownload(template: TrackedTemplate): Promise<void> {
  return track('template_download', {
    template_id: template.id,
    template_name: template.name,
    price_tier: template.priceTier,
    category: template.category,
  })
}

/** Fired when a user starts the Stripe Checkout flow. */
export function trackCheckoutStarted(
  planKey: string,
  billingInterval: 'monthly' | 'yearly',
): Promise<void> {
  return track('begin_checkout', {
    plan: planKey,
    billing_interval: billingInterval,
  })
}

/** Fired when a new account is created. */
export function trackSignUp(method: 'email' | 'google'): Promise<void> {
  return track('sign_up', { method })
}
