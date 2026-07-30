# Hooks Specification

## Purpose

Custom React hooks encapsulate data fetching, state management, and browser API interactions. They follow consistent patterns using React Query for server state and provide loading/error/data return shapes.

## Requirements

### Requirement: useTemplates
The system SHALL provide a `useTemplates` hook that fetches a filtered, sorted, and paginated list of templates using React Query.

#### Scenario: Fetch with filters
- **GIVEN** filter params (search, category, framework, priceTier, sort, page)
- **WHEN** `useTemplates` is called
- **THEN** it SHALL return `{ data, isLoading, error }`
- **AND** `data` SHALL contain `templates: Template[]`, `totalPages: number`, and `total: number`
- **AND** the query key SHALL include all filter params for proper caching

#### Scenario: Error state
- **GIVEN** the fetch fails
- **WHEN** `useTemplates` is called
- **THEN** it SHALL expose an `error` property

### Requirement: filtersFromParams
The system SHALL provide a `filtersFromParams` utility that parses URL search params into typed filter values.

#### Scenario: Parse URL params
- **GIVEN** a URL with `?search=landing&category=landing&page=2&sort=name&framework=react&priceTier=free`
- **WHEN** `filtersFromParams(searchParams)` is called
- **THEN** it SHALL return an object with all parsed filter values

#### Scenario: Invalid page
- **GIVEN** a URL with `?page=abc`
- **WHEN** `filtersFromParams` is called
- **THEN** `page` SHALL default to `1`

### Requirement: useTemplate
The system SHALL provide a `useTemplate` hook that fetches a single template by slug.

#### Scenario: By slug
- **GIVEN** a valid template slug
- **WHEN** `useTemplate(slug)` is called
- **THEN** it SHALL return the matching template or `null` if not found

### Requirement: useRelatedTemplates
The system SHALL provide a `useRelatedTemplates` hook that fetches templates in the same category, excluding the current one.

#### Scenario: Related content
- **GIVEN** a template with a category and ID
- **WHEN** `useRelatedTemplates(template)` is called
- **THEN** it SHALL return up to 4 templates in the same category, excluding the given one

### Requirement: useTemplateDownloadCount
The system SHALL provide a `useTemplateDownloadCount` hook that polls download count every 60 seconds.

#### Scenario: Polling
- **GIVEN** a template ID
- **WHEN** `useTemplateDownloadCount(templateId)` is called
- **THEN** it SHALL return a `count` number (default 0)
- **AND** it SHALL refetch every 60 seconds via `refetchInterval`

### Requirement: useDownloads
The system SHALL provide a `useDownloads` hook that fetches download history for the current user.

#### Scenario: Fetch history
- **GIVEN** a user is authenticated
- **WHEN** `useDownloads()` is called
- **THEN** it SHALL return an array of download records with template info
- **AND** the query SHALL be disabled when no user is logged in (`enabled: !!user`)

### Requirement: useNetworkStatus
The system SHALL provide a `useNetworkStatus` hook that tracks browser online/offline state.

#### Scenario: Online
- **GIVEN** the browser is online
- **WHEN** `useNetworkStatus()` is called
- **THEN** it SHALL return `{ isOnline: true }`

#### Scenario: Offline
- **GIVEN** the browser goes offline
- **WHEN** `useNetworkStatus()` is called
- **THEN** it SHALL return `{ isOnline: false }`

### Requirement: useScrollToTop
The system SHALL provide a `useScrollToTop` hook that scrolls to the top of the page on route change.

#### Scenario: Route change
- **GIVEN** the route (pathname) changes
- **WHEN** `useScrollToTop()` is active
- **THEN** the window SHALL scroll to (0, 0)

### Requirement: useDocumentTitle
The system SHALL provide a `useDocumentTitle` hook that sets the document title with optional suffix.

#### Scenario: Set title
- **GIVEN** `useDocumentTitle('Browse Templates')`
- **WHEN** it runs
- **THEN** the document title SHALL be set to "Browse Templates | Free Templates"

#### Scenario: No suffix
- **GIVEN** `useDocumentTitle('Admin', { suffix: false })`
- **WHEN** it runs
- **THEN** the document title SHALL be set to exactly "Admin"
