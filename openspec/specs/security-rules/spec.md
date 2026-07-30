# Security Rules Specification

## Purpose

Firestore and Firebase Storage security rules enforce access control for all data and file operations. They implement principle of least privilege — public read for templates and previews, owner-only access for user data, admin-only write for templates, and premium-only access for premium template files.

## Requirements

### Requirement: Firestore Rules
The system SHALL define Firestore security rules (`firestore.rules`) with helper functions and collection-level access controls.

#### Scenario: Helper functions
- **GIVEN** any rule evaluation
- **WHEN** `isAuthenticated()` is called
- **THEN** it SHALL return `true` when `request.auth != null`
- **WHEN** `isAdmin()` is called
- **THEN** it SHALL return `true` when the user's `role == 'admin'`
- **WHEN** `isOwner(userId)` is called
- **THEN** it SHALL return `true` when `request.auth.uid == userId`
- **WHEN** `hasActivePremium(userId)` is called
- **THEN** it SHALL return `true` when the user has `subscription.tier == 'premium'` and status is active or past_due, and `currentPeriodEnd >= request.time`

#### Scenario: Users collection
- **GIVEN** a Firestore read on `users/{userId}`
- **WHEN** the requester owns the document or is admin
- **THEN** read SHALL be allowed
- **WHEN** neither owner nor admin
- **THEN** read SHALL be denied

- **GIVEN** a Firestore create on `users/{userId}`
- **WHEN** the requester owns the document
- **THEN** create SHALL be allowed

- **GIVEN** a Firestore update on `users/{userId}`
- **WHEN** the requester owns the document
- **AND** only `displayName`, `photoURL`, or `updatedAt` fields are changed
- **THEN** update SHALL be allowed
- **WHEN** the update attempts to change subscription or role fields
- **THEN** update SHALL be denied

- **GIVEN** a Firestore delete on `users/{userId}`
- **WHEN** any requester attempts it
- **THEN** delete SHALL be denied

#### Scenario: Templates collection
- **GIVEN** a Firestore read on `templates/{templateId}`
- **WHEN** any requester (authenticated or not)
- **THEN** read SHALL be allowed

- **GIVEN** a Firestore write on `templates/{templateId}`
- **WHEN** the requester is admin
- **THEN** create/update/delete SHALL be allowed
- **WHEN** the requester is not admin
- **THEN** write SHALL be denied

#### Scenario: Downloads collection
- **GIVEN** a Firestore read on `downloads/{downloadId}`
- **WHEN** the requester is the owner (`resource.data.userId == request.auth.uid`)
- **THEN** read SHALL be allowed

- **GIVEN** a Firestore create on `downloads/{downloadId}`
- **WHEN** the requester is authenticated
- **AND** `request.resource.data.userId == request.auth.uid`
- **THEN** create SHALL be allowed

#### Scenario: Default deny
- **GIVEN** any Firestore path not explicitly matched
- **WHEN** read or write is attempted
- **THEN** it SHALL be denied

### Requirement: Storage Rules
The system SHALL define Firebase Storage security rules (`storage.rules`) with tiered access for template previews, free files, premium files, and user avatars.

#### Scenario: Template previews
- **GIVEN** any file under `template-previews/`
- **WHEN** a read is attempted
- **THEN** it SHALL be publicly allowed
- **WHEN** a write is attempted by an admin
- **THEN** it SHALL be allowed
- **WHEN** a write is attempted by a non-admin
- **THEN** it SHALL be denied

#### Scenario: Free template files
- **GIVEN** any file under `template-files/free/`
- **WHEN** a read is attempted
- **THEN** it SHALL be publicly allowed
- **WHEN** a write is attempted by an admin
- **THEN** it SHALL be allowed

#### Scenario: Premium template files
- **GIVEN** any file under `template-files/premium/`
- **WHEN** a direct read is attempted
- **THEN** it SHALL be denied (accessible only via `getDownloadUrl` signed URLs)
- **WHEN** a write is attempted by an admin
- **THEN** it SHALL be allowed

#### Scenario: User avatars
- **GIVEN** a file under `user-avatars/{userId}/{fileName}`
- **WHEN** a read is attempted
- **THEN** it SHALL be publicly allowed
- **WHEN** a write is attempted by the owner (`request.auth.uid == userId`)
- **AND** the file is under 2 MB
- **AND** the content type matches `image/*`
- **THEN** it SHALL be allowed

#### Scenario: Default deny
- **GIVEN** any Storage path not explicitly matched
- **WHEN** read or write is attempted
- **THEN** it SHALL be denied
