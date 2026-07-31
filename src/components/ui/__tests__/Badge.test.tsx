import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../Badge'
import { frameworkBadgeVariant } from '../../../lib/utils'

describe('frameworkBadgeVariant', () => {
  it.each([
    ['Next.js', 'nextjs'],
    ['Gatsby.js', 'gatsby'],
    ['Nuxt.js', 'nuxt'],
    ['Vue.js', 'vue'],
    ['React', 'react'],
  ])('maps %s to the %s badge variant', (framework, variant) => {
    expect(frameworkBadgeVariant(framework)).toBe(variant)
  })

  it('is case-insensitive', () => {
    expect(frameworkBadgeVariant('next.js')).toBe('nextjs')
    expect(frameworkBadgeVariant('GATSBY.JS')).toBe('gatsby')
  })

  it('falls back to default for unknown frameworks', () => {
    expect(frameworkBadgeVariant('SvelteKit')).toBe('default')
    expect(frameworkBadgeVariant('')).toBe('default')
  })
})

describe('Badge', () => {
  it('renders with default (free) variant', () => {
    render(<Badge>Free</Badge>)
    const badge = screen.getByText('Free')
    expect(badge).toBeInTheDocument()
    expect(badge.className).toContain('inline-flex')
  })

  it('renders with premium variant', () => {
    render(<Badge variant="premium">Premium</Badge>)
    const badge = screen.getByText('Premium')
    expect(badge).toBeInTheDocument()
  })

  it('renders with react variant', () => {
    render(<Badge variant="react">React</Badge>)
    const badge = screen.getByText('React')
    expect(badge).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Badge className="custom-class">Badge</Badge>)
    const badge = screen.getByText('Badge')
    expect(badge.className).toContain('custom-class')
  })

  it('passes additional HTML attributes', () => {
    render(<Badge data-testid="test-badge">Test</Badge>)
    expect(screen.getByTestId('test-badge')).toBeInTheDocument()
  })

  it('renders children correctly', () => {
    render(
      <Badge>
        <span data-testid="child">Nested</span>
      </Badge>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})
