# Route Guards Specification

## Purpose

Route guard components (ProtectedRoute, PremiumRoute) control access to pages based on authentication status and subscription tier. They redirect unauthenticated or non-premium users to the appropriate page.

## Requirements

### Requirement: ProtectedRoute
The system SHALL provide a ProtectedRoute that redirects unauthenticated users to the login page.

#### Scenario: Authenticated user
- **GIVEN** a user is authenticated (user object exists in authStore)
- **WHEN** they navigate to a protected route wrapped in ProtectedRoute
- **THEN** the protected content SHALL be rendered

#### Scenario: Not authenticated
- **GIVEN** a user is not authenticated
- **WHEN** they navigate to a protected route
- **THEN** they SHALL be redirected to `/login`
- **AND** the `redirect` query parameter SHALL contain the attempted URL

#### Scenario: Loading state
- **GIVEN** auth state is loading (isLoading is true in authStore)
- **WHEN** ProtectedRoute renders
- **THEN** it SHALL display a loading spinner (PageLoader) and not redirect

### Requirement: PremiumRoute
The system SHALL provide a PremiumRoute that redirects non-premium users to the pricing page.

#### Scenario: Premium subscriber
- **GIVEN** the user has an active premium subscription
- **WHEN** they navigate to a premium-only route
- **THEN** the premium content SHALL be rendered

#### Scenario: Not premium
- **GIVEN** the user is authenticated but does not have premium
- **WHEN** they navigate to a premium-only route
- **THEN** they SHALL be redirected to `/pricing`

#### Scenario: Not authenticated
- **GIVEN** the user is not authenticated
- **WHEN** they navigate to a premium-only route
- **THEN** they SHALL be redirected to `/login`

#### Scenario: Loading state
- **GIVEN** auth state is loading
- **WHEN** PremiumRoute renders
- **THEN** it SHALL display a loading spinner and not redirect
