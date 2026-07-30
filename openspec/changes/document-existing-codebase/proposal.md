# Document Existing Codebase

## What

Create comprehensive OpenSpec specifications for all existing components, hooks, stores, pages, utilities, and backend code in the free-templates.cc template marketplace project.

## Why

- Provide a single source of truth for architectural decisions, component contracts, and data flow
- Enable faster onboarding for new contributors
- Catch design inconsistencies and gaps before they become production issues
- Lay the foundation for spec-driven development going forward

## Scope

Frontend (Vite + React + TypeScript) and Backend (Firebase Cloud Functions, Security Rules):

- 11 UI components (Button, Card, Badge, Input, Modal, Skeleton, LazyImage, Breadcrumbs, ErrorBoundary, NetworkStatusBanner, SubscriptionBadge)
- 4 layout components (Navbar, Footer, Layout, SEOHead)
- 2 route guards (ProtectedRoute, PremiumRoute)
- 8 hooks (useTemplates, useTemplate, useRelatedTemplates, useTemplateDownloadCount, useDownloads, useNetworkStatus, useScrollToTop, useDocumentTitle)
- 2 Zustand stores (authStore, uiStore)
- 15 pages (Home, Browse, TemplateDetail, Pricing, Login, Register, ForgotPassword, Account, DownloadHistory, NotFound, Terms, Privacy, Contact, FAQ)
- Core lib (api, firebase, queryClient, utils)
- TypeScript type definitions
- 8 Firebase Cloud Functions
- Firestore and Storage security rules
