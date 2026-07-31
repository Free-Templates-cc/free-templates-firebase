import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Footer } from '../Footer'

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Footer', () => {
  it('renders brand name', () => {
    renderWithRouter(<Footer />)
    // Brand link renders "Free" + "Templates" as separate inline elements —
    // accessible name will be "FreeTemplates" (no space). Query by text content.
    const brandLink = screen.getByRole('link', { name: /FreeTemplates/i })
    expect(brandLink).toBeInTheDocument()
    expect(brandLink.querySelector('span')).toHaveTextContent('Templates')
  })

  it('renders brand tagline', () => {
    renderWithRouter(<Footer />)
    expect(
      screen.getByText('1,000+ free website templates for modern web frameworks.'),
    ).toBeInTheDocument()
  })

  it('renders all link group headings', () => {
    renderWithRouter(<Footer />)
    // "Templates" appears twice: brand name + heading. Use heading element for unique match.
    const headings = screen.getAllByRole('heading')
    expect(headings).toHaveLength(3)
    expect(headings[0]).toHaveTextContent('Templates')
    expect(headings[1]).toHaveTextContent('Company')
    expect(headings[2]).toHaveTextContent('Legal')
  })

  it('renders all link labels', () => {
    renderWithRouter(<Footer />)
    expect(screen.getByText('All Templates')).toBeInTheDocument()
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('Gatsby.js')).toBeInTheDocument()
    expect(screen.getByText('Nuxt.js')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(screen.getByText('FAQ')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
    expect(screen.getByText('Terms of Service')).toBeInTheDocument()
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
  })

  it('renders links with correct hrefs', () => {
    renderWithRouter(<Footer />)

    expect(screen.getByText('All Templates').closest('a')).toHaveAttribute('href', '/templates')
    expect(screen.getByText('Pricing').closest('a')).toHaveAttribute('href', '/pricing')
    expect(screen.getByText('Terms of Service').closest('a')).toHaveAttribute('href', '/terms')
    expect(screen.getByText('Privacy Policy').closest('a')).toHaveAttribute('href', '/privacy')
    expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/contact')
  })

  it('renders current year in copyright', () => {
    renderWithRouter(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`© ${currentYear} Free-Templates.cc`))).toBeInTheDocument()
  })

  it('has correct footer element', () => {
    renderWithRouter(<Footer />)
    const footer = document.querySelector('footer')
    expect(footer).toBeInTheDocument()
  })

  it('renders brand link that goes to home', () => {
    renderWithRouter(<Footer />)
    const brandLink = screen.getByRole('link', { name: /FreeTemplates/i })
    expect(brandLink).toHaveAttribute('href', '/')
  })
})
