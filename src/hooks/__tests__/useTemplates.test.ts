import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { type ReactNode } from 'react'
import { useTemplates, filtersFromParams } from '../useTemplates'
import type { Template, TemplateFilters } from '../../types'
import * as api from '../../lib/api'

vi.mock('../../lib/api', () => ({
  fetchTemplates: vi.fn(),
  fetchTemplateBySlug: vi.fn(),
  fetchRelatedTemplates: vi.fn(),
  fetchDownloads: vi.fn(),
  createCheckoutSession: vi.fn(),
  cancelSubscription: vi.fn(),
  reactivateSubscription: vi.fn(),
  createBillingPortalSession: vi.fn(),
  getDownloadUrl: vi.fn(),
}))

const mockTemplate: Template = {
  id: '1',
  name: 'Portfolio Pro',
  slug: 'portfolio-pro',
  description: 'A modern portfolio template',
  category: 'Portfolio',
  framework: 'Next.js',
  priceTier: 'premium',
  features: ['Responsive', 'Dark mode'],
  tags: ['portfolio', 'creative'],
  mainImage: 'https://picsum.photos/seed/portfolio-pro/640/360',
  previewImages: [],
  downloadUrl: '',
  downloads: 3421,
  published: true,
  createdAt: { seconds: 1690000000, nanoseconds: 0 } as any,
  updatedAt: { seconds: 1690000000, nanoseconds: 0 } as any,
}

const defaultFilters: TemplateFilters = {
  search: '',
  category: '',
  framework: '',
  priceTier: 'all',
  sort: 'newest',
}

describe('useTemplates', () => {
  let Wrapper: ({ children }: { children: ReactNode }) => React.JSX.Element

  beforeEach(() => {
    vi.clearAllMocks()
    const qc = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    })
    Wrapper = function Wrapper({ children }: { children: ReactNode }) {
      return React.createElement(QueryClientProvider, { client: qc }, children)
    }
  })

  it('fetches templates with default filters', async () => {
    const mockData = {
      items: [mockTemplate],
      total: 1,
      page: 1,
      pageSize: 9,
      totalPages: 1,
    }
    ;(api.fetchTemplates as Mock).mockResolvedValue(mockData)

    const { result } = renderHook(() => useTemplates({ filters: defaultFilters }), {
      wrapper: Wrapper,
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.fetchTemplates).toHaveBeenCalledWith(defaultFilters, 1, 9)
    expect(result.current.data).toEqual(mockData)
  })

  it('passes page and pageSize params correctly', async () => {
    const mockData = {
      items: [],
      total: 0,
      page: 3,
      pageSize: 6,
      totalPages: 0,
    }
    ;(api.fetchTemplates as Mock).mockResolvedValue(mockData)

    const { result } = renderHook(
      () => useTemplates({ filters: defaultFilters, page: 3, pageSize: 6 }),
      { wrapper: Wrapper },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.fetchTemplates).toHaveBeenCalledWith(defaultFilters, 3, 6)
  })

  it('passes filters correctly', async () => {
    const filters: TemplateFilters = {
      search: 'portfolio',
      category: 'Portfolio',
      framework: 'Next.js',
      priceTier: 'premium',
      sort: 'popular',
    }
    const mockData = {
      items: [mockTemplate],
      total: 1,
      page: 1,
      pageSize: 9,
      totalPages: 1,
    }
    ;(api.fetchTemplates as Mock).mockResolvedValue(mockData)

    const { result } = renderHook(() => useTemplates({ filters }), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.fetchTemplates).toHaveBeenCalledWith(filters, 1, 9)
  })

  it('returns loading state initially', async () => {
    ;(api.fetchTemplates as Mock).mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useTemplates({ filters: defaultFilters }), {
      wrapper: Wrapper,
    })

    await waitFor(() => expect(result.current.isLoading).toBe(true))
  })

  it('returns error state on failure', async () => {
    ;(api.fetchTemplates as Mock).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useTemplates({ filters: defaultFilters }), {
      wrapper: Wrapper,
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeDefined()
  })

  it('updates when filters change', async () => {
    const filters1: TemplateFilters = {
      search: '',
      category: '',
      framework: '',
      priceTier: 'all',
      sort: 'newest',
    }
    const filters2: TemplateFilters = {
      search: 'portfolio',
      category: '',
      framework: '',
      priceTier: 'all',
      sort: 'newest',
    }

    const emptyData = { items: [], total: 0, page: 1, pageSize: 9, totalPages: 0 }
    const filteredData = { items: [mockTemplate], total: 1, page: 1, pageSize: 9, totalPages: 1 }

    ;(api.fetchTemplates as Mock).mockImplementation((filters: TemplateFilters) => {
      if (filters.search === 'portfolio') return Promise.resolve(filteredData)
      return Promise.resolve(emptyData)
    })

    const { result, rerender } = renderHook(({ filters }) => useTemplates({ filters }), {
      initialProps: { filters: filters1 },
      wrapper: Wrapper,
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.total).toBe(0)

    rerender({ filters: filters2 })

    await waitFor(() => expect(result.current.data?.total).toBe(1))
    expect(api.fetchTemplates).toHaveBeenCalledTimes(2)
  })

  it('keeps previous data as placeholder while fetching next page', async () => {
    const page1Data = { items: [mockTemplate], total: 2, page: 1, pageSize: 1, totalPages: 2 }
    const page2Data = {
      items: [{ ...mockTemplate, id: '2', name: 'Business Plus', slug: 'business-plus' }],
      total: 2,
      page: 2,
      pageSize: 1,
      totalPages: 2,
    }

    ;(api.fetchTemplates as Mock)
      .mockResolvedValueOnce(page1Data)
      .mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(() => resolve(page2Data), 500)),
      )

    const { result, rerender } = renderHook(
      ({ page }) => useTemplates({ filters: defaultFilters, page, pageSize: 1 }),
      { initialProps: { page: 1 }, wrapper: Wrapper },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.page).toBe(1)

    rerender({ page: 2 })

    // Should show page 1 data as placeholder while page 2 loads
    await waitFor(() => expect(result.current.isPlaceholderData).toBe(true))
    expect(result.current.data?.page).toBe(1)
  })
})

describe('filtersFromParams', () => {
  it('returns default values for empty params', () => {
    const params = new URLSearchParams('')
    const filters = filtersFromParams(params)
    expect(filters).toEqual({
      search: '',
      category: '',
      framework: '',
      priceTier: 'all',
      sort: 'newest',
    })
  })

  it('parses search param', () => {
    const filters = filtersFromParams(new URLSearchParams('search=portfolio'))
    expect(filters.search).toBe('portfolio')
  })

  it('parses category param', () => {
    const filters = filtersFromParams(new URLSearchParams('category=Portfolio'))
    expect(filters.category).toBe('Portfolio')
  })

  it('parses framework param', () => {
    const filters = filtersFromParams(new URLSearchParams('framework=Next.js'))
    expect(filters.framework).toBe('Next.js')
  })

  it('parses priceTier param', () => {
    const filters = filtersFromParams(new URLSearchParams('priceTier=premium'))
    expect(filters.priceTier).toBe('premium')
  })

  it('defaults priceTier to "all" for invalid values', () => {
    const filters = filtersFromParams(new URLSearchParams('priceTier=invalid'))
    expect(filters.priceTier).toBe('all')
  })

  it('parses sort param', () => {
    const filters = filtersFromParams(new URLSearchParams('sort=popular'))
    expect(filters.sort).toBe('popular')
  })

  it('defaults sort to "newest" for missing param', () => {
    const filters = filtersFromParams(new URLSearchParams(''))
    expect(filters.sort).toBe('newest')
  })

  it('defaults sort to "newest" for invalid values', () => {
    const filters = filtersFromParams(new URLSearchParams('sort=invalid'))
    expect(filters.sort).toBe('newest')
  })

  it('parses multiple params together', () => {
    const filters = filtersFromParams(
      new URLSearchParams(
        'search=react&category=Portfolio&framework=Next.js&priceTier=free&sort=name',
      ),
    )
    expect(filters).toEqual({
      search: 'react',
      category: 'Portfolio',
      framework: 'Next.js',
      priceTier: 'free',
      sort: 'name',
    })
  })

  it('handles URL-encoded values', () => {
    const filters = filtersFromParams(new URLSearchParams('search=next+js+template'))
    expect(filters.search).toBe('next js template')
  })

  it('ignires unknown params', () => {
    const filters = filtersFromParams(new URLSearchParams('search=test&unknown=value&another=123'))
    expect(filters.search).toBe('test')
    expect((filters as any).unknown).toBeUndefined()
  })
})
