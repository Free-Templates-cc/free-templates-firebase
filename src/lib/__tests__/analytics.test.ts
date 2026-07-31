import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mocks = vi.hoisted(() => ({
  getAnalytics: vi.fn(() => ({ mockAnalytics: true })),
  logEvent: vi.fn(),
}))

vi.mock('firebase/analytics', () => ({
  getAnalytics: mocks.getAnalytics,
  logEvent: mocks.logEvent,
}))

vi.mock('./firebase', () => ({
  default: { name: '[DEFAULT]' },
}))

import {
  isAnalyticsEnabled,
  trackPageView,
  trackTemplateDownload,
  trackCheckoutStarted,
  trackSignUp,
  resetAnalyticsForTests,
} from '../analytics'

describe('analytics', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_FIREBASE_MEASUREMENT_ID', '')
    mocks.getAnalytics.mockClear()
    mocks.logEvent.mockClear()
    resetAnalyticsForTests()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
    resetAnalyticsForTests()
  })

  describe('isAnalyticsEnabled', () => {
    it('returns false when measurement ID is missing', () => {
      vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'test-project')
      vi.stubEnv('VITE_FIREBASE_MEASUREMENT_ID', '')
      expect(isAnalyticsEnabled()).toBe(false)
    })

    it('returns false when project ID is missing', () => {
      vi.stubEnv('VITE_FIREBASE_PROJECT_ID', '')
      vi.stubEnv('VITE_FIREBASE_MEASUREMENT_ID', 'G-TEST123')
      expect(isAnalyticsEnabled()).toBe(false)
    })

    it('returns true when both project ID and measurement ID are set', () => {
      vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'test-project')
      vi.stubEnv('VITE_FIREBASE_MEASUREMENT_ID', 'G-TEST123')
      expect(isAnalyticsEnabled()).toBe(true)
    })
  })

  describe('tracking is a no-op when analytics is not configured', () => {
    it('trackPageView', async () => {
      await expect(trackPageView('/templates')).resolves.toBeUndefined()
      expect(mocks.getAnalytics).not.toHaveBeenCalled()
      expect(mocks.logEvent).not.toHaveBeenCalled()
    })

    it('trackTemplateDownload', async () => {
      await trackTemplateDownload({ id: 't1', name: 'Test', priceTier: 'free' })
      expect(mocks.getAnalytics).not.toHaveBeenCalled()
      expect(mocks.logEvent).not.toHaveBeenCalled()
    })

    it('trackCheckoutStarted', async () => {
      await trackCheckoutStarted('premium', 'monthly')
      expect(mocks.logEvent).not.toHaveBeenCalled()
    })

    it('trackSignUp', async () => {
      await trackSignUp('google')
      expect(mocks.logEvent).not.toHaveBeenCalled()
    })
  })

  describe('tracking when analytics is configured', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'test-project')
      vi.stubEnv('VITE_FIREBASE_MEASUREMENT_ID', 'G-TEST123')
    })

    it('trackPageView logs a page_view event with path params', async () => {
      await trackPageView('/templates')
      expect(mocks.getAnalytics).toHaveBeenCalledTimes(1)
      expect(mocks.logEvent).toHaveBeenCalledWith(
        expect.anything(),
        'page_view',
        expect.objectContaining({ page_path: '/templates' }),
      )
    })

    it('trackTemplateDownload logs template_download with template params', async () => {
      await trackTemplateDownload({
        id: 't1',
        name: 'Portfolio Pro',
        priceTier: 'premium',
        category: 'portfolio',
      })
      expect(mocks.logEvent).toHaveBeenCalledWith(
        expect.anything(),
        'template_download',
        expect.objectContaining({
          template_id: 't1',
          template_name: 'Portfolio Pro',
          price_tier: 'premium',
          category: 'portfolio',
        }),
      )
    })

    it('trackCheckoutStarted logs begin_checkout with plan and interval', async () => {
      await trackCheckoutStarted('premium', 'yearly')
      expect(mocks.logEvent).toHaveBeenCalledWith(
        expect.anything(),
        'begin_checkout',
        expect.objectContaining({ plan: 'premium', billing_interval: 'yearly' }),
      )
    })

    it('trackSignUp logs sign_up with method', async () => {
      await trackSignUp('email')
      expect(mocks.logEvent).toHaveBeenCalledWith(
        expect.anything(),
        'sign_up',
        expect.objectContaining({ method: 'email' }),
      )
    })

    it('caches the analytics instance across events', async () => {
      await trackPageView('/')
      await trackPageView('/pricing')
      expect(mocks.getAnalytics).toHaveBeenCalledTimes(1)
      expect(mocks.logEvent).toHaveBeenCalledTimes(2)
    })

    it('swallows errors thrown by logEvent', async () => {
      mocks.logEvent.mockImplementationOnce(() => {
        throw new Error('boom')
      })
      await expect(trackPageView('/')).resolves.toBeUndefined()
    })

    it('resetAnalyticsForTests clears the cached instance', async () => {
      await trackPageView('/')
      resetAnalyticsForTests()
      await trackPageView('/')
      expect(mocks.getAnalytics).toHaveBeenCalledTimes(2)
    })

    it('caches null and swallows errors when getAnalytics throws', async () => {
      mocks.getAnalytics.mockImplementationOnce(() => {
        throw new Error('analytics unavailable')
      })
      await expect(trackPageView('/')).resolves.toBeUndefined()
      // Failed resolution is cached as null — no retry, no events
      await trackPageView('/pricing')
      expect(mocks.getAnalytics).toHaveBeenCalledTimes(1)
      expect(mocks.logEvent).not.toHaveBeenCalled()
    })
  })
})
