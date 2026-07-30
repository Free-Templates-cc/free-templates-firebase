import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Breadcrumbs, type BreadcrumbItem } from '../Breadcrumbs'

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Breadcrumbs', () => {
  const defaultItems: BreadcrumbItem[] = [
    { label: 'Templates', href: '/templates' },
    { label: 'Business Template', href: '/templates/business' },
  ]

  it('renders all items with home icon by default', () => {
    renderWithRouter(<Breadcrumbs items={defaultItems} />)

    // 3 items: Home + Templates + Business Template
    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(3)

    // Last item should be the current page
    expect(screen.getByText('Business Template')).toBeInTheDocument()
  })

  it('marks the last item as current page with aria-current', () => {
    renderWithRouter(<Breadcrumbs items={defaultItems} />)

    // aria-current is on the wrapping span, not the inner link
    const lastItem = screen.getByText('Business Template')
    expect(lastItem.closest('span')).toHaveAttribute('aria-current', 'page')
  })

  it('renders home icon as the first item', () => {
    renderWithRouter(<Breadcrumbs items={defaultItems} />)

    // Home icon (sr-only text)
    const homeSrLabel = screen.getByText('Home')
    expect(homeSrLabel).toBeInTheDocument()
  })

  it('hides the home item when includeHome is false', () => {
    renderWithRouter(<Breadcrumbs items={defaultItems} includeHome={false} />)

    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(2) // just Templates + Business Template
    expect(screen.queryByText('Home')).not.toBeInTheDocument()
  })

  it('renders items without href as plain text when they are the last item', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Templates', href: '/templates' },
      { label: 'Current Page' }, // no href
    ]
    renderWithRouter(<Breadcrumbs items={items} />)

    const currentPage = screen.getByText('Current Page')
    expect(currentPage).toBeInTheDocument()
    expect(currentPage).toHaveAttribute('aria-current', 'page')
  })

  it('applies custom className', () => {
    renderWithRouter(<Breadcrumbs items={defaultItems} className="mb-4" />)

    const nav = screen.getByLabelText('Breadcrumb')
    expect(nav.className).toContain('mb-4')
  })

  it('has correct aria-label on the nav element', () => {
    renderWithRouter(<Breadcrumbs items={defaultItems} />)

    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument()
  })

  it('renders link for non-last items', () => {
    renderWithRouter(<Breadcrumbs items={defaultItems} />)

    const templatesLink = screen.getByText('Templates')
    expect(templatesLink.closest('a')).toHaveAttribute('href', '/templates')
  })

  it('renders last item with href as a link inside the current page span', () => {
    renderWithRouter(<Breadcrumbs items={defaultItems} />)

    const lastLink = screen.getByText('Business Template')
    // Last item should be inside an <a> that links to the template page
    expect(lastLink.closest('a')).toHaveAttribute('href', '/templates/business')
  })

  it('handles single item with includeHome', () => {
    const items: BreadcrumbItem[] = [{ label: 'Templates', href: '/templates' }]
    renderWithRouter(<Breadcrumbs items={items} />)

    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(2) // Home + Templates
  })

  it('uses link for non-last item without href (falls back to # which resolves to /)', () => {
    const items: BreadcrumbItem[] = [
      { label: 'No Link' }, // no href but not last
      { label: 'Page', href: '/page' },
    ]
    renderWithRouter(<Breadcrumbs items={items} />)

    const noLink = screen.getByText('No Link')
    // React Router resolves '#' to '/' in a MemoryRouter (BrowserRouter root)
    expect(noLink.closest('a')).toHaveAttribute('href', '/')
  })

  it('renders chevron separators between items', () => {
    renderWithRouter(<Breadcrumbs items={defaultItems} />)

    // There should be 2 chevrons (Home → Templates, Templates → Business Template)
    const chevrons = document.querySelectorAll('svg')
    // Home icon + 2 chevrons
    expect(chevrons.length).toBe(3)
  })
})
