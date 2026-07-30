import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { ProtectedRoute } from '../ProtectedRoute'

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

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      isLoading: true,
    })
  })

  afterEach(() => {
    cleanup()
  })

  it('shows a loading spinner while auth state is loading', () => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      isLoading: true,
    })
    renderWithRouter(
      <ProtectedRoute>
        <p>Protected content</p>
      </ProtectedRoute>,
    )

    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    // Should stay on the current route
    expect(screen.getByTestId('location-pathname')).toHaveTextContent('/')
  })

  it('redirects to /login when user is not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      isLoading: false,
    })
    renderWithRouter(
      <ProtectedRoute>
        <p>Protected content</p>
      </ProtectedRoute>,
    )

    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
    expect(screen.getByTestId('location-pathname')).toHaveTextContent('/login')
  })

  it('renders children when user is authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      user: { uid: 'test-uid', email: 'test@example.com' },
      isLoading: false,
    })
    renderWithRouter(
      <ProtectedRoute>
        <p>Protected content</p>
      </ProtectedRoute>,
    )

    expect(screen.getByText('Protected content')).toBeInTheDocument()
    expect(screen.getByTestId('location-pathname')).toHaveTextContent('/')
  })
})
