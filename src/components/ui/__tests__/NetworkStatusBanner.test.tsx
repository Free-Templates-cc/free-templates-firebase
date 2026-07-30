import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { NetworkStatusBanner } from '../NetworkStatusBanner'

// Mock the useNetworkStatus hook
const mockUseNetworkStatus = vi.fn()
vi.mock('../../../hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => mockUseNetworkStatus(),
}))

describe('NetworkStatusBanner', () => {
  beforeEach(() => {
    mockUseNetworkStatus.mockReturnValue(true)
  })

  afterEach(() => {
    cleanup()
  })

  it('returns null when online', () => {
    render(<NetworkStatusBanner />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows banner when offline', () => {
    mockUseNetworkStatus.mockReturnValue(false)
    render(<NetworkStatusBanner />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/offline/i)).toBeInTheDocument()
    expect(screen.getByText(/connection/i)).toBeInTheDocument()
  })

  it('has correct ARIA role', () => {
    mockUseNetworkStatus.mockReturnValue(false)
    render(<NetworkStatusBanner />)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-amber-500')
  })
})
