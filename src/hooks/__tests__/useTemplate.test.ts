import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { type ReactNode } from 'react'
import { useTemplate, useRelatedTemplates } from '../useTemplate'
import type { Template } from '../../types'
import * as api from '../../lib/api'

vi.mock('../../lib/api', () => ({
  fetchTemplateBySlug: vi.fn(),
  fetchRelatedTemplates: vi.fn(),
  fetchTemplates: vi.fn(),
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

describe('useTemplate', () => {
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

  it('fetches a template by slug', async () => {
    ;(api.fetchTemplateBySlug as Mock).mockResolvedValue(mockTemplate)

    const { result } = renderHook(() => useTemplate('portfolio-pro'), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.fetchTemplateBySlug).toHaveBeenCalledWith('portfolio-pro')
    expect(result.current.data).toEqual(mockTemplate)
  })

  it('returns null when template is not found', async () => {
    ;(api.fetchTemplateBySlug as Mock).mockResolvedValue(null)

    const { result } = renderHook(() => useTemplate('nonexistent'), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeNull()
  })

  it('does not fetch when slug is empty', () => {
    renderHook(() => useTemplate(''), { wrapper: Wrapper })
    expect(api.fetchTemplateBySlug).not.toHaveBeenCalled()
  })

  it('returns loading state initially', async () => {
    ;(api.fetchTemplateBySlug as Mock).mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useTemplate('portfolio-pro'), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(true))
  })

  it('returns error state on failure', async () => {
    ;(api.fetchTemplateBySlug as Mock).mockRejectedValue(new Error('Not found'))

    const { result } = renderHook(() => useTemplate('portfolio-pro'), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeDefined()
  })

  it('refetches when slug changes', async () => {
    ;(api.fetchTemplateBySlug as Mock).mockImplementation(async (slug: string) => {
      if (slug === 'portfolio-pro') return mockTemplate
      return { ...mockTemplate, id: '2', slug: 'business-plus', name: 'Business Plus' }
    })

    const { result, rerender } = renderHook(({ slug }) => useTemplate(slug), {
      initialProps: { slug: 'portfolio-pro' },
      wrapper: Wrapper,
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.name).toBe('Portfolio Pro')
    expect(api.fetchTemplateBySlug).toHaveBeenCalledTimes(1)

    rerender({ slug: 'business-plus' })

    await waitFor(() => expect(result.current.data?.name).toBe('Business Plus'))
    expect(api.fetchTemplateBySlug).toHaveBeenCalledTimes(2)
    expect(api.fetchTemplateBySlug).toHaveBeenCalledWith('business-plus')
  })
})

describe('useRelatedTemplates', () => {
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

  const relatedTemplates: Template[] = [
    { ...mockTemplate, id: '2', name: 'DevPortfolio', slug: 'dev-portfolio' },
  ]

  it('fetches related templates by category', async () => {
    ;(api.fetchRelatedTemplates as Mock).mockResolvedValue(relatedTemplates)

    const { result } = renderHook(() => useRelatedTemplates('portfolio-pro', 'Portfolio'), {
      wrapper: Wrapper,
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.fetchRelatedTemplates).toHaveBeenCalledWith('portfolio-pro', 'Portfolio')
    expect(result.current.data).toEqual(relatedTemplates)
  })

  it('returns empty array when no related templates exist', async () => {
    ;(api.fetchRelatedTemplates as Mock).mockResolvedValue([])

    const { result } = renderHook(() => useRelatedTemplates('portfolio-pro', 'Unknown'), {
      wrapper: Wrapper,
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([])
  })

  it('does not fetch when currentSlug is empty', () => {
    renderHook(() => useRelatedTemplates('', 'Portfolio'), { wrapper: Wrapper })
    expect(api.fetchRelatedTemplates).not.toHaveBeenCalled()
  })

  it('does not fetch when category is empty', () => {
    renderHook(() => useRelatedTemplates('portfolio-pro', ''), { wrapper: Wrapper })
    expect(api.fetchRelatedTemplates).not.toHaveBeenCalled()
  })

  it('does not fetch when both params are empty', () => {
    renderHook(() => useRelatedTemplates('', ''), { wrapper: Wrapper })
    expect(api.fetchRelatedTemplates).not.toHaveBeenCalled()
  })
})
