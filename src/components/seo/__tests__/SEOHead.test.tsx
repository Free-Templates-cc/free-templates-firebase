import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { SEOHead } from '../SEOHead'

function renderWithHelmet(ui: React.ReactElement) {
  return render(<HelmetProvider>{ui}</HelmetProvider>)
}

describe('SEOHead', () => {
  it('sets the page title', () => {
    renderWithHelmet(<SEOHead title="Browse Templates" />)

    const helmet = document.querySelector('title')
    expect(helmet?.textContent).toBe('Browse Templates — Free Templates')
  })

  it('does not duplicate site name if already present in title', () => {
    renderWithHelmet(<SEOHead title="Free Templates" />)

    const helmet = document.querySelector('title')
    // Should not become "Free Templates — Free Templates"
    expect(helmet?.textContent).toBe('Free Templates')
  })

  it('sets default description when none provided', () => {
    renderWithHelmet(<SEOHead title="Test" />)

    const meta = document.querySelector('meta[name="description"]')
    expect(meta).toHaveAttribute(
      'content',
      'Download 1,000+ free and premium website templates built with Next.js, Gatsby.js, Nuxt.js, and more. Jumpstart your next project with production-ready starter templates.',
    )
  })

  it('sets custom description', () => {
    renderWithHelmet(<SEOHead title="Test" description="Custom description" />)

    const meta = document.querySelector('meta[name="description"]')
    expect(meta).toHaveAttribute('content', 'Custom description')
  })

  it('sets og meta tags', () => {
    renderWithHelmet(
      <SEOHead title="Pricing" description="See our plans" ogImage="/custom-og.png" />,
    )

    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDescription = document.querySelector('meta[property="og:description"]')
    const ogImage = document.querySelector('meta[property="og:image"]')
    const ogType = document.querySelector('meta[property="og:type"]')
    const ogSiteName = document.querySelector('meta[property="og:site_name"]')

    expect(ogTitle).toHaveAttribute('content', 'Pricing — Free Templates')
    expect(ogDescription).toHaveAttribute('content', 'See our plans')
    expect(ogImage).toHaveAttribute('content', '/custom-og.png')
    expect(ogType).toHaveAttribute('content', 'website')
    expect(ogSiteName).toHaveAttribute('content', 'Free Templates')
  })

  it('sets twitter card meta tags', () => {
    renderWithHelmet(<SEOHead title="Test" description="Twitter desc" ogImage="/twitter-img.png" />)

    const twitterCard = document.querySelector('meta[name="twitter:card"]')
    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    const twitterDesc = document.querySelector('meta[name="twitter:description"]')
    const twitterImage = document.querySelector('meta[name="twitter:image"]')

    expect(twitterCard).toHaveAttribute('content', 'summary_large_image')
    expect(twitterTitle).toHaveAttribute('content', 'Test — Free Templates')
    expect(twitterDesc).toHaveAttribute('content', 'Twitter desc')
    expect(twitterImage).toHaveAttribute('content', '/twitter-img.png')
  })

  it('sets canonical link when provided', () => {
    renderWithHelmet(
      <SEOHead title="Test" canonicalUrl="https://free-templates.cc/templates/test" />,
    )

    const canonical = document.querySelector('link[rel="canonical"]')
    expect(canonical).toHaveAttribute('href', 'https://free-templates.cc/templates/test')
  })

  it('does not set canonical link when not provided', () => {
    renderWithHelmet(<SEOHead title="Test" />)

    const canonical = document.querySelector('link[rel="canonical"]')
    expect(canonical).not.toBeInTheDocument()
  })

  it('sets noindex meta tag when noIndex is true', () => {
    renderWithHelmet(<SEOHead title="Test" noIndex={true} />)

    const robots = document.querySelector('meta[name="robots"]')
    expect(robots).toHaveAttribute('content', 'noindex')
  })

  it('does not set noindex when noIndex is false', () => {
    renderWithHelmet(<SEOHead title="Test" noIndex={false} />)

    const robots = document.querySelector('meta[name="robots"]')
    expect(robots).not.toBeInTheDocument()
  })

  it('does not set noindex by default', () => {
    renderWithHelmet(<SEOHead title="Test" />)

    const robots = document.querySelector('meta[name="robots"]')
    expect(robots).not.toBeInTheDocument()
  })

  it('sets default og:type to website', () => {
    renderWithHelmet(<SEOHead title="Test" />)

    const ogType = document.querySelector('meta[property="og:type"]')
    expect(ogType).toHaveAttribute('content', 'website')
  })

  it('sets custom og:type when provided', () => {
    renderWithHelmet(<SEOHead title="Test" ogType="article" />)

    const ogType = document.querySelector('meta[property="og:type"]')
    expect(ogType).toHaveAttribute('content', 'article')
  })

  it('uses default og image when not provided', () => {
    renderWithHelmet(<SEOHead title="Test" />)

    const ogImage = document.querySelector('meta[property="og:image"]')
    expect(ogImage).toHaveAttribute('content', '/og-image.png')
  })
})
