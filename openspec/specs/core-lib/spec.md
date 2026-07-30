# Core Library Specification

## Purpose

Core library modules (api, firebase, queryClient, utils) provide the foundational infrastructure for data fetching, Firebase initialization, React Query configuration, and shared utility functions used across the application.

## Requirements

### Requirement: API Layer
The system SHALL provide an API module (`src/lib/api.ts`) with mock data functions for templates, downloads, and Cloud Function helpers for subscription management.

#### Scenario: Template fetching
- **GIVEN** filter criteria (search, category, framework, priceTier, sort, page)
- **WHEN** `fetchTemplates()` is called
- **THEN** it SHALL return a promise with `{ templates, totalPages, total }`
- **AND** results SHALL be filtered by search query (name/description match)
- **AND** results SHALL be filtered by category, framework, and priceTier
- **AND** results SHALL be sorted by newest, name, or popularity
- **AND** results SHALL be paginated (12 per page)

#### Scenario: Single template
- **GIVEN** a template slug
- **WHEN** `fetchTemplate(slug)` is called
- **THEN** it SHALL return the matching template or `null`

#### Scenario: Related templates
- **GIVEN** a template object
- **WHEN** `fetchRelatedTemplates(template)` is called
- **THEN** it SHALL return up to 4 templates in the same category, excluding the given template

#### Scenario: Download count
- **GIVEN** a template ID
- **WHEN** `fetchDownloadCount(id)` is called
- **THEN** it SHALL return a download count number

#### Scenario: Download history
- **GIVEN** a user ID
- **WHEN** `fetchDownloads(userId)` is called
- **THEN** it SHALL return an array of download records with template info

#### Scenario: Cloud Function helpers
- **GIVEN** subscription actions (createCheckoutSession, cancelSubscription, reactivateSubscription, createBillingPortalSession, getDownloadUrl)
- **WHEN** the helpers are called
- **THEN** they SHALL call `httpsCallable` on the Firebase Functions instance
- **AND** return the Cloud Function response data

#### Scenario: Image URL injection
- **GIVEN** template data
- **WHEN** `injectImages()` processes templates
- **THEN** it SHALL attach deterministic `mainImage` and `previewImages` URLs using picsum.photos seeded by slug

### Requirement: Firebase SDK
The system SHALL provide a Firebase initialization module (`src/lib/firebase.ts`) that configures and exports Firebase app, auth, Firestore, storage, and Functions instances.

#### Scenario: Initialization
- **GIVEN** environment variables are set
- **WHEN** the module loads
- **THEN** it SHALL initialize Firebase app with the config from `VITE_FIREBASE_*` env vars
- **AND** export `auth`, `db`, `storage`, `functions`, and `app` instances

#### Scenario: Emulator support
- **GIVEN** `VITE_USE_EMULATORS` is "true"
- **WHEN** Firebase initializes
- **THEN** it SHALL connect to Firestore and Auth emulators on localhost:8080 and :9099

### Requirement: QueryClient
The system SHALL provide a React Query (`@tanstack/react-query`) client with global defaults configured for optimal UX.

#### Scenario: Default configuration
- **GIVEN** the `QueryClient` is created
- **WHEN** used for queries
- **THEN** `staleTime` SHALL be 5 minutes
- **AND** `retry` SHALL be 2 with exponential backoff (2s/4s, cap 10s)
- **AND** `refetchOnWindowFocus` SHALL be true

#### Scenario: Online manager
- **GIVEN** the `onlineManager` is configured
- **WHEN** the browser fires online/offline events
- **THEN** React Query SHALL pause/resume queries accordingly

### Requirement: Utils
The system SHALL provide utility functions in `src/lib/utils.ts` for common formatting, class merging, slug generation, and image URL generation.

#### Scenario: Class merging
- **GIVEN** `cn()` is called with Tailwind classes
- **WHEN** there are conflicting classes
- **THEN** `tailwind-merge` SHALL resolve conflicts correctly
- **AND** non-Tailwind classes SHALL be passed through

#### Scenario: Number formatting
- **GIVEN** `formatNumber(1234)` is called
- **WHEN** formatting
- **THEN** it SHALL return "1,234"

#### Scenario: Date formatting
- **GIVEN** a `Timestamp` or Date
- **WHEN** `formatDate()` is called
- **THEN** it SHALL return a formatted date string like "Jan 15, 2024"

#### Scenario: Slug generation
- **GIVEN** a string like "My Awesome Template"
- **WHEN** `slugify()` is called
- **THEN** it SHALL return "my-awesome-template"
- **AND** handle special characters, accents, and edge cases (empty string, trailing hyphens)

#### Scenario: Template image URLs
- **GIVEN** a template slug
- **WHEN** `templateImageUrl(slug)` is called
- **THEN** it SHALL return a deterministic picsum.photos URL
- **WHEN** `templateGalleryUrls(slug)` is called
- **THEN** it SHALL return an array of 4 preview image URLs
