# UI Components Specification

## Purpose

Shared UI components that form the visual foundation of the template marketplace. Each component is designed to be reusable, accessible, and consistent with the Indigo/Amber design system.

## Requirements

### Requirement: Button
The system SHALL provide a Button component with multiple visual variants (primary, secondary, outline, ghost, danger) and sizes (sm, md, lg, xl).

#### Scenario: Default rendering
- **GIVEN** a Button with `variant="primary"` and `size="md"`
- **WHEN** it renders
- **THEN** it SHALL have indigo-600 background, white text, and medium padding
- **AND** it SHALL be an accessible `<button>` element by default

#### Scenario: Link mode
- **GIVEN** a Button with an `href` prop
- **WHEN** it renders
- **THEN** it SHALL render as an `<a>` element with the correct href

#### Scenario: Loading state
- **GIVEN** a Button with `isLoading=true`
- **WHEN** it renders
- **THEN** it SHALL show a spinner SVG and disable interaction
- **AND** it SHALL set `aria-busy="true"`

#### Scenario: Icon support
- **GIVEN** a Button with `leftIcon` or `rightIcon` props
- **WHEN** it renders
- **THEN** it SHALL render the icon component in the correct position

#### Scenario: Danger variant
- **GIVEN** a Button with `variant="danger"`
- **WHEN** it renders
- **THEN** it SHALL have red-600 background styling for destructive actions

### Requirement: Badge
The system SHALL provide a Badge component for status indicators and labels.

#### Scenario: Variants
- **GIVEN** a Badge with `variant="default"`, `"success"`, or `"warning"`
- **WHEN** it renders
- **THEN** it SHALL apply the corresponding color scheme (indigo, green, amber)

#### Scenario: Size
- **GIVEN** a Badge with `size="sm"` or `"md"`
- **WHEN** it renders
- **THEN** it SHALL adjust font size and padding accordingly

### Requirement: Card
The system SHALL provide a Card component with Header, Content, and Footer sub-components for content containers.

#### Scenario: Basic card
- **GIVEN** a Card with children
- **WHEN** it renders
- **THEN** it SHALL render with white background, rounded corners, shadow, and padding

#### Scenario: Card sections
- **GIVEN** Card.Header, Card.Content, and Card.Footer sub-components
- **WHEN** used within a Card
- **THEN** they SHALL provide consistent spacing and visual hierarchy

### Requirement: Input
The system SHALL provide an Input component with label, error display, and icon support.

#### Scenario: Label and error
- **GIVEN** an Input with `label` and `error` props
- **WHEN** it renders
- **THEN** it SHALL display the label above and error message below the input field
- **AND** the input SHALL have red border styling when error is present
- **AND** the input SHALL have `aria-invalid="true"` and `aria-describedby` for accessibility

#### Scenario: Icon
- **GIVEN** an Input with `icon` prop (a React node)
- **WHEN** it renders
- **THEN** it SHALL display the icon inside the input, left-aligned

#### Scenario: Icon
- **GIVEN** an Input with `leftIcon` or `rightIcon` props
- **WHEN** it renders
- **THEN** it SHALL position the icon accordingly inside the input

### Requirement: Modal
The system SHALL provide a Modal component with focus trapping, backdrop click-to-close, and keyboard (Escape) dismissal.

#### Scenario: Open/close
- **GIVEN** a Modal with `isOpen=true`
- **WHEN** it renders
- **THEN** it SHALL display the modal with backdrop overlay
- **AND** focus SHALL be trapped within the modal
- **AND** pressing Escape SHALL close it
- **AND** clicking the backdrop SHALL close it

#### Scenario: Focus trap
- **GIVEN** an open Modal with focusable elements
- **WHEN** the user presses Tab on the last focusable element
- **THEN** focus SHALL wrap to the first focusable element
- **WHEN** the user presses Shift+Tab on the first focusable element
- **THEN** focus SHALL wrap to the last focusable element

#### Scenario: Focus restoration
- **GIVEN** a Modal that was opened
- **WHEN** it closes
- **THEN** focus SHALL be restored to the element that triggered the modal

### Requirement: Skeleton
The system SHALL provide a Skeleton component for loading placeholders with configurable shapes and dimensions.

#### Scenario: Variants
- **GIVEN** a Skeleton with `variant="text"`, `"circular"`, or `"rectangular"`
- **WHEN** it renders
- **THEN** it SHALL render the corresponding shape with an animated pulse effect

#### Scenario: Custom dimensions
- **GIVEN** a Skeleton with `width` and `height` props
- **WHEN** it renders
- **THEN** it SHALL apply those dimensions as inline styles

### Requirement: LazyImage
The system SHALL provide a LazyImage component that uses IntersectionObserver for lazy loading with placeholder, loading states, and configurable aspect ratio.

#### Scenario: Lazy loading
- **GIVEN** a LazyImage with a valid `src`
- **WHEN** the image enters the viewport
- **THEN** it SHALL load the image and display it
- **WHEN** the image has not yet entered viewport
- **THEN** it SHALL show a placeholder/skeleton

#### Scenario: Aspect ratio
- **GIVEN** a LazyImage with `aspectRatio="16/9"` or `"4/3"` or `"1/1"`
- **WHEN** it renders
- **THEN** the container SHALL maintain that aspect ratio

### Requirement: Breadcrumbs
The system SHALL provide a Breadcrumbs component with navigation links and active page indicator.

#### Scenario: Navigation path
- **GIVEN** a Breadcrumbs with an array of `{label, href}` items
- **WHEN** it renders
- **THEN** it SHALL display the path with separators
- **AND** the last item SHALL be rendered as plain text (current page)
- **AND** all preceding items SHALL be clickable links

### Requirement: ErrorBoundary
The system SHALL provide an ErrorBoundary component that catches rendering errors and displays a fallback UI with a retry button.

#### Scenario: Error catch
- **GIVEN** an ErrorBoundary wrapping a child component
- **WHEN** the child throws during rendering
- **THEN** ErrorBoundary SHALL catch the error and display the fallback UI
- **AND** the "Try Again" button SHALL reset the error state and re-render children

#### Scenario: No error
- **GIVEN** an ErrorBoundary wrapping a child component
- **WHEN** the child renders without error
- **THEN** the children SHALL be rendered normally without fallback UI

### Requirement: NetworkStatusBanner
The system SHALL provide a NetworkStatusBanner component that displays a warning when the browser goes offline.

#### Scenario: Offline detection
- **GIVEN** the browser is offline
- **WHEN** NetworkStatusBanner renders
- **THEN** it SHALL display an amber-colored warning banner with "You are offline" message
- **WHEN** the browser comes back online
- **THEN** the banner SHALL be hidden

### Requirement: SubscriptionBadge
The system SHALL provide a SubscriptionBadge component that shows the user's current membership tier.

#### Scenario: Premium display
- **GIVEN** `tier="premium"` and `status="active"`
- **WHEN** it renders
- **THEN** it SHALL display "Premium" with amber/gold styling

#### Scenario: Free display
- **GIVEN** `tier="free"` or no tier
- **WHEN** it renders
- **THEN** it SHALL display "Free" with gray styling
