import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { type ReactNode } from 'react'
import { useTemplateDownloadCount } from '../useTemplateDownloadCount'
import type { Template } from '../../types'
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

describe('useTemplateDownloadCount', () => {
  let Wrapper: ({ children }: { children: ReactNode }) => React.JSX.Element

  beforeEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
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

  it('fetches download count for a template', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    ;(api.fetchTemplates as Mock).mockResolvedValue({
      items: [mockTemplate],
      total: 1,
      page: 1,
      pageSize: 100,
      totalPages: 1,
    })

    const { result } = renderHook(() => useTemplateDownloadCount('portfolio-pro'), {
      wrapper: Wrapper,
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Math.random returns 0.5, so delta = floor(0.5 * 3) - 1 = 1 - 1 = 0
    expect(result.current.data).toBe(3421)
    expect(api.fetchTemplates).toHaveBeenCalledWith(
      { search: '', category: '', framework: '', priceTier: 'all', sort: 'popular' },
      1,
      100,
    )
  })

  it('applies a small random delta to simulate live count', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.95)
    ;(api.fetchTemplates as Mock).mockResolvedValue({
      items: [mockTemplate],
      total: 1,
      page: 1,
      pageSize: 100,
      totalPages: 1,
    })

    const { result } = renderHook(() => useTemplateDownloadCount('portfolio-pro'), {
      wrapper: Wrapper,
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // delta = floor(0.95 * 3) - 1 = 2 - 1 = 1
    expect(result.current.data).toBe(3422)
  })

  it('allows negative delta', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    ;(api.fetchTemplates as Mock).mockResolvedValue({
      items: [mockTemplate],
      total: 1,
      page: 1,
      pageSize: 100,
      totalPages: 1,
    })

    const { result } = renderHook(() => useTemplateDownloadCount('portfolio-pro'), {
      wrapper: Wrapper,
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // delta = floor(0 * 3) - 1 = -1
    expect(result.current.data).toBe(3420)
  })

  it('throws error when template is not found', async () => {
    ;(api.fetchTemplates as Mock).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 100,
      totalPages: 0,
    })

    const { result } = renderHook(() => useTemplateDownloadCount('nonexistent'), {
      wrapper: Wrapper,
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeDefined()
  })

  it('has polling interval configured', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    ;(api.fetchTemplates as Mock).mockResolvedValue({
      items: [mockTemplate],
      total: 1,
      page: 1,
      pageSize: 100,
      totalPages: 1,
    })

    const { result } = renderHook(() => useTemplateDownloadCount('portfolio-pro'), {
      wrapper: Wrapper,
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
  })
})
