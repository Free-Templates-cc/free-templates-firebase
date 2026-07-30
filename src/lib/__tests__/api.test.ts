import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  fetchTemplates,
  fetchTemplateBySlug,
  fetchRelatedTemplates,
  fetchDownloads,
  createCheckoutSession,
  cancelSubscription,
  reactivateSubscription,
  createBillingPortalSession,
  getDownloadUrl,
} from '../api'

// Mock fetch globally
const mockFetch = vi.fn()
globalThis.fetch = mockFetch

describe('api', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // -------------------------------------------------------------------------
  // fetchTemplates
  // -------------------------------------------------------------------------

  describe('fetchTemplates', () => {
    it('returns paginated results with default filters', async () => {
      const result = await fetchTemplates({
        search: '',
        category: '',
        framework: '',
        priceTier: 'all',
        sort: 'newest',
      })
      expect(result.items.length).toBeGreaterThan(0)
      expect(result.total).toBeGreaterThan(0)
      expect(result.page).toBe(1)
      expect(result.pageSize).toBe(9)
      expect(result.totalPages).toBeGreaterThan(0)
    })

    it('filters by search query', async () => {
      const result = await fetchTemplates({
        search: 'portfolio',
        category: '',
        framework: '',
        priceTier: 'all',
        sort: 'newest',
      })
      expect(
        result.items.every(
          (t) =>
            t.name.toLowerCase().includes('portfolio') ||
            t.description.toLowerCase().includes('portfolio') ||
            t.tags.some((tag) => tag.includes('portfolio')),
        ),
      ).toBe(true)
    })

    it('filters by category', async () => {
      const result = await fetchTemplates({
        search: '',
        category: 'Portfolio',
        framework: '',
        priceTier: 'all',
        sort: 'newest',
      })
      expect(result.items.every((t) => t.category === 'Portfolio')).toBe(true)
    })

    it('filters by framework', async () => {
      const result = await fetchTemplates({
        search: '',
        category: '',
        framework: 'Next.js',
        priceTier: 'all',
        sort: 'newest',
      })
      expect(result.items.every((t) => t.framework === 'Next.js')).toBe(true)
    })

    it('filters by premium price tier', async () => {
      const result = await fetchTemplates({
        search: '',
        category: '',
        framework: '',
        priceTier: 'premium',
        sort: 'newest',
      })
      expect(result.items.every((t) => t.priceTier === 'premium')).toBe(true)
    })

    it('filters by free price tier', async () => {
      const result = await fetchTemplates({
        search: '',
        category: '',
        framework: '',
        priceTier: 'free',
        sort: 'newest',
      })
      expect(result.items.every((t) => t.priceTier === 'free')).toBe(true)
    })

    it('sorts by popularity', async () => {
      const result = await fetchTemplates({
        search: '',
        category: '',
        framework: '',
        priceTier: 'all',
        sort: 'popular',
      })
      for (let i = 1; i < result.items.length; i++) {
        expect(result.items[i]!.downloads).toBeLessThanOrEqual(result.items[i - 1]!.downloads)
      }
    })

    it('sorts by name', async () => {
      const result = await fetchTemplates({
        search: '',
        category: '',
        framework: '',
        priceTier: 'all',
        sort: 'name',
      })
      for (let i = 1; i < result.items.length; i++) {
        expect(
          result.items[i]!.name.localeCompare(result.items[i - 1]!.name),
        ).toBeGreaterThanOrEqual(0)
      }
    })

    it('paginates correctly', async () => {
      // Page 1
      const page1 = await fetchTemplates(
        { search: '', category: '', framework: '', priceTier: 'all', sort: 'newest' },
        1,
        5,
      )
      expect(page1.items.length).toBeLessThanOrEqual(5)
      expect(page1.page).toBe(1)
      expect(page1.pageSize).toBe(5)

      // Page 2
      const page2 = await fetchTemplates(
        { search: '', category: '', framework: '', priceTier: 'all', sort: 'newest' },
        2,
        5,
      )
      expect(page2.page).toBe(2)

      // Ensure different items on different pages
      const page1Ids = page1.items.map((t) => t.id)
      const page2Ids = page2.items.map((t) => t.id)
      expect(page1Ids.some((id) => page2Ids.includes(id))).toBe(false)
    })

    it('injects placeholder images into results', async () => {
      const result = await fetchTemplates({
        search: '',
        category: '',
        framework: '',
        priceTier: 'all',
        sort: 'newest',
      })
      expect(result.items[0]!.mainImage).toContain('picsum.photos')
      expect(result.items[0]!.previewImages.length).toBe(5)
      expect(result.items[0]!.previewImages[0]).toContain('picsum.photos')
    })

    it('returns empty results for non-matching category', async () => {
      const result = await fetchTemplates({
        search: '',
        category: 'NonExistentCategory',
        framework: '',
        priceTier: 'all',
        sort: 'newest',
      })
      expect(result.items).toHaveLength(0)
      expect(result.total).toBe(0)
      expect(result.totalPages).toBe(1)
    })

    it('handles case-insensitive search', async () => {
      const result = await fetchTemplates({
        search: 'PORTFOLIO',
        category: '',
        framework: '',
        priceTier: 'all',
        sort: 'newest',
      })
      expect(result.items.length).toBeGreaterThan(0)
    })
  })

  // -------------------------------------------------------------------------
  // fetchTemplateBySlug
  // -------------------------------------------------------------------------

  describe('fetchTemplateBySlug', () => {
    it('returns a template by slug', async () => {
      const template = await fetchTemplateBySlug('portfolio-pro')
      expect(template).not.toBeNull()
      expect(template!.slug).toBe('portfolio-pro')
      expect(template!.name).toBe('Portfolio Pro')
    })

    it('injects placeholder images', async () => {
      const template = await fetchTemplateBySlug('portfolio-pro')
      expect(template!.mainImage).toContain('picsum.photos')
    })

    it('returns null for non-existent slug', async () => {
      const template = await fetchTemplateBySlug('non-existent-template')
      expect(template).toBeNull()
    })

    it('returns null for empty slug', async () => {
      const template = await fetchTemplateBySlug('')
      expect(template).toBeNull()
    })
  })

  // -------------------------------------------------------------------------
  // fetchRelatedTemplates
  // -------------------------------------------------------------------------

  describe('fetchRelatedTemplates', () => {
    it('returns related templates from the same category', async () => {
      const related = await fetchRelatedTemplates('portfolio-pro', 'Portfolio')
      expect(related.length).toBeGreaterThan(0)
      expect(related.every((t) => t.category === 'Portfolio')).toBe(true)
    })

    it('excludes the current template', async () => {
      const related = await fetchRelatedTemplates('portfolio-pro', 'Portfolio')
      expect(related.every((t) => t.slug !== 'portfolio-pro')).toBe(true)
    })

    it('respects the limit parameter', async () => {
      const related = await fetchRelatedTemplates('portfolio-pro', 'Portfolio', 2)
      expect(related.length).toBeLessThanOrEqual(2)
    })

    it('returns empty array for category with no other templates', async () => {
      // Use a slug that doesn't exist in the mock data for a category with only one template
      const related = await fetchRelatedTemplates('portfolio-pro', 'NonExistent')
      expect(related).toHaveLength(0)
    })

    it('injects images into related templates', async () => {
      const related = await fetchRelatedTemplates('portfolio-pro', 'Portfolio')
      if (related.length > 0) {
        expect(related[0]!.mainImage).toContain('picsum.photos')
      }
    })
  })

  // -------------------------------------------------------------------------
  // fetchDownloads
  // -------------------------------------------------------------------------

  describe('fetchDownloads', () => {
    it('returns downloads for a given userId', async () => {
      const downloads = await fetchDownloads('mock-user')
      expect(downloads.length).toBeGreaterThan(0)
      expect(downloads.every((d) => d.userId === 'mock-user')).toBe(true)
    })

    it('returns empty array for unknown userId', async () => {
      const downloads = await fetchDownloads('unknown-user')
      expect(downloads).toHaveLength(0)
    })
  })

  // -------------------------------------------------------------------------
  // Cloud Function helpers
  // -------------------------------------------------------------------------

  describe('Cloud Function helpers', () => {
    const PROJECT_ID = 'test-project'
    const RESOLVED_REGION = 'europe-west1'

    function mockFunctionSuccess(data: unknown) {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => data,
      })
    }

    function mockFunctionError(status: number, error: string) {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status,
        json: async () => ({ error }),
      })
    }

    beforeEach(() => {
      // Ensure no emulators by clearing the env
      delete import.meta.env.VITE_USE_FIREBASE_EMULATORS
    })

    describe('createCheckoutSession', () => {
      it('returns checkout URL on success', async () => {
        mockFunctionSuccess({ url: 'https://checkout.stripe.com/test' })
        const result = await createCheckoutSession('uid123', 'monthly')
        expect(result.url).toBe('https://checkout.stripe.com/test')
        expect(mockFetch).toHaveBeenCalledWith(
          `https://${RESOLVED_REGION}-${PROJECT_ID}.cloudfunctions.net/createCheckoutSession`,
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ uid: 'uid123', plan: 'monthly' }),
          }),
        )
      })

      it('throws on error response', async () => {
        mockFunctionError(400, 'Invalid plan')
        await expect(createCheckoutSession('uid123', 'invalid')).rejects.toThrow('Invalid plan')
      })

      it('passes custom success/cancel URLs', async () => {
        mockFunctionSuccess({ url: 'https://checkout.stripe.com/test' })
        await createCheckoutSession(
          'uid123',
          'monthly',
          'https://example.com/success',
          'https://example.com/cancel',
        )
        const callBody = JSON.parse(mockFetch.mock.calls[0]![1]!.body as string)
        expect(callBody.successUrl).toBe('https://example.com/success')
        expect(callBody.cancelUrl).toBe('https://example.com/cancel')
      })
    })

    describe('cancelSubscription', () => {
      it('returns cancellation details on success', async () => {
        mockFunctionSuccess({
          canceledAt: '2026-08-30T00:00:00Z',
          currentPeriodEnd: '2026-08-30T00:00:00Z',
          status: 'canceled',
        })
        const result = await cancelSubscription('uid123')
        expect(result.status).toBe('canceled')
        expect(result.canceledAt).toBe('2026-08-30T00:00:00Z')
      })

      it('throws on error', async () => {
        mockFunctionError(500, 'Server error')
        await expect(cancelSubscription('uid123')).rejects.toThrow('Server error')
      })
    })

    describe('reactivateSubscription', () => {
      it('returns reactivation details on success', async () => {
        mockFunctionSuccess({
          status: 'active',
          currentPeriodEnd: '2026-08-30T00:00:00Z',
        })
        const result = await reactivateSubscription('uid123')
        expect(result.status).toBe('active')
      })

      it('throws on error', async () => {
        mockFunctionError(404, 'Subscription not found')
        await expect(reactivateSubscription('uid456')).rejects.toThrow('Subscription not found')
      })
    })

    describe('createBillingPortalSession', () => {
      it('returns portal URL on success', async () => {
        mockFunctionSuccess({ url: 'https://billing.stripe.com/test' })
        const result = await createBillingPortalSession('uid123')
        expect(result.url).toBe('https://billing.stripe.com/test')
      })

      it('throws on error', async () => {
        mockFunctionError(403, 'Forbidden')
        await expect(createBillingPortalSession('uid999')).rejects.toThrow('Forbidden')
      })
    })

    describe('getDownloadUrl', () => {
      it('returns download URL on success', async () => {
        mockFunctionSuccess({ url: 'https://storage.example.com/file.zip', downloads: 5 })
        const result = await getDownloadUrl('template-1', 'uid123')
        expect(result.url).toBe('https://storage.example.com/file.zip')
        expect(result.downloads).toBe(5)
      })

      it('works without uid', async () => {
        mockFunctionSuccess({ url: 'https://storage.example.com/file.zip', downloads: 3 })
        const result = await getDownloadUrl('template-1')
        expect(result.url).toBeDefined()
      })

      it('throws on error', async () => {
        mockFunctionError(401, 'Unauthorized')
        await expect(getDownloadUrl('premium-template', 'guest')).rejects.toThrow('Unauthorized')
      })
    })
  })
})
