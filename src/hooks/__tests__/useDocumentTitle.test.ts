import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDocumentTitle } from '../useDocumentTitle'

describe('useDocumentTitle', () => {
  afterEach(() => {
    document.title = ''
    vi.restoreAllMocks()
  })

  it('sets document.title to the given title', () => {
    renderHook(() => useDocumentTitle('Test Page'))
    expect(document.title).toBe('Test Page')
  })

  it('updates document.title when title changes', () => {
    const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: 'Initial Title' },
    })

    expect(document.title).toBe('Initial Title')

    rerender({ title: 'Updated Title' })
    expect(document.title).toBe('Updated Title')
  })

  it('restores the previous title on unmount', () => {
    document.title = 'Original Title'

    const { unmount } = renderHook(() => useDocumentTitle('Temporary Title'))
    expect(document.title).toBe('Temporary Title')

    unmount()
    expect(document.title).toBe('Original Title')
  })

  it('handles empty string title', () => {
    renderHook(() => useDocumentTitle(''))
    expect(document.title).toBe('')
  })

  it('handles special characters in title', () => {
    renderHook(() => useDocumentTitle('Free Templates & More — Get 100% Off!'))
    expect(document.title).toBe('Free Templates & More — Get 100% Off!')
  })

  it('nests correctly — inner hook restores to outer title on unmount', () => {
    document.title = 'Root'

    const { unmount: unmountOuter } = renderHook(() => useDocumentTitle('Outer'))
    expect(document.title).toBe('Outer')

    const { unmount: unmountInner } = renderHook(() => useDocumentTitle('Inner'))
    expect(document.title).toBe('Inner')

    unmountInner()
    expect(document.title).toBe('Outer')

    unmountOuter()
    expect(document.title).toBe('Root')
  })
})
