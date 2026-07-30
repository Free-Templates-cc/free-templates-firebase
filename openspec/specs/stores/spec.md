# Stores Specification

## Purpose

Zustand stores manage client-side application state — authentication (authStore) and UI preferences (uiStore). They provide reactive state with persistence and real-time Firestore listeners.

## Requirements

### Requirement: authStore
The system SHALL provide an authStore that manages authentication state with Firebase Auth, real-time Firestore profile sync, and subscription status detection.

#### Scenario: Initial state
- **GIVEN** the app loads
- **WHEN** authStore initializes
- **THEN** `user`, `profile`, `isPremium`, `isAdmin` SHALL be falsy
- **AND** `isLoading` SHALL be `true`
- **AND** `initialized` SHALL be `false`

#### Scenario: Auth listener initialization
- **GIVEN** `initAuthListener()` is called
- **WHEN** Firebase `onAuthStateChanged` fires with no user
- **THEN** `user` SHALL be `null`, `isLoading` SHALL be `false`, `initialized` SHALL be `true`
- **AND** `onAuthStateChanged` SHALL only be registered once (subsequent calls are no-ops)

#### Scenario: User sign in
- **GIVEN** a user signs in
- **WHEN** `onAuthStateChanged` fires with a user object
- **THEN** `user` SHALL be set to the Firebase user
- **AND** a Firestore `onSnapshot` listener SHALL be started for `users/{uid}`

#### Scenario: Firestore profile sync
- **GIVEN** the profile snapshot exists
- **WHEN** the Firestore document updates
- **THEN** `profile` SHALL be updated with the document data
- **AND** `isPremium` SHALL be `true` if `subscription.tier === 'premium'` and `subscription.status === 'active'`
- **AND** `isAdmin` SHALL be `true` if `role === 'admin'`

#### Scenario: Non-existing document
- **GIVEN** a user just signed up
- **WHEN** the profile document does not exist yet
- **THEN** `profile` SHALL remain `null`
- **AND** `isPremium` SHALL be `false`

#### Scenario: Firestore error
- **GIVEN** the Firestore `onSnapshot` listener encounters an error
- **WHEN** the error callback fires
- **THEN** the error SHALL be logged to console
- **AND** `isLoading` SHALL be set to `false`
- **AND** `initialized` SHALL be set to `true`

#### Scenario: Sign out
- **GIVEN** a user was signed in with an active profile listener
- **WHEN** they sign out
- **THEN** `user`, `profile` SHALL be cleared
- **AND** `isPremium`, `isAdmin` SHALL be `false`
- **AND** `isLoading` SHALL be `false`
- **AND** `initialized` SHALL be `true`
- **AND** the profile listener SHALL be unsubscribed

#### Scenario: Listener cleanup
- **GIVEN** `cleanupAuthListener()` is called
- **WHEN** there is an active profile listener
- **THEN** it SHALL unsubscribe from the Firestore snapshot
- **WHEN** no listeners are active
- **THEN** it SHALL not throw

### Requirement: uiStore
The system SHALL provide a uiStore that manages UI preferences (dark mode, mobile menu) with localStorage persistence.

#### Scenario: Dark mode toggle
- **GIVEN** `uiStore.toggleDarkMode()` is called
- **WHEN** dark mode was `false`
- **THEN** it SHALL become `true` and add `dark` class to `<html>`
- **WHEN** dark mode was `true`
- **THEN** it SHALL become `false` and remove `dark` class from `<html>`

#### Scenario: Mobile menu
- **GIVEN** `uiStore.toggleMobileMenu()` is called
- **WHEN** `mobileMenuOpen` was `false`
- **THEN** it SHALL become `true`
- **WHEN** `mobileMenuOpen` was `true`
- **THEN** it SHALL become `false`

#### Scenario: Persistence
- **GIVEN** the app reloads
- **WHEN** `uiStore` rehydrates from localStorage
- **THEN** dark mode preference SHALL be restored
- **AND** if rehydrated state is null/undefined, defaults SHALL apply

#### Scenario: setDarkMode
- **GIVEN** `uiStore.setDarkMode(true)` is called
- **WHEN** dark mode is set
- **THEN** the `dark` class SHALL be added to `<html>`
- **AND** the preference SHALL be persisted
