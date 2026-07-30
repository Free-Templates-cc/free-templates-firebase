# Layout Components Specification

## Purpose

Layout components (Navbar, Footer, Layout) provide the persistent chrome around page content — navigation, branding, search, user menu, and site-wide footer information. They are responsive, support dark mode, and integrate with auth state.

## Requirements

### Requirement: Navbar
The system SHALL provide a Navbar component with logo, search bar, navigation links, auth state display, user menu, and dark mode toggle, responsive for desktop and mobile.

#### Scenario: Desktop layout
- **GIVEN** the viewport is at `lg` breakpoint or wider (1024px+)
- **WHEN** Navbar renders
- **THEN** it SHALL display the logo on the left, search bar in the center, and auth/links on the right in a horizontal row

#### Scenario: Mobile layout
- **GIVEN** the viewport is below `lg` breakpoint
- **WHEN** Navbar renders
- **THEN** it SHALL display logo left, hamburger menu toggle right, and hide nav links behind the toggle
- **WHEN** the hamburger is clicked
- **THEN** a slide-down mobile menu SHALL appear with all nav links

#### Scenario: Auth state — logged out
- **GIVEN** the user is not authenticated
- **WHEN** Navbar renders
- **THEN** it SHALL display "Sign In" and "Get Started" (or "Sign Up") buttons

#### Scenario: Auth state — logged in
- **GIVEN** the user is authenticated
- **WHEN** Navbar renders
- **THEN** it SHALL display a user menu dropdown with user name/avatar, links to Account, Download History, and Sign Out

#### Scenario: Dark mode toggle
- **GIVEN** the user clicks the dark mode toggle (sun/moon icon)
- **WHEN** clicked
- **THEN** it SHALL toggle between light and dark mode via the uiStore
- **AND** the icon SHALL reflect the current mode (moon for light, sun for dark)

#### Scenario: Search form
- **GIVEN** the user is on any page
- **WHEN** they submit the search form in the Navbar
- **THEN** the app SHALL navigate to `/templates?search=<query>`
- **AND** an empty query SHALL be a no-op (do not navigate)
- **AND** the search input SHALL clear after submission

#### Scenario: Backdrop on mobile menu
- **GIVEN** the mobile menu is open
- **WHEN** the user clicks the backdrop overlay
- **THEN** the mobile menu SHALL close

#### Scenario: Nav links close mobile menu
- **GIVEN** the mobile menu is open
- **WHEN** the user clicks any navigation link
- **THEN** the mobile menu SHALL close

#### Scenario: User menu links
- **GIVEN** the user menu is open
- **WHEN** the user clicks "Account" or "Download History"
- **THEN** they SHALL navigate to `/account` or `/account/downloads`
- **AND** the user menu SHALL close

#### Scenario: User menu dropdown accessibility
- **GIVEN** the user menu button
- **WHEN** rendered
- **THEN** it SHALL have `aria-expanded`, `aria-haspopup="true"`, and `role="menu"` for accessibility

### Requirement: Footer
The system SHALL provide a Footer component with multi-column links, copyright, and branding.

#### Scenario: Link groups
- **GIVEN** Footer renders
- **THEN** it SHALL display four link groups: Templates (categories), Company (About, Blog, Contact), Support (FAQ, Terms, Privacy), and Connect (social links)

#### Scenario: Copyright
- **GIVEN** Footer renders
- **THEN** it SHALL display the copyright line with current year and "Free Templates" branding

### Requirement: Layout
The system SHALL provide a Layout component that wraps page content with Navbar, Footer, and a skip-to-content link for accessibility.

#### Scenario: Page structure
- **GIVEN** a page rendered inside Layout
- **WHEN** it renders
- **THEN** the structure SHALL be: skip-to-content link, Navbar, main content area (children), Footer

#### Scenario: Skip-to-content
- **GIVEN** a Layout
- **WHEN** it renders
- **THEN** a "Skip to content" link SHALL be present at the very top, invisible until focused

### Requirement: SEOHead
The system SHALL provide an SEOHead component that sets meta tags per page using react-helmet-async.

#### Scenario: Page metadata
- **GIVEN** an SEOHead with `title`, `description`, and optional `canonicalUrl`
- **WHEN** it renders
- **THEN** it SHALL set the document title as "<title> | Free Templates"
- **AND** it SHALL set the meta description
- **AND** if `canonicalUrl` is provided, it SHALL set the canonical link tag
