# TypeScript Types Specification

## Purpose

TypeScript type definitions (`src/types/index.ts`) define the shape of all domain entities — templates, users, subscriptions, downloads — ensuring type safety across the application. They serve as the single source of truth for data contracts.

## Requirements

### Requirement: Template type
The system SHALL define a `Template` type with all fields for template marketplace items.

#### Scenario: Template shape
- **GIVEN** the `Template` type
- **WHEN** used in components
- **THEN** it SHALL include: `id`, `name`, `slug`, `description`, `category`, `framework`, `priceTier` (free | premium), `demoUrl?`, `githubUrl?`, `features` (string[]), `tags` (string[]), `mainImage`, `previewImages` (string[]), `downloadUrl?`, `downloads` (number), `published` (boolean), `createdAt` (Timestamp), `updatedAt` (Timestamp)

### Requirement: User type
The system SHALL define a `UserProfile` type for Firestore user documents.

#### Scenario: User shape
- **GIVEN** the `UserProfile` type
- **WHEN** used in components
- **THEN** it SHALL include: `displayName`, `email`, `photoURL?`, `role` (user | admin), `subscription` (SubscriptionInfo), `downloadCount` (number), `createdAt` (Timestamp), `updatedAt` (Timestamp)

### Requirement: Subscription type
The system SHALL define a `SubscriptionInfo` type for membership tracking.

#### Scenario: Subscription shape
- **GIVEN** the `SubscriptionInfo` type
- **WHEN** used in components
- **THEN** it SHALL include: `status` (active | past_due | canceled | incomplete), `stripeCustomerId?`, `stripeSubscriptionId?`, `tier` (free | premium), `currentPeriodEnd?` (Timestamp), `canceledAt?` (Timestamp)

### Requirement: Download type
The system SHALL define a `Download` type for download history records.

#### Scenario: Download shape
- **GIVEN** the `Download` type
- **WHEN** used in components
- **THEN** it SHALL include: `id`, `userId`, `templateId`, `downloadedAt` (Timestamp), `ip?`

### Requirement: Filter types
The system SHALL define types for template filtering and pagination.

#### Scenario: FilterParams
- **GIVEN** the `FilterParams` type
- **WHEN** used in browse/search
- **THEN** it SHALL include: `search?`, `category?`, `framework?`, `priceTier?`, `sort?` (newest | popular | name), `page` (number)

#### Scenario: TemplateFilters
- **GIVEN** the `TemplateFilters` type
- **WHEN** used in the API
- **THEN** it SHALL include all FilterParams plus specific category/framework/price tier filters as defined strings

### Requirement: Cloud Function types
The system SHALL define response types for Cloud Function calls.

#### Scenario: Checkout session response
- **GIVEN** the `CreateCheckoutResponse` type
- **WHEN** returned from the Cloud Function
- **THEN** it SHALL include `sessionId` and `url` for Stripe redirect

#### Scenario: Download URL response
- **GIVEN** the `DownloadUrlResponse` type
- **WHEN** returned from `getDownloadUrl`
- **THEN** it SHALL include a signed `url` for the template file
