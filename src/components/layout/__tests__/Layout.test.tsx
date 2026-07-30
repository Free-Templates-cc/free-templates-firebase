import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '../Layout'

// Mock child components
vi.mock('../Navbar', () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
}))

vi.mock('../Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}))

vi.mock('../../ui/NetworkStatusBanner', () => ({
  NetworkStatusBanner: () => <div data-testid="network-banner">Network Status</div>,
}))

function renderWithRouter(ui: React.ReactElement, { initialEntries = ['/'] } = {}) {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>)
}

describe('Layout', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders the Navbar', () => {
    renderWithRouter(
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<p>Home page content</p>} />
        </Route>
      </Routes>,
    )
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
  })

  it('renders the Footer', () => {
    renderWithRouter(
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<p>Home page content</p>} />
        </Route>
      </Routes>,
    )
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('renders the NetworkStatusBanner', () => {
    renderWithRouter(
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<p>Home page content</p>} />
        </Route>
      </Routes>,
    )
    expect(screen.getByTestId('network-banner')).toBeInTheDocument()
  })

  it('renders the skip-to-content link', () => {
    renderWithRouter(
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<p>Home page content</p>} />
        </Route>
      </Routes>,
    )
    const skipLink = screen.getByText('Skip to main content')
    expect(skipLink).toBeInTheDocument()
    expect(skipLink).toHaveAttribute('href', '#main-content')
  })

  it('renders the main content area via Outlet', () => {
    renderWithRouter(
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<p>Home page content</p>} />
        </Route>
      </Routes>,
    )
    expect(screen.getByText('Home page content')).toBeInTheDocument()
  })

  it('renders the main element with id="main-content"', () => {
    renderWithRouter(
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<p>Content</p>} />
        </Route>
      </Routes>,
    )
    const main = document.querySelector('main#main-content')
    expect(main).toBeInTheDocument()
    expect(main).toHaveAttribute('tabindex', '-1')
  })

  it('renders different routes through Outlet', () => {
    renderWithRouter(
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<p>Home page</p>} />
          <Route path="/templates" element={<p>Templates page</p>} />
        </Route>
      </Routes>,
      { initialEntries: ['/templates'] },
    )
    expect(screen.getByText('Templates page')).toBeInTheDocument()
    expect(screen.queryByText('Home page')).not.toBeInTheDocument()
  })
})
