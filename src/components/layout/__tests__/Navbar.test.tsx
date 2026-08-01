import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Navbar } from '../Navbar'
import type { User } from 'firebase/auth'

// Mock firebase auth
vi.mock('firebase/auth', () => ({
  signOut: vi.fn(() => Promise.resolve()),
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn(() => vi.fn()),
}))

vi.mock('../../../lib/firebase', () => ({
  auth: {},
}))

const mockUseAuthStore = vi.fn()
const mockUseUIStore = vi.fn()

vi.mock('../../../stores/authStore', () => ({
  useAuthStore: () => mockUseAuthStore(),
}))

vi.mock('../../../stores/uiStore', () => ({
  useUIStore: () => mockUseUIStore(),
}))

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Navbar', () => {
  const mockUser = { uid: 'test-uid', email: 'test@example.com' } as User
  const mockProfile = {
    uid: 'test-uid',
    displayName: 'Test User',
    email: 'test@example.com',
    subscription: { tier: 'free' as const, status: 'active' as const },
  }

  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      profile: null,
      isPremium: false,
    })
    mockUseUIStore.mockReturnValue({
      isDarkMode: false,
      toggleDarkMode: vi.fn(),
      isMobileMenuOpen: false,
      setMobileMenuOpen: vi.fn(),
    })
  })

  afterEach(() => {
    cleanup()
  })

  it('renders the logo with brand name', () => {
    renderWithRouter(<Navbar />)
    const logoLink = screen.getByRole('link', { name: /FreeTemplates/i })
    expect(logoLink).toBeInTheDocument()
    expect(logoLink.querySelector('span')).toHaveTextContent('Free')
  })

  it('renders navigation links', () => {
    renderWithRouter(<Navbar />)
    const templatesLink = screen.getByRole('link', { name: /^templates$/i })
    expect(templatesLink).toBeInTheDocument()
    expect(templatesLink).toHaveAttribute('href', '/templates')

    const pricingLink = screen.getByRole('link', { name: /^pricing$/i })
    expect(pricingLink).toBeInTheDocument()
    expect(pricingLink).toHaveAttribute('href', '/pricing')
  })

  it('renders the search form', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByPlaceholderText('Search templates...')).toBeInTheDocument()
  })

  it('renders dark mode toggle button with light mode label by default', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument()
  })

  it('shows "Switch to light mode" when dark mode is on', () => {
    mockUseUIStore.mockReturnValue({
      isDarkMode: true,
      toggleDarkMode: vi.fn(),
      isMobileMenuOpen: false,
      setMobileMenuOpen: vi.fn(),
    })
    renderWithRouter(<Navbar />)
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument()
  })

  it('calls toggleDarkMode when dark mode button is clicked', () => {
    const toggleDarkMode = vi.fn()
    mockUseUIStore.mockReturnValue({
      isDarkMode: false,
      toggleDarkMode,
      isMobileMenuOpen: false,
      setMobileMenuOpen: vi.fn(),
    })
    renderWithRouter(<Navbar />)
    fireEvent.click(screen.getByRole('button', { name: /switch to dark mode/i }))
    expect(toggleDarkMode).toHaveBeenCalledOnce()
  })

  it('shows Sign In and Get Started buttons when user is not authenticated', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByText('Get Started')).toBeInTheDocument()
  })

  it('shows user display name when authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      profile: mockProfile,
      isPremium: false,
    })
    renderWithRouter(<Navbar />)
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument()
    expect(screen.queryByText('Get Started')).not.toBeInTheDocument()
  })

  it('falls back to email prefix when displayName is not set', () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      profile: null,
      isPremium: false,
    })
    renderWithRouter(<Navbar />)
    expect(screen.getByText('test')).toBeInTheDocument()
  })

  it('opens user menu dropdown when user name button is clicked', () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      profile: mockProfile,
      isPremium: false,
    })
    renderWithRouter(<Navbar />)

    const userButton = screen.getByText('Test User').closest('button')!
    fireEvent.click(userButton)

    expect(screen.getByText('My Account')).toBeInTheDocument()
    expect(screen.getByText('My Downloads')).toBeInTheDocument()
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
  })

  it('has user menu with correct ARIA attributes', () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      profile: mockProfile,
      isPremium: false,
    })
    renderWithRouter(<Navbar />)

    const userButton = screen.getByText('Test User').closest('button')!
    expect(userButton).toHaveAttribute('aria-haspopup', 'menu')
    expect(userButton).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(userButton)
    expect(userButton).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getAllByRole('menuitem')).toHaveLength(3)
  })

  it('has mobile menu toggle with correct ARIA label and expanded state', () => {
    renderWithRouter(<Navbar />)
    const toggle = screen.getByRole('button', { name: /open navigation menu/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows close icon label when mobile menu is open', () => {
    mockUseUIStore.mockReturnValue({
      isDarkMode: false,
      toggleDarkMode: vi.fn(),
      isMobileMenuOpen: true,
      setMobileMenuOpen: vi.fn(),
    })
    renderWithRouter(<Navbar />)
    expect(screen.getByRole('button', { name: /close navigation menu/i })).toBeInTheDocument()
  })

  it('shows mobile search and nav links when mobile menu is open', () => {
    mockUseUIStore.mockReturnValue({
      isDarkMode: false,
      toggleDarkMode: vi.fn(),
      isMobileMenuOpen: true,
      setMobileMenuOpen: vi.fn(),
    })
    renderWithRouter(<Navbar />)
    const templatesLinks = screen.getAllByText('Templates')
    expect(templatesLinks.length).toBeGreaterThanOrEqual(2)
  })

  it('calls setMobileMenuOpen when mobile menu toggle is clicked', () => {
    const setMobileMenuOpen = vi.fn()
    mockUseUIStore.mockReturnValue({
      isDarkMode: false,
      toggleDarkMode: vi.fn(),
      isMobileMenuOpen: false,
      setMobileMenuOpen,
    })
    renderWithRouter(<Navbar />)
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }))
    expect(setMobileMenuOpen).toHaveBeenCalledWith(true)
  })

  it('updates search input value on change', () => {
    renderWithRouter(<Navbar />)
    const input = screen.getByPlaceholderText('Search templates...')
    fireEvent.change(input, { target: { value: 'business' } })
    expect(input).toHaveValue('business')
  })

  // ----- New tests for uncovered lines -----

  it('submits search form and clears query on non-empty search', () => {
    renderWithRouter(<Navbar />)
    const input = screen.getByPlaceholderText('Search templates...') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'business' } })
    expect(input.value).toBe('business')

    // Submit the form — use form's submit event
    const form = input.closest('form')!
    fireEvent.submit(form)

    // Input should be cleared after submit
    expect(input.value).toBe('')
  })

  it('does not navigate on empty search submit', () => {
    renderWithRouter(<Navbar />)
    const input = screen.getByPlaceholderText('Search templates...') as HTMLInputElement
    const form = input.closest('form')!
    fireEvent.submit(form)

    // Input remains empty
    expect(input.value).toBe('')
  })

  it('shows backdrop when user menu is open', () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      profile: mockProfile,
      isPremium: false,
    })
    renderWithRouter(<Navbar />)

    const userButton = screen.getByText('Test User').closest('button')!
    fireEvent.click(userButton)

    // Backdrop should exist with aria-hidden
    const backdrop = document.querySelector('[aria-hidden="true"]')
    expect(backdrop).toBeInTheDocument()
  })

  it('renders mobile menu with search and nav links', () => {
    mockUseUIStore.mockReturnValue({
      isDarkMode: false,
      toggleDarkMode: vi.fn(),
      isMobileMenuOpen: true,
      setMobileMenuOpen: vi.fn(),
    })

    renderWithRouter(<Navbar />)

    // Mobile nav links should be present
    const templatesLinks = screen.getAllByText('Templates')
    expect(templatesLinks.length).toBeGreaterThanOrEqual(2)

    // Mobile search input should exist
    const searchInputs = screen.getAllByPlaceholderText('Search templates...')
    expect(searchInputs.length).toBeGreaterThanOrEqual(2) // desktop + mobile
  })

  it('calls setMobileMenuOpen(false) when mobile Templates link is clicked', () => {
    const setMobileMenuOpen = vi.fn()
    mockUseUIStore.mockReturnValue({
      isDarkMode: false,
      toggleDarkMode: vi.fn(),
      isMobileMenuOpen: true,
      setMobileMenuOpen,
    })

    renderWithRouter(<Navbar />)

    const templatesLinks = screen.getAllByText('Templates')
    // Last one is in the mobile menu
    const mobileTemplatesLink = templatesLinks[templatesLinks.length - 1]!
    fireEvent.click(mobileTemplatesLink)

    expect(setMobileMenuOpen).toHaveBeenCalledWith(false)
  })

  it('calls setMobileMenuOpen(false) when mobile Pricing link is clicked', () => {
    const setMobileMenuOpen = vi.fn()
    mockUseUIStore.mockReturnValue({
      isDarkMode: false,
      toggleDarkMode: vi.fn(),
      isMobileMenuOpen: true,
      setMobileMenuOpen,
    })

    renderWithRouter(<Navbar />)

    const pricingLinks = screen.getAllByText('Pricing')
    const mobilePricingLink = pricingLinks[pricingLinks.length - 1]!
    fireEvent.click(mobilePricingLink)

    expect(setMobileMenuOpen).toHaveBeenCalledWith(false)
  })

  it('renders user menu with correct link hrefs', () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      profile: mockProfile,
      isPremium: false,
    })

    renderWithRouter(<Navbar />)

    const userButton = screen.getByText('Test User').closest('button')!
    fireEvent.click(userButton)

    const myAccountLink = screen.getByText('My Account').closest('a')
    expect(myAccountLink).toHaveAttribute('href', '/account')

    const myDownloadsLink = screen.getByText('My Downloads').closest('a')
    expect(myDownloadsLink).toHaveAttribute('href', '/account/downloads')
  })

  it('calls signOut and navigates to home when Sign Out is clicked', async () => {
    const { signOut } = await import('firebase/auth')
    const mockSignOut = vi.mocked(signOut)

    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      profile: mockProfile,
      isPremium: false,
    })

    renderWithRouter(<Navbar />)

    const userButton = screen.getByText('Test User').closest('button')!
    fireEvent.click(userButton)

    const signOutButton = screen.getByText('Sign Out')
    fireEvent.click(signOutButton)

    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })

  it('closes the mobile menu when a search is submitted from the mobile menu', () => {
    const setMobileMenuOpen = vi.fn()
    mockUseUIStore.mockReturnValue({
      isDarkMode: false,
      toggleDarkMode: vi.fn(),
      isMobileMenuOpen: true,
      setMobileMenuOpen,
    })
    renderWithRouter(<Navbar />)

    const searchInputs = screen.getAllByPlaceholderText('Search templates...')
    // Desktop form renders first, mobile form second (both in the DOM in jsdom).
    expect(searchInputs.length).toBeGreaterThanOrEqual(2)
    fireEvent.change(searchInputs[1]!, { target: { value: 'react' } })
    fireEvent.submit(searchInputs[1]!.closest('form')!)

    expect(setMobileMenuOpen).toHaveBeenCalledWith(false)
  })
})
