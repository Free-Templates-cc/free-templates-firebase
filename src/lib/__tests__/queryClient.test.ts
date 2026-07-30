import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('queryClient', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('exports a QueryClient with configured defaults', async () => {
    const { queryClient } = await import('../queryClient')

    expect(queryClient).toBeDefined()
    expect(queryClient.getDefaultOptions().queries).toBeDefined()

    const defaults = queryClient.getDefaultOptions().queries!
    expect(defaults.staleTime).toBe(1000 * 60 * 5) // 5 min
    expect(defaults.retry).toBe(2)
    expect(defaults.refetchOnWindowFocus).toBe(false)
    expect(defaults.refetchOnReconnect).toBe(true)
  })

  it('registers online/offline event listeners via onlineManager', async () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

    await import('../queryClient')

    expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function))
    expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function))
  })

  it('has retryDelay that delays exponentially with a cap at 10s', async () => {
    const { queryClient } = await import('../queryClient')
    const defaults = queryClient.getDefaultOptions().queries!
    const retryDelay = defaults.retryDelay! as (attemptIndex: number) => number

    // Exponential backoff: 2^attemptIndex * 1000ms, capped at 10s
    expect(retryDelay(0)).toBe(1000) // 2^0 * 1000 = 1000
    expect(retryDelay(1)).toBe(2000) // 2^1 * 1000 = 2000
    expect(retryDelay(2)).toBe(4000) // 2^2 * 1000 = 4000
    expect(retryDelay(3)).toBe(8000) // 2^3 * 1000 = 8000
    expect(retryDelay(4)).toBe(10000) // capped at 10000
    expect(retryDelay(10)).toBe(10000) // stays capped
  })
})
