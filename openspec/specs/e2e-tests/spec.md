# E2E Tests Specification

## Purpose

Playwright end-to-end tests validate critical user flows across the full application — homepage rendering, browse page filtering, pricing page interaction, static page accessibility, and navigation.

## Requirements

### Requirement: Homepage E2E
The system SHALL provide Playwright tests that verify the homepage renders correctly.

#### Scenario: Homepage loads
- **GIVEN** a browser visits `/`
- **WHEN** the page loads
- **THEN** the hero section SHALL be visible
- **AND** the search bar SHALL be present
- **AND** featured templates SHALL be displayed
- **AND** category cards SHALL be visible
- **AND** the navbar SHALL contain navigation links
- **AND** the footer SHALL be visible

### Requirement: Browse Page E2E
The system SHALL provide Playwright tests that verify template filtering and search.

#### Scenario: Filter templates by category
- **GIVEN** a browser visits `/templates`
- **WHEN** they click a category filter
- **THEN** the URL SHALL update with the category parameter
- **AND** only matching templates SHALL be shown

#### Scenario: Search templates
- **GIVEN** a browser visits `/templates`
- **WHEN** they type in the search bar and submit
- **THEN** the URL SHALL update with the search query
- **AND** results SHALL match the search term

#### Scenario: Price tier filter
- **GIVEN** a browser visits `/templates`
- **WHEN** they toggle the "Free" price tier filter
- **THEN** only free templates SHALL be displayed

### Requirement: Pricing Page E2E
The system SHALL provide Playwright tests that verify the pricing page.

#### Scenario: Pricing tiers
- **GIVEN** a browser visits `/pricing`
- **WHEN** the page loads
- **THEN** free and premium pricing cards SHALL be visible
- **AND** the monthly/yearly toggle SHALL work

### Requirement: Static Pages E2E
The system SHALL provide Playwright tests that verify static pages load correctly.

#### Scenario: Static pages are accessible
- **GIVEN** a browser visits `/terms`, `/privacy`, `/contact`, `/faq`
- **WHEN** each page loads
- **THEN** the page SHALL have a heading and content
- **AND** the navbar and footer SHALL be present

### Requirement: Navigation E2E
The system SHALL provide Playwright tests that verify navigation links work.

#### Scenario: Navigation links
- **GIVEN** a browser is on the homepage
- **WHEN** they click each navbar link
- **THEN** the browser SHALL navigate to the correct page
- **AND** the page SHALL render without errors
