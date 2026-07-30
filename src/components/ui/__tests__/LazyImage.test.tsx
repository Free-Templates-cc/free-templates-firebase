import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup, act } from '@testing-library/react'
import { LazyImage } from '../LazyImage'

// Mock IntersectionObserver
const mockDisconnect = vi.fn()
const mockObserve = vi.fn()

let intersectionCallback: (entry: { isIntersecting: boolean }) => void

beforeEach(() => {
  // @ts-expect-error - mocking IntersectionObserver
  globalThis.IntersectionObserver = class {
    constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
      intersectionCallback = (entry) => callback([entry])
    }
    observe = mockObserve
    disconnect = mockDisconnect
  }
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('LazyImage', () => {
  it('renders placeholder when not in view yet', () => {
    const { container } = render(<LazyImage src="/test.jpg" alt="Test image" />)
    // Placeholder div should exist
    const placeholder = container.querySelector('[aria-hidden="true"]')
    expect(placeholder).toBeInTheDocument()
    // No img tag yet
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('starts observing on mount', () => {
    render(<LazyImage src="/test.jpg" alt="Test image" />)
    expect(mockObserve).toHaveBeenCalledTimes(1)
  })

  it('loads image when entering viewport', () => {
    render(<LazyImage src="/test.jpg" alt="Test image" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()

    // Trigger intersection
    act(() => {
      intersectionCallback({ isIntersecting: true })
    })

    // Image should now be in the DOM
    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/test.jpg')
    expect(img).toHaveAttribute('alt', 'Test image')
  })

  it('sets opacity to 0 before image loads', () => {
    render(<LazyImage src="/test.jpg" alt="Test" />)
    act(() => {
      intersectionCallback({ isIntersecting: true })
    })
    const img = screen.getByRole('img')
    expect(img.className).toContain('opacity-0')
    expect(img.className).not.toContain('opacity-100')
  })

  it('sets opacity to 100 after image loads', () => {
    render(<LazyImage src="/test.jpg" alt="Test" />)
    act(() => {
      intersectionCallback({ isIntersecting: true })
    })

    const img = screen.getByRole('img')
    act(() => {
      // Simulate image load
      img.dispatchEvent(new Event('load'))
    })

    expect(img.className).toContain('opacity-100')
    expect(img.className).not.toContain('opacity-0')
  })

  it('applies aspect ratio via padding-bottom trick', () => {
    const { container } = render(<LazyImage src="/test.jpg" alt="Test" aspectRatio="16/9" />)
    const wrapper = container.firstChild as HTMLElement
    // 9/16 * 100 = 56.25%
    expect(wrapper.style.paddingBottom).toBe('56.25%')
  })

  it('applies custom wrapper className', () => {
    const { container } = render(
      <LazyImage src="/test.jpg" alt="Test" wrapperClassName="custom-wrapper" />,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('custom-wrapper')
  })

  it('applies custom className to img', () => {
    render(<LazyImage src="/test.jpg" alt="Test" className="custom-img" />)
    act(() => {
      intersectionCallback({ isIntersecting: true })
    })
    const img = screen.getByRole('img')
    expect(img.className).toContain('custom-img')
  })

  it('disconnects observer after entering viewport', () => {
    render(<LazyImage src="/test.jpg" alt="Test" />)
    act(() => {
      intersectionCallback({ isIntersecting: true })
    })
    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })

  it('does not render image if never intersecting', () => {
    render(<LazyImage src="/test.jpg" alt="Hidden" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
