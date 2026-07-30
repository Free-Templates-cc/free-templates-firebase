# Pages Specification

## Purpose

Application pages provide the user-facing interface for browsing, searching, downloading templates, managing membership, and account settings. They follow a consistent pattern of data fetching via React Query, responsive layout, and SEO meta tags.

## Requirements

### Requirement: HomePage
The system SHALL provide a HomePage at `/` with hero section, search bar, featured templates, categories, trust signals, and premium CTA.

#### Scenario: Hero section
- **GIVEN** the homepage loads
- **WHEN** it renders
- **THEN** it SHALL display a hero with headline, subtitle, and search bar
- **AND** the search bar SHALL navigate to `/templates?search=<query>` on submit

#### Scenario: Featured templates
- **GIVEN** the homepage loads
- **WHEN** the featured section renders
- **THEN** it SHALL display a grid of template cards with thumbnail images, titles, and badges

#### Scenario: Categories
- **GIVEN** the homepage loads
- **WHEN** the categories section renders
- **THEN** it SHALL display clickable category cards that link to `/templates?category=<slug>`

#### Scenario: Premium CTA
- **GIVEN** the homepage loads
- **WHEN** the premium CTA section renders
- **THEN** it SHALL display a call-to-action with benefits of premium membership and a "Go Premium" link to `/pricing`

### Requirement: BrowsePage
The system SHALL provide a BrowsePage at `/templates` with search, filters sidebar, template grid, pagination, and active filter tags.

#### Scenario: Search and filters
- **GIVEN** BrowsePage loads
- **WHEN** rendered
- **THEN** it SHALL display a search bar, filter sidebar (category, framework, price tier, sort), and a template grid
- **AND** filters SHALL sync with URL query parameters

#### Scenario: Template grid
- **GIVEN** templates are loaded
- **WHEN** the grid renders
- **THEN** it SHALL display template cards with thumbnail, title, badges, and download button
- **AND** the grid SHALL be responsive (1 column mobile, 2 tablet, 3 desktop)

#### Scenario: Pagination
- **GIVEN** multiple pages of results
- **WHEN** the pagination controls render
- **THEN** it SHALL display page numbers with prev/next buttons
- **AND** the current page SHALL have `aria-current="page"`

#### Scenario: Active filter tags
- **GIVEN** filters are active
- **WHEN** the page renders
- **THEN** it SHALL display removable filter tags below the search bar
- **AND** clicking a tag SHALL remove that filter

#### Scenario: Mobile filters
- **GIVEN** the viewport is below `lg` breakpoint
- **WHEN** BrowsePage renders
- **THEN** filters SHALL collapse into a slide-over drawer with a toggle button

#### Scenario: Empty results
- **GIVEN** no templates match the current filters
- **WHEN** the grid renders
- **THEN** it SHALL display an "No templates found" message with suggestions to adjust filters

#### Scenario: Error state
- **GIVEN** the data fetch fails
- **WHEN** BrowsePage renders
- **THEN** it SHALL display an error message with a retry button
- **AND** the button SHALL trigger `refetch()` on the React Query

### Requirement: TemplateDetailPage
The system SHALL provide a TemplateDetailPage at `/templates/:slug` with image gallery, template info, download button, and related templates.

#### Scenario: Template info
- **GIVEN** a valid slug
- **WHEN** the page loads
- **THEN** it SHALL display template name, description, features list, tags, framework badge, category, demo link, and GitHub link

#### Scenario: Image gallery
- **GIVEN** a template with preview images
- **WHEN** the gallery renders
- **THEN** it SHALL display a main image with clickable thumbnails below

#### Scenario: Download button — Free template
- **GIVEN** a free template and the user is logged in
- **WHEN** the download section renders
- **THEN** the button SHALL say "Download Free" and trigger the `getDownloadUrl` Cloud Function on click
- **AND** a loading spinner SHALL show during the download request

#### Scenario: Download button — Premium + subscriber
- **GIVEN** a premium template and the user has an active subscription
- **WHEN** the download section renders
- **THEN** the button SHALL say "Download Premium" and trigger the `getDownloadUrl` Cloud Function

#### Scenario: Download button — Premium + not subscriber
- **GIVEN** a premium template and the user is not a premium subscriber
- **WHEN** the download section renders
- **THEN** the button SHALL say "Upgrade to Premium" and link to `/pricing`

#### Scenario: Download button — Not logged in
- **GIVEN** the user is not authenticated
- **WHEN** the download section renders
- **THEN** the button SHALL say "Sign in to Download" and link to `/login`

#### Scenario: Related templates
- **GIVEN** a template is displayed
- **WHEN** the related section renders
- **THEN** it SHALL show up to 4 related templates from the same category

#### Scenario: 404
- **GIVEN** an invalid slug
- **WHEN** the page loads
- **THEN** it SHALL display a "Template not found" message with a link back to `/templates`

#### Scenario: Download count
- **GIVEN** a template has downloads
- **WHEN** the page renders
- **THEN** it SHALL display the live download count (polled every 60s)

### Requirement: PricingPage
The system SHALL provide a PricingPage at `/pricing` with a comparison of free vs premium tiers and monthly/yearly toggle.

#### Scenario: Tier comparison
- **GIVEN** PricingPage loads
- **WHEN** it renders
- **THEN** it SHALL display two pricing cards: Free ($0) and Premium (with monthly/yearly pricing)
- **AND** each card SHALL list included features

#### Scenario: Monthly/yearly toggle
- **GIVEN** PricingPage loads
- **WHEN** the user toggles between monthly and yearly
- **THEN** the premium price SHALL update accordingly (yearly SHALL show discount)

#### Scenario: Upgrade button
- **GIVEN** a logged-in user clicks "Upgrade" on the Premium card
- **WHEN** clicked
- **THEN** it SHALL call the `createCheckoutSession` Cloud Function
- **AND** redirect the user to Stripe Checkout
- **AND** show a loading spinner while processing

### Requirement: LoginPage
The system SHALL provide a LoginPage at `/login` with email/password and Google OAuth authentication, zod validation, and redirect support.

#### Scenario: Email/password login
- **GIVEN** a user enters email and password
- **WHEN** they submit the form
- **THEN** `signInWithEmailAndPassword` SHALL be called
- **AND** on success, the user SHALL be redirected to the `redirect` param or `/`

#### Scenario: Google OAuth
- **GIVEN** a user clicks "Sign in with Google"
- **WHEN** clicked
- **THEN** `signInWithPopup` with Google provider SHALL be called

#### Scenario: Form validation
- **GIVEN** invalid input (invalid email, short password)
- **WHEN** the form is submitted
- **THEN** zod validation errors SHALL be displayed below each field

#### Scenario: Forgot password link
- **GIVEN** the LoginPage renders
- **WHEN** viewed
- **THEN** a "Forgot password?" link SHALL navigate to `/forgot-password`

### Requirement: RegisterPage
The system SHALL provide a RegisterPage at `/register` with email/password registration, Google OAuth, terms acceptance, and email verification.

#### Scenario: Email/password registration
- **GIVEN** a user enters name, email, password, and accepts terms
- **WHEN** they submit
- **THEN** `createUserWithEmailAndPassword` SHALL be called
- **AND** a Firestore user document SHALL be created at `users/{uid}`
- **AND** `sendEmailVerification` SHALL be called
- **AND** the user SHALL be redirected to `/login` with a toast to verify email

#### Scenario: Terms acceptance
- **GIVEN** the registration form
- **WHEN** the user does not check the terms acceptance checkbox
- **THEN** zod `z.literal(true)` validation SHALL show an error

#### Scenario: Google OAuth
- **GIVEN** a user clicks "Sign up with Google"
- **WHEN** clicked
- **THEN** `signInWithPopup` with Google provider SHALL be called
- **AND** a Firestore user document SHALL be created if it doesn't exist

#### Scenario: Email verification error
- **GIVEN** email verification sending fails
- **WHEN** registration completes
- **THEN** the user SHALL still be created but SHALL see a warning toast

### Requirement: ForgotPasswordPage
The system SHALL provide a ForgotPasswordPage at `/forgot-password` that sends a password reset email via Firebase Auth.

#### Scenario: Reset email
- **GIVEN** a user submits their email
- **WHEN** the form is submitted
- **THEN** `sendPasswordResetEmail` SHALL be called
- **AND** a success toast SHALL be shown
- **AND** a link to return to login SHALL be displayed

### Requirement: AccountPage
The system SHALL provide an AccountPage at `/account` with profile details, subscription management, and password change.

#### Scenario: Profile display
- **GIVEN** a logged-in user
- **WHEN** the page loads
- **THEN** it SHALL display user name, email, and subscription status

#### Scenario: Subscription actions
- **GIVEN** a premium user
- **WHEN** they click "Cancel Subscription"
- **THEN** the `cancelSubscription` Cloud Function SHALL be called
- **AND** a loading state and success toast SHALL be shown

#### Scenario: Reactivate
- **GIVEN** a canceled premium user
- **WHEN** they click "Reactivate"
- **THEN** the `reactivateSubscription` Cloud Function SHALL be called

#### Scenario: Billing portal
- **GIVEN** a premium user
- **WHEN** they click "Manage Billing"
- **THEN** the `createBillingPortalSession` Cloud Function SHALL be called
- **AND** the user SHALL be redirected to the Stripe Customer Portal

#### Scenario: Change password
- **GIVEN** a logged-in user
- **WHEN** they submit the change password form
- **THEN** the current password SHALL be re-authenticated via `reauthenticateWithCredential`
- **AND** the password SHALL be updated via `updatePassword`

### Requirement: DownloadHistoryPage
The system SHALL provide a DownloadHistoryPage at `/account/downloads` listing the user's past downloads with template details.

#### Scenario: Download list
- **GIVEN** a user with download history
- **WHEN** the page loads
- **THEN** it SHALL display a list of downloaded templates with name, date, and template link

#### Scenario: Empty state
- **GIVEN** a user with no downloads
- **WHEN** the page loads
- **THEN** it SHALL display a "No downloads yet" message with a link to browse templates

### Requirement: Static Pages
The system SHALL provide static content pages for Terms of Service (`/terms`), Privacy Policy (`/privacy`), Contact (`/contact`), and FAQ (`/faq`).

#### Scenario: Terms page
- **GIVEN** a user visits `/terms`
- **WHEN** it renders
- **THEN** it SHALL display the Terms of Service content with proper headings and sections

#### Scenario: Privacy page
- **GIVEN** a user visits `/privacy`
- **WHEN** it renders
- **THEN** it SHALL display the Privacy Policy content

#### Scenario: Contact page
- **GIVEN** a user visits `/contact`
- **WHEN** it renders
- **THEN** it SHALL display contact information and optionally a contact form

#### Scenario: FAQ page
- **GIVEN** a user visits `/faq`
- **WHEN** it renders
- **THEN** it SHALL display frequently asked questions with expandable answers about membership, downloads, and account management

### Requirement: NotFoundPage
The system SHALL provide a 404 page for unmatched routes.

#### Scenario: 404 display
- **GIVEN** a user navigates to a non-existent route
- **WHEN** NotFoundPage renders
- **THEN** it SHALL display a "Page not found" message with a link back to the homepage
