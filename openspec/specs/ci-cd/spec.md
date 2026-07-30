# CI/CD Specification

## Purpose

GitHub Actions workflows automate linting, testing, building, and deployment. The CI workflow runs on every push/PR to main. The deploy workflow publishes to Firebase Hosting (production on main branch, preview channels for PRs) and deploys Cloud Functions.

## Requirements

### Requirement: CI Workflow
The system SHALL provide a CI workflow (`.github/workflows/ci.yml`) that runs linting and tests on every push/PR to main.

#### Scenario: Lint job
- **GIVEN** a push or PR to main
- **WHEN** the CI workflow runs
- **THEN** it SHALL check out the repository
- **AND** set up Node.js (version 20) with npm cache
- **AND** run `npm ci` to install dependencies
- **AND** run `npm run lint` (oxlint) with zero warnings required

#### Scenario: Test job
- **GIVEN** a push or PR to main
- **WHEN** the CI workflow runs
- **THEN** it SHALL check out the repository
- **AND** set up Node.js (version 20) with npm cache
- **AND** run `npm ci`
- **AND** run `npm test` (vitest) with `VITE_USE_FIREBASE_EMULATORS` set to `"false"`
- **AND** all tests SHALL pass

### Requirement: Deploy Workflow
The system SHALL provide a deploy workflow (`.github/workflows/deploy.yml`) for Firebase Hosting and Cloud Functions deployment.

#### Scenario: Production deployment
- **GIVEN** a push to the main branch
- **WHEN** the deploy workflow runs
- **THEN** it SHALL build the project with `npm ci && npm run build`
- **AND** authenticate with Firebase using `FIREBASE_SERVICE_ACCOUNT` secret
- **AND** deploy to Firebase Hosting production target
- **AND** deploy Cloud Functions from the `functions/` directory

#### Scenario: PR preview deployment
- **GIVEN** a pull request is opened or updated
- **WHEN** the deploy workflow runs
- **THEN** it SHALL build the project
- **AND** deploy to a Firebase Hosting preview channel named after the PR number
- **AND** comment the preview URL on the PR

#### Scenario: Environment secrets
- **GIVEN** the deploy workflow runs
- **WHEN** it needs configuration
- **THEN** it SHALL use repository secrets: `FIREBASE_SERVICE_ACCOUNT`, `FIREBASE_PROJECT_ID`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_PREMIUM_MONTHLY`, `STRIPE_PRICE_ID_PREMIUM_YEARLY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `SITE_URL`
