# Seed Script Specification

## Purpose

The seed script (`scripts/seed-emulator.ts`) populates the Firestore emulator with 24 mock templates for development and testing. It is run via `npm run seed:emulators`.

## Requirements

### Requirement: Template seeding
The system SHALL provide a seed script that creates 24 diverse template documents in the Firestore emulator.

#### Scenario: Seed execution
- **GIVEN** the Firestore emulator is running
- **WHEN** `npm run seed:emulators` is executed
- **THEN** it SHALL connect to the Firestore emulator at localhost:8080
- **AND** create 24 template documents in the `templates` collection
- **AND** each template SHALL have all required fields (name, slug, description, category, framework, priceTier, features, tags, mainImage, previewImages, downloads, published, createdAt, updatedAt)

#### Scenario: Template variety
- **GIVEN** the seed data
- **WHEN** created
- **THEN** it SHALL include templates across multiple categories: landing page, portfolio, e-commerce, blog, dashboard, SaaS
- **AND** SHALL include multiple frameworks: React, Next.js, Vue, Nuxt, Gatsby
- **AND** SHALL include both free and premium price tiers
- **AND** SHALL have realistic names and descriptions
- **AND** SHALL have seeded deterministic image URLs via picsum.photos

#### Scenario: Idempotency
- **GIVEN** the seed script runs multiple times
- **WHEN** templates already exist
- **THEN** it SHALL either skip or overwrite existing templates
- **AND** NOT create duplicate entries
