import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Skeleton, SkeletonCard, SkeletonTable } from '../Skeleton'

describe('Skeleton', () => {
  it('renders with default (text) variant', () => {
    const { container } = render(<Skeleton />)
    const el = container.firstChild as HTMLElement
    expect(el).toHaveAttribute('aria-hidden', 'true')
    expect(el.className).toContain('animate-pulse')
  })

  it('renders with circular variant', () => {
    const { container } = render(<Skeleton variant="circular" />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('rounded-full')
  })

  it('renders with rectangular variant', () => {
    const { container } = render(<Skeleton variant="rectangular" />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('rounded-lg')
  })

  it('renders with card variant', () => {
    const { container } = render(<Skeleton variant="card" />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('h-64')
    expect(el.className).toContain('rounded-xl')
  })

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="w-24 h-24" />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('w-24')
    expect(el.className).toContain('h-24')
  })
})

describe('SkeletonCard', () => {
  it('renders multiple skeleton elements', () => {
    const { container } = render(<SkeletonCard />)
    // Should have several skeleton divs inside
    const skeletons = container.querySelectorAll('[aria-hidden="true"]')
    expect(skeletons.length).toBeGreaterThanOrEqual(4)
  })
})

describe('SkeletonTable', () => {
  it('renders default 5 rows', () => {
    const { container } = render(<SkeletonTable />)
    const skeletons = container.querySelectorAll('[aria-hidden="true"]')
    expect(skeletons.length).toBe(15) // 5 rows x 3 items each
  })

  it('renders custom number of rows', () => {
    const { container } = render(<SkeletonTable rows={3} />)
    const skeletons = container.querySelectorAll('[aria-hidden="true"]')
    // 3 rows x 3 skeletons each
    expect(skeletons.length).toBe(9)
  })

  it('renders 0 rows gracefully', () => {
    const { container } = render(<SkeletonTable rows={0} />)
    expect(container.firstChild?.firstChild).toBeNull()
  })
})
