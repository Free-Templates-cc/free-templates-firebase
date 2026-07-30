import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { type ReactNode } from 'react'
import { useDownloads } from '../useDownloads'
import type { Download } from '../../types'
import * as api from '../../lib/api'

vi.mock('../../lib/api', () => ({
  fetchDownloads: vi.fn(),
  fetchTemplates: vi.fn(),
  fetchTemplateBySlug: vi.fn(),
  fetchRelatedTemplates: vi.fn(),
  createCheckoutSession: vi.fn(),
  cancelSubscription: vi.fn(),
  reactivateSubscription: vi.fn(),
  createBillingPortalSession: vi.fn(),
  getDownloadUrl: vi.fn(),
}))

const mockDownloads: Download[] = [
  {
    id: 'dl-1',
    userId: 'user-1',
    templateId: '2',
    templateName: 'Business Plus',
    templateSlug: 'business-plus',
    templateCategory: 'Business',
    downloadedAt: new Date('2026-07-28').toISOString(),
  },
  {
    id: 'dl-2',
    userId: 'user-1',
    templateId: '4',
    templateName: 'ConstructPro',
    templateSlug: 'construct-pro',
    templateCategory: 'Agency',
    downloadedAt: new Date('2026-07-25').toISOString(),
  },
]

describe('useDownloads', () => {
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

  it('fetches downloads for a valid userId', async () => {
    ;(api.fetchDownloads as Mock).mockResolvedValue(mockDownloads)

    const { result } = renderHook(() => useDownloads('user-1'), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.fetchDownloads).toHaveBeenCalledWith('user-1')
    expect(result.current.data).toEqual(mockDownloads)
    expect(result.current.data).toHaveLength(2)
  })

  it('does not fetch when userId is undefined', () => {
    renderHook(() => useDownloads(undefined), { wrapper: Wrapper })
    expect(api.fetchDownloads).not.toHaveBeenCalled()
  })

  it('returns empty array when user has no downloads', async () => {
    ;(api.fetchDownloads as Mock).mockResolvedValue([])

    const { result } = renderHook(() => useDownloads('user-no-downloads'), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([])
  })

  it('filters downloads by userId', async () => {
    ;(api.fetchDownloads as Mock).mockImplementation(async (userId: string) => {
      return mockDownloads.filter((d) => d.userId === userId)
    })

    const { result } = renderHook(() => useDownloads('user-1'), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const userIds = result.current.data?.map((d) => d.userId)
    expect(userIds?.every((id) => id === 'user-1')).toBe(true)
  })

  it('returns error state on failure', async () => {
    ;(api.fetchDownloads as Mock).mockRejectedValue(new Error('Permission denied'))

    const { result } = renderHook(() => useDownloads('user-1'), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeDefined()
  })

  it('refetches when userId changes', async () => {
    ;(api.fetchDownloads as Mock).mockImplementation(async (userId: string) => {
      if (userId === 'user-1') return mockDownloads
      return [{ ...mockDownloads[0]!, id: 'dl-3', userId: 'user-2' }]
    })

    const { result, rerender } = renderHook(
      ({ userId }) => useDownloads(userId),
      { initialProps: { userId: 'user-1' }, wrapper: Wrapper },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
    expect(api.fetchDownloads).toHaveBeenCalledTimes(1)

    rerender({ userId: 'user-2' })

    await waitFor(() => expect(result.current.data).toHaveLength(1))
    expect(api.fetchDownloads).toHaveBeenCalledTimes(2)
    expect(api.fetchDownloads).toHaveBeenCalledWith('user-2')
  })
})
