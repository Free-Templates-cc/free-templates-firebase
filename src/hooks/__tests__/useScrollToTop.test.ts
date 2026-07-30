import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import React, { type ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { useScrollToTop } from '../useScrollToTop'

describe('useScrollToTop', () => {
  function createWrapper(initialEntries: string[] = ['/']) {
    return function Wrapper({ children }: { children: ReactNode }) {
      return React.createElement(
        MemoryRouter,
        { initialEntries },
        children,
      )
    }
  }

  beforeEach(() => {
    window.scrollTo = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls window.scrollTo(0, 0) on mount', () => {
    renderHook(() => useScrollToTop(), {
      wrapper: createWrapper(['/templates']),
    })
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('handles deeply nested paths', () => {
    renderHook(() => useScrollToTop(), {
      wrapper: createWrapper(['/templates/portfolio-pro']),
    })
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('handles root path', () => {
    renderHook(() => useScrollToTop(), {
      wrapper: createWrapper(['/']),
    })
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('calls window.scrollTo with root path and no hash', () => {
    renderHook(() => useScrollToTop(), {
      wrapper: createWrapper(['/']),
    })
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })
})
