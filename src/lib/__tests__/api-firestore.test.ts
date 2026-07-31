import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mocks = vi.hoisted(() => ({
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  collection: vi.fn(() => 'templatesRef'),
  query: vi.fn(() => 'queryRef'),
  where: vi.fn(() => 'whereRef'),
  orderBy: vi.fn(() => 'orderByRef'),
  limit: vi.fn(() => 'limitRef'),
}))

vi.mock('firebase/firestore', () => ({
  collection: mocks.collection,
  query: mocks.query,
  where: mocks.where,
  orderBy: mocks.orderBy,
  limit: mocks.limit,
  getDocs: mocks.getDocs,
  addDoc: mocks.addDoc,
  // firebase.ts imports these — vitest v4 validates mock exports against the
  // real module's evaluation, so they must exist
  getFirestore: vi.fn(() => ({ mockFirestore: true })),
  connectFirestoreEmulator: vi.fn(),
}))

vi.mock('./firebase', () => ({
  db: { mockDb: true },
}))

// Stub BEFORE '../api' is statically imported so USE_FIRESTORE evaluates to
// true at module load time.
vi.hoisted(() => {
  vi.stubEnv('VITE_USE_FIREBASE_DATA', 'true')
})

import {
  fetchTemplates,
  fetchTemplateBySlug,
  fetchRelatedTemplates,
  fetchDownloads,
  recordDownload,
  createCheckoutSession,
} from '../api'

const templateData = {
  name: 'Portfolio Pro',
  slug: 'portfolio-pro',
  description: 'A modern portfolio template.',
  category: 'Portfolio',
  framework: 'Next.js',
  priceTier: 'premium',
  demoUrl: 'https://demo.example.com/portfolio-pro',
  githubUrl: 'https://github.com/example/portfolio-pro',
  features: ['Fully responsive'],
  tags: ['portfolio'],
  mainImage: '',
  previewImages: [],
  downloadUrl: '',
  downloads: 3421,
  published: true,
  createdAt: { seconds: 1690000000, nanoseconds: 0 },
  updatedAt: { seconds: 1690000000, nanoseconds: 0 },
}

function makeSnapshot(docs: Array<{ id: string; data: Record<string, unknown> }>) {
  return {
    empty: docs.length === 0,
    docs: docs.map((d) => ({ id: d.id, data: () => d.data })),
  }
}

describe('api — Firestore mode (VITE_USE_FIREBASE_DATA=true)', () => {
  beforeEach(() => {
    mocks.getDocs.mockReset()
    mocks.addDoc.mockReset()
    mocks.collection.mockClear()
    mocks.query.mockClear()
    mocks.where.mockClear()
    mocks.orderBy.mockClear()
    mocks.limit.mockClear()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  describe('fetchTemplates', () => {
    it('queries Firestore and returns paginated, image-injected results', async () => {
      mocks.getDocs.mockResolvedValue(
        makeSnapshot([
          {
            id: 'a',
            data: {
              ...templateData,
              slug: 'alpha',
              name: 'Alpha',
              downloads: 10,
              createdAt: { seconds: 1, nanoseconds: 0 },
            },
          },
          {
            id: 'b',
            data: {
              ...templateData,
              slug: 'beta',
              name: 'Beta',
              downloads: 20,
              createdAt: { seconds: 2, nanoseconds: 0 },
            },
          },
          {
            id: 'c',
            data: {
              ...templateData,
              slug: 'gamma',
              name: 'Gamma',
              downloads: 30,
              createdAt: { seconds: 3, nanoseconds: 0 },
            },
          },
        ]),
      )

      const result = await fetchTemplates(
        { search: '', category: '', framework: '', priceTier: 'all', sort: 'newest' },
        1,
        2,
      )

      expect(mocks.collection).toHaveBeenCalledWith(expect.anything(), 'templates')
      expect(mocks.where).toHaveBeenCalledWith('published', '==', true)
      expect(result.total).toBe(3)
      expect(result.page).toBe(1)
      expect(result.pageSize).toBe(2)
      expect(result.totalPages).toBe(2)
      expect(result.items).toHaveLength(2)
      // Sorted newest first (createdAt desc)
      expect(result.items[0]?.slug).toBe('gamma')
      // injectImages ran — placeholder images added
      expect(result.items[0]?.mainImage).toContain('picsum.photos/seed/gamma')
      expect(result.items[0]?.previewImages).toHaveLength(5)
    })

    it('applies client-side search and name sorting', async () => {
      mocks.getDocs.mockResolvedValue(
        makeSnapshot([
          { id: 'a', data: { ...templateData, slug: 'alpha', name: 'Alpha' } },
          { id: 'b', data: { ...templateData, slug: 'beta', name: 'Beta' } },
        ]),
      )

      const result = await fetchTemplates(
        { search: 'alpha', category: '', framework: '', priceTier: 'all', sort: 'name' },
        1,
        9,
      )

      expect(result.items.map((t) => t.name)).toEqual(['Alpha'])
      expect(result.total).toBe(1)
    })

    it('sorts by popularity (downloads desc)', async () => {
      mocks.getDocs.mockResolvedValue(
        makeSnapshot([
          { id: 'a', data: { ...templateData, slug: 'alpha', downloads: 10 } },
          { id: 'b', data: { ...templateData, slug: 'beta', downloads: 999 } },
        ]),
      )

      const result = await fetchTemplates(
        { search: '', category: '', framework: '', priceTier: 'all', sort: 'popular' },
        1,
        9,
      )

      expect(result.items.map((t) => t.slug)).toEqual(['beta', 'alpha'])
    })

    it('adds category, framework, and priceTier constraints to the query', async () => {
      mocks.getDocs.mockResolvedValue(makeSnapshot([]))

      await fetchTemplates(
        {
          search: '',
          category: 'Portfolio',
          framework: 'Next.js',
          priceTier: 'free',
          sort: 'newest',
        },
        1,
        9,
      )

      expect(mocks.where).toHaveBeenCalledWith('published', '==', true)
      expect(mocks.where).toHaveBeenCalledWith('category', '==', 'Portfolio')
      expect(mocks.where).toHaveBeenCalledWith('framework', '==', 'Next.js')
      expect(mocks.where).toHaveBeenCalledWith('priceTier', '==', 'free')
      expect(mocks.query).toHaveBeenCalledWith(
        'templatesRef',
        'whereRef',
        'whereRef',
        'whereRef',
        'whereRef',
      )
    })
  })

  describe('fetchTemplateBySlug', () => {
    it('returns the template with images when found', async () => {
      mocks.getDocs.mockResolvedValue(makeSnapshot([{ id: 'a', data: templateData }]))

      const template = await fetchTemplateBySlug('portfolio-pro')

      expect(mocks.where).toHaveBeenCalledWith('slug', '==', 'portfolio-pro')
      expect(mocks.where).toHaveBeenCalledWith('published', '==', true)
      expect(mocks.limit).toHaveBeenCalledWith(1)
      expect(template?.id).toBe('a')
      expect(template?.name).toBe('Portfolio Pro')
      expect(template?.mainImage).toContain('picsum.photos/seed/portfolio-pro')
    })

    it('returns null when no matching template exists', async () => {
      mocks.getDocs.mockResolvedValue(makeSnapshot([]))

      expect(await fetchTemplateBySlug('does-not-exist')).toBeNull()
    })
  })

  describe('fetchRelatedTemplates', () => {
    it('excludes the current template and respects the result limit', async () => {
      mocks.getDocs.mockResolvedValue(
        makeSnapshot([
          { id: 'a', data: { ...templateData, slug: 'current' } },
          { id: 'b', data: { ...templateData, slug: 'related-1' } },
          { id: 'c', data: { ...templateData, slug: 'related-2' } },
          { id: 'd', data: { ...templateData, slug: 'related-3' } },
        ]),
      )

      const result = await fetchRelatedTemplates('current', 'Portfolio', 2)

      expect(mocks.where).toHaveBeenCalledWith('category', '==', 'Portfolio')
      expect(mocks.limit).toHaveBeenCalledWith(3)
      expect(result.map((t) => t.slug)).toEqual(['related-1', 'related-2'])
      expect(result[0]?.mainImage).toContain('picsum.photos/seed/related-1')
    })
  })

  describe('recordDownload', () => {
    it('writes a download record to the downloads collection', async () => {
      mocks.addDoc.mockResolvedValue({ id: 'dl-new' })

      await recordDownload(
        {
          id: '2',
          name: 'Business Plus',
          slug: 'business-plus',
          category: 'Business',
          priceTier: 'premium',
        },
        'u1',
      )

      expect(mocks.collection).toHaveBeenCalledWith(expect.anything(), 'downloads')
      expect(mocks.addDoc).toHaveBeenCalledTimes(1)
      expect(mocks.addDoc).toHaveBeenCalledWith('templatesRef', {
        userId: 'u1',
        templateId: '2',
        templateName: 'Business Plus',
        templateSlug: 'business-plus',
        templateCategory: 'Business',
        priceTier: 'premium',
        downloadedAt: expect.any(String),
      })
    })

    it('swallows Firestore errors so the download is never blocked', async () => {
      mocks.addDoc.mockRejectedValue(new Error('permission-denied'))

      await expect(
        recordDownload(
          {
            id: '2',
            name: 'Business Plus',
            slug: 'business-plus',
            category: 'Business',
            priceTier: 'premium',
          },
          'u1',
        ),
      ).resolves.toBeUndefined()
    })
  })

  describe('fetchDownloads', () => {
    it('queries downloads by userId and maps the docs', async () => {
      mocks.getDocs.mockResolvedValue(
        makeSnapshot([
          {
            id: 'dl-1',
            data: { userId: 'u1', templateId: '2', downloadedAt: '2026-07-01T10:00:00.000Z' },
          },
        ]),
      )

      const result = await fetchDownloads('u1')

      expect(mocks.collection).toHaveBeenCalledWith(expect.anything(), 'downloads')
      expect(mocks.where).toHaveBeenCalledWith('userId', '==', 'u1')
      expect(mocks.orderBy).toHaveBeenCalledWith('downloadedAt', 'desc')
      expect(result).toHaveLength(1)
      expect(result[0]?.id).toBe('dl-1')
      expect(result[0]?.templateId).toBe('2')
    })
  })

  describe('Cloud Function helpers — emulator mode', () => {
    it('uses the emulator URL when VITE_USE_FIREBASE_EMULATORS=true', async () => {
      vi.stubEnv('VITE_USE_FIREBASE_EMULATORS', 'true')
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ url: 'https://checkout.stripe.com/c/pay/test' }),
      })
      vi.stubGlobal('fetch', mockFetch)

      const result = await createCheckoutSession('uid123', 'monthly')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://127.0.0.1:5001/test-project/europe-west1/createCheckoutSession',
        expect.objectContaining({ method: 'POST' }),
      )
      expect(result.url).toBe('https://checkout.stripe.com/c/pay/test')
    })
  })
})
