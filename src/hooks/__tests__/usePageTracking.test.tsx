import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router-dom'

const trackPageView = vi.hoisted(() => vi.fn())

vi.mock('../../lib/analytics', () => ({
  trackPageView,
}))

import { usePageTracking } from '../usePageTracking'

function TestComponent() {
  usePageTracking()
  const navigate = useNavigate()
  return (
    <button type="button" onClick={() => navigate('/templates?category=react')}>
      go
    </button>
  )
}

describe('usePageTracking', () => {
  beforeEach(() => {
    trackPageView.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('tracks the initial page view on mount', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <TestComponent />
      </MemoryRouter>,
    )
    expect(trackPageView).toHaveBeenCalledWith('/')
  })

  it('tracks initial deep links', () => {
    render(
      <MemoryRouter initialEntries={['/templates/portfolio-pro']}>
        <TestComponent />
      </MemoryRouter>,
    )
    expect(trackPageView).toHaveBeenCalledWith('/templates/portfolio-pro')
  })

  it('tracks route changes including search params', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <TestComponent />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'go' }))
    await waitFor(() => {
      expect(trackPageView).toHaveBeenCalledWith('/templates?category=react')
    })
    expect(trackPageView).toHaveBeenCalledTimes(2)
  })
})
