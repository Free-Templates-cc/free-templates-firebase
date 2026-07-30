import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { PremiumRoute } from '../PremiumRoute'

const mockUseAuthStore = vi.fn()

vi.mock('../../../stores/authStore', () => ({
  useAuthStore: () => mockUseAuthStore(),
}))

function LocationDisplay() {
  const location = useLocation()
  return <span data-testid="location-pathname">{location.pathname}</span>
}

function renderWithRouter(ui: React.ReactElement, { initialEntries = ['/'] } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {ui}
      <LocationDisplay />
    </MemoryRouter>,
  )
}

describe('PremiumRoute', () => {
  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      isLoading: true,
      isPremium: false,
    })
  })

  afterEach(() => {
    cleanup()
  })

  it('shows a loading spinner while auth state is loading', () => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      isLoading: true,
      isPremium: false,
    })
    renderWithRouter(
      <PremiumRoute>
        <p>Premium content</p>
      </PremiumRoute>,
    )

    expect(screen.queryByText('Premium content')).not.toBeInTheDocument()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    expect(screen.getByTestId('location-pathname')).toHaveTextContent('/')
  })

  it('redirects to /login when user is not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      isLoading: false,
      isPremium: false,
    })
    renderWithRouter(
      <PremiumRoute>
        <p>Premium content</p>
      </PremiumRoute>,
    )

    expect(screen.queryByText('Premium content')).not.toBeInTheDocument()
    expect(screen.getByTestId('location-pathname')).toHaveTextContent('/login')
  })

  it('redirects to /pricing when user is not premium', () => {
    mockUseAuthStore.mockReturnValue({
      user: { uid: 'test-uid', email: 'test@example.com' },
      isLoading: false,
      isPremium: false,
    })
    renderWithRouter(
      <PremiumRoute>
        <p>Premium content</p>
      </PremiumRoute>,
    )

    expect(screen.queryByText('Premium content')).not.toBeInTheDocument()
    expect(screen.getByTestId('location-pathname')).toHaveTextContent('/pricing')
  })

  it('renders children when user is authenticated and premium', () => {
    mockUseAuthStore.mockReturnValue({
      user: { uid: 'test-uid', email: 'premium@example.com' },
      isLoading: false,
      isPremium: true,
    })
    renderWithRouter(
      <PremiumRoute>
        <p>Premium content</p>
      </PremiumRoute>,
    )

    expect(screen.getByText('Premium content')).toBeInTheDocument()
    expect(screen.getByTestId('location-pathname')).toHaveTextContent('/')
  })
})
