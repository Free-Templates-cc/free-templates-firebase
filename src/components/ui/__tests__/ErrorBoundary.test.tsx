import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from '../ErrorBoundary'

// Component that throws on render
function ThrowOnRender({ shouldThrow = true }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Test render error')
  }
  return <p>Rendered successfully</p>
}

// Mock console.error to keep test output clean
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <p>All good</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('All good')).toBeInTheDocument()
  })

  it('renders default error UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowOnRender />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(
      screen.getByText(
        'An unexpected error occurred. Please try again or contact support if the issue persists.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
    expect(screen.getByText('Error details')).toBeInTheDocument()
  })

  it('renders the error message in details section', () => {
    render(
      <ErrorBoundary>
        <ThrowOnRender />
      </ErrorBoundary>,
    )

    // Expand the details section
    fireEvent.click(screen.getByText('Error details'))

    expect(screen.getByText('Test render error')).toBeInTheDocument()
  })

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<p>Custom error message</p>}>
        <ThrowOnRender />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('calls componentDidCatch when error occurs', () => {
    // Spy on the prototype's componentDidCatch
    const didCatchSpy = vi.spyOn(ErrorBoundary.prototype, 'componentDidCatch')

    render(
      <ErrorBoundary>
        <ThrowOnRender />
      </ErrorBoundary>,
    )

    expect(didCatchSpy).toHaveBeenCalledTimes(1)
    expect(didCatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Test render error' }),
      expect.any(Object),
    )

    didCatchSpy.mockRestore()
  })

  it('renders error icon (AlertTriangle)', () => {
    render(
      <ErrorBoundary>
        <ThrowOnRender />
      </ErrorBoundary>,
    )

    // The AlertTriangle icon should be rendered (it renders as an SVG)
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('renders retry button with RefreshCw icon', () => {
    render(
      <ErrorBoundary>
        <ThrowOnRender />
      </ErrorBoundary>,
    )

    const button = screen.getByRole('button', { name: /try again/i })
    expect(button).toBeInTheDocument()
    // Button should contain an SVG icon
    expect(button.querySelector('svg')).toBeInTheDocument()
  })
})
