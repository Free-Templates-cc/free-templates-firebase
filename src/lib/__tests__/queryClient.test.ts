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
})
