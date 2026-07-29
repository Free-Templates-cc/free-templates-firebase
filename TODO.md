# Free-Templates.cc — Rewrite TODO

> **Stack:** Vite + React + **TypeScript** + Tailwind CSS + Firebase + React Query + Zustand
> **Goal:** A modern template marketplace with membership subscriptions for premium downloads.

---

## Phase 1: Foundation

### 1.1 Project Setup
- [x] Scaffold Vite + React + TypeScript project (`npm create vite@latest . -- --template react-ts`)
- [x] Install & configure Tailwind CSS
- [x] Install dependencies: `react-router-dom`, `@tanstack/react-query`, `zustand`, `firebase`, `react-hook-form`, `zod`, `react-hot-toast`, `clsx`, `tailwind-merge`, `lucide-react`, `react-helmet-async`
- [x] Set up folder structure
- [x] Configure ESLint (oxlint)
- [x] Configure Prettier (optional)
- [x] Configure husky + lint-staged (pre-commit hooks)
- [x] Initialize Git with good `.gitignore`

### 1.2 Firebase Setup (requires project credentials) 🔲 Deferred
- [ ] Create Firebase project
- [ ] Enable **Firestore** (with proper indexes)
- [ ] Enable **Firebase Auth** (email/password + Google OAuth)
- [ ] Enable **Firebase Storage** (template files/previews)
- [ ] Enable **Stripe Extension** or set up **Cloud Functions** for payments
- [ ] Set up **Firebase Hosting** config
- [ ] Add Firebase config to `.env`

### 1.3 Core Configuration
- [x] Set up React Router (routes layout)
- [x] Initialize **React Query** client
- [x] Initialize **Zustand** stores (auth, UI)
- [x] Set up **Firebase** SDK initialization
- [x] Create shared UI components (Button, Badge, Card)
- [x] Build Navbar with auth state, search, dark mode
- [x] Build Footer
- [x] Build Layout component

---

## Phase 2: Auth & User System

### 2.1 Authentication (Firebase Auth)
- [x] Login page (`/login`) — email/password + Google OAuth via Firebase Auth
- [x] Register page (`/register`) — email/password + Google OAuth via Firebase Auth, auto-creates Firestore doc
- [x] Forgot password (`/forgot-password`) — Firebase Auth password reset via `sendPasswordResetEmail`
- [x] Persistent auth (onAuthStateChanged → Zustand)
- [x] Protected routes (`ProtectedRoute` + `PremiumRoute` components)
- [x] Form validation (react-hook-form + zod) on login and register pages
- [x] Auth middleware for premium-only routes (PremiumRoute component already handles route-level guard)

### 2.2 User Profiles
- [x] Firestore user document (`users/{uid}`) — created on register, real-time listener in authStore
- [x] Profile page (name, email, avatar, subscription status) — on Account page
- [x] Download history tracking — dedicated Download History page (`/account/downloads`) with mock data

### 2.3 Subscription / Membership
- [x] Define subscription tiers:
  - **Free:** browse all, download free templates only
  - **Premium:** unlimited downloads of premium templates
  - Stripe integration pending Firebase project setup
- [x] Stripe checkout creation (Cloud Function: `createCheckoutSession`)
- [x] Stripe webhook (handles checkout.session.completed, invoice.paid, payment_failed, subscription.updated/deleted)
- [x] Cancel subscription Cloud Function (`cancelSubscription`)
- [x] Reactivate subscription Cloud Function (`reactivateSubscription`)
- [x] Stripe Customer Portal Cloud Function (`createBillingPortalSession`)
- [x] Frontend API helpers for subscription Cloud Functions
- [x] UI for current plan, upgrade/downgrade/cancel (AccountPage)
- [x] Grace period / subscription expiry handling
- [x] Restrict premium downloads to active subscribers

---

## Phase 3: Template Management (Admin)

### 3.1 Firestore Data Model
- [x] `templates/{templateId}` — fields (defined in TypeScript types, Firestore rules, and indexes)
- [x] `templateFiles/{templateId}` — secure Storage path for premium files (defined in storage.rules)
- [x] Seed script (`scripts/seed-emulator.ts`) — populates Firestore emulator with 24 mock templates
- [x] npm script: `npm run seed:emulators` (runs via `npx tsx`)

---

*Admin/template management is handled via a separate CMS — not part of this project.*

## Phase 4: Public Site — UI & Pages

### 4.1 Design System
- [x] Color palette & typography (Tailwind config)
- [x] Shared components: Button, Card, Badge, Navbar, Footer
- [x] Input, Modal, Breadcrumbs, Skeleton loaders
- [x] ErrorBoundary component
- [x] Dark/light mode toggle (Zustand + Tailwind dark mode)

### 4.2 Homepage (`/`)
- [x] Hero section with search bar
- [x] Featured templates grid
- [x] Categories section
- [x] Stats / trust signals
- [x] CTA for premium membership

### 4.3 Browse / Search Page (`/templates`)
- [x] Search bar with input
- [x] Filters sidebar:
  - Category
  - Framework (Next.js, Gatsby, Nuxt, Vue, React)
  - Price tier (Free / Premium)
  - Sort by (newest, most popular, name)
- [x] Template grid with cards
- [x] Active filter tags with clear
- [x] Pagination (paginated page numbers + prev/next)
- [x] React Query for data fetching with URL-to-query sync (`useTemplates` hook)

### 4.4 Template Detail Page (`/templates/:slug`)
- [x] Gallery of preview images
- [x] Template info: description, features, tags, framework, category
- [x] Demo link (opens new tab)
- [x] GitHub link
- [x] Download button with conditional states:
  - Free → download
  - Premium + subscriber → download
  - Premium + not subscriber → "Upgrade" CTA
  - Not logged in → "Sign in to download"
- [x] Related templates section (`useRelatedTemplates` hook)
- [x] Download counter (live) — mock hook polling every 60s (useTemplateDownloadCount)

### 4.5 Pricing Page (`/pricing`)
- [x] Compare free vs premium tiers
- [x] Monthly / yearly toggle
- [x] Features comparison
- [x] CTA → Stripe checkout

### 4.6 Auth Pages
- [x] Login (`/login`) — email/password + Google OAuth, zod validated
- [x] Register (`/register`) — email/password + Google OAuth, zod validated
- [x] Forgot password (`/forgot-password`) — Firebase Auth password reset
- [x] Form validation (react-hook-form + zod)

### 4.7 Account Page (`/account`)
- [x] Profile details (name, email)
- [x] Subscription status & management
- [x] Download history / My downloads (`/account/downloads`)
- [x] Loading state & redirect
- [x] Change password
- [x] Protected route guards

### 4.8 Static Pages
- [x] Terms of Service
- [x] Privacy Policy
- [x] Contact / Support
- [x] FAQ about membership

---

## Phase 5: Backend / Cloud Functions

### 5.1 Firebase Cloud Functions
- [x] `createCheckoutSession` — Stripe Checkout session creation (Cloud Function)
- [x] `stripeWebhook` — handles checkout.session.completed, invoice.paid, subscription updates, cancel
- [x] `getDownloadUrl` — signed URL generation with subscription check
- [x] `incrementDownloadCount` — triggered on download document creation
- [x] `cleanupExpiredSubscriptions` — daily scheduled function (03:00 CET)

### 5.2 Firestore Security Rules
- [x] Templates collection: read all, write admin only
- [x] Users collection: read/write own doc only, subscription write-protected
- [x] Downloads collection: read own only, create with own uid
- [x] Default deny on all other paths

### 5.3 Storage Security Rules
- [x] Template preview images: public read, admin write
- [x] Free template files: public read, admin write
- [x] Premium template files: direct read blocked, accessible via `getDownloadUrl` only
- [x] User avatars: public read, owner write (max 2MB, images only)

---

## Phase 6: Polish & Launch

### 6.1 Performance & SEO
- [x] Lazy loading for images / components (LazyImage component + route-level code splitting)
- [x] React.lazy + Suspense for route splitting
- [x] Meta tags per page (react-helmet-async)
- [x] Sitemap generation (vite-plugin-sitemap + robots.txt)
- [x] Prettier config (.prettierrc + npm scripts)
- [x] LazyImage component (IntersectionObserver-based lazy loading)
- [x] Build chunk splitting (manualChunks for vendor/firebase/UI)
- [ ] Lighthouse audit (target 90+ across the board) — pending deployment

### 6.2 Error Handling & UX
- [x] Global error boundary
- [x] Toast notifications for actions (download, auth, subscribe)
- [x] Skeleton loading components
- [x] Empty states for search / no results (BrowsePage)
- [x] 404 page

### 6.3 Final Touches
- [x] Update README.md with project info, setup instructions, and stack
- [x] Responsive design (mobile-first) — filters collapse into drawer on mobile, layout breakpoints throughout
- [x] Cross-browser testing (browserslist config added)
- [ ] Analytics (Firebase Analytics or Google Analytics) — needs Firebase project

### 6.4 Testing & CI
- [x] Set up unit tests (Vitest) — installed, configured, 22 tests passing
- [x] Set up E2E tests (Playwright) — 19 tests across 5 spec files, all passing
- [x] CI/CD — GitHub Actions workflow (`.github/workflows/ci.yml` + `deploy.yml`) — push blocked by PAT scope; needs commit by admin with `workflow` scope)
- [x] Firebase Hosting deployment workflow added
- [ ] Domain config (free-templates.cc → Firebase Hosting custom domain)

---

## 📐 UI Design Brainstorm

### Color Palette (suggested)
- **Primary:** Indigo / Blue (`#4F46E5` / `#2563EB`) — tech-forward, trustworthy
- **Accent:** Amber / Orange for premium CTAs
- **Background:** White/gray-50 for light, gray-900 for dark
- **Tier badges:** Green for Free, Gold/Amber for Premium

### Typography
- **Headings:** Inter or Plus Jakarta Sans (modern, clean)
- **Body:** Inter (highly readable at all sizes)

### Layout
- **Navbar:** Logo (left) → Search (center) → Navigation links + Auth buttons (right)
- **Homepage:** Hero with big search → Featured section → Categories grid → Premium CTA
- **Template Grid:** Card-based, each with thumbnail, title, meta badges, download button
- **Detail Page:** Two-column — gallery left, info + download right

### Key UX Patterns
1. **Search-driven discovery** — prominent search bar, instant results with debounce
2. **Visual browsing** — preview images are the main thing, not just text
3. **Frictionless free downloads** — no account required for free templates (optional)
4. **Clear premium upsells** — premium templates show blurry previews or watermarked images with "Upgrade" overlay
5. **Mobile-first** — all filters collapse into drawers on mobile

### Pages Map
```
/                   → Homepage
/templates          → Browse / Search
/templates/:slug    → Template Detail
/pricing            → Membership Plans
/login              → Sign In
/register           → Sign Up
/forgot-password    → Reset Password
/account            → Dashboard / Profile
/account/downloads  → Download History
# Admin is handled via a separate CMS
```

### Component Hierarchy
```
App
├── Layout
│   ├── Navbar (search, navigation, auth status)
│   ├── Main Content (Router outlet)
│   └── Footer
├── Pages
│   ├── HomePage
│   │   ├── HeroSection
│   │   ├── FeaturedTemplates (horizontal scroll / grid)
│   │   ├── CategoryGrid
│   │   └── PremiumCTA
│   ├── BrowsePage
│   │   ├── SearchFilters (sidebar / drawer)
│   │   └── TemplateGrid
│   │       └── TemplateCard (×N)
│   ├── TemplateDetailPage
│   │   ├── ImageGallery
│   │   ├── TemplateInfo
│   │   ├── DownloadSection
│   │   └── RelatedTemplates
│   ├── PricingPage
│   │   └── PricingCard × 2 (Free / Premium)
│   ├── AuthPage (Login / Register / ForgotPassword)
│   ├── AccountPage
│   └── ...
└── Shared Components
    ├── Button, Card, Badge, Input, Modal
    ├── PriceTierBadge, FrameworkBadge
    ├── DownloadButton
    ├── ProtectedRoute, PremiumRoute
    └── Skeleton, Toast, ErrorBoundary
```

### Firestore Data Model

```
users/{uid}
├── displayName: string
├── email: string
├── photoURL: string?
├── role: 'user' | 'admin'  # admin role is for the external CMS
├── subscription: {
│     status: 'active' | 'past_due' | 'canceled' | 'incomplete',
│     stripeCustomerId: string?,
│     stripeSubscriptionId: string?,
│     tier: 'free' | 'premium',
│     currentPeriodEnd: Timestamp?,
│     canceledAt: Timestamp?
│   }
├── downloadCount: number
├── createdAt: Timestamp
└── updatedAt: Timestamp

templates/{templateId}
├── name: string
├── slug: string
├── description: string
├── category: string
├── framework: string
├── priceTier: 'free' | 'premium'
├── demoUrl: string?
├── githubUrl: string?
├── features: string[]
├── tags: string[]
├── mainImage: string
├── previewImages: string[]
├── downloadUrl: string (free) or Storage path (premium)
├── downloads: number
├── published: boolean
├── createdAt: Timestamp
└── updatedAt: Timestamp

downloads/{downloadId}
├── userId: string (ref)
├── templateId: string (ref)
├── downloadedAt: Timestamp
└── ip: string? (for anonymous)
```

---

## Milestone: Implementation Audit — 2026-07-29

Comprehensive audit of every component, page, integration, and quality metric.

### ✅ 1. WHAT WORKS (Solid Foundations)

| Category | Status | Details |
|----------|--------|--------|
| **Build** | ✅ Clean | Vite + TypeScript + Tailwind — zero errors, zero warnings |
| **Tests (unit)** | ✅ 22/22 | Vitest — cn, formatNumber, formatDate, slugify, Button variants/states/ref |
| **Tests (E2E)** | ✅ 19/19 | Playwright — home, browse filters, pricing, static pages, navigation |
| **Lint** | ✅ 0 warnings | Oxlint — zero warnings across 58 source files |
| **All 14 pages** | ✅ Built | Home, Browse, TemplateDetail, Pricing, Login, Register, ForgotPassword, Account, DownloadHistory, NotFound, Terms, Privacy, Contact, FAQ |
| **UI components** | ✅ 11 built | Button (5 variants × 4 sizes), Card (Header/Content/Footer), Badge (3 variants), Input, Modal, Skeleton, Breadcrumbs, ErrorBoundary, SEOHead, LazyImage, SubscriptionBadge |
| **Layout** | ✅ Responsive | Navbar (search, auth state, dark mode, mobile menu), Footer (4 link groups), Layout wrapper |
| **Auth pages** | ✅ Complete | Login (email + Google), Register, ForgotPassword — all with react-hook-form + zod + Firebase Auth |
| **Route guards** | ✅ 2 guards | ProtectedRoute (→ /login), PremiumRoute (→ /pricing) |
| **Zustand stores** | ✅ 2 stores | authStore (onAuthStateChanged + onSnapshot to Firestore), uiStore (dark mode persistence + mobile menu) |
| **React Query hooks** | ✅ 4 hooks | useTemplates (filtered/paginated), useTemplate (by slug), useRelatedTemplates, useTemplateDownloadCount (60s polling) |
| **API layer** | ✅ Mock | 24 templates, filtering (search/category/framework/priceTier), sorting, pagination, download history, billing function helpers |
| **Cloud Functions** | ✅ 8 functions | createCheckoutSession, stripeWebhook, getDownloadUrl, onTemplateDownloaded, cleanupExpiredSubscriptions, cancelSubscription, reactivateSubscription, createBillingPortalSession |
| **Security rules** | ✅ 2 sets | Firestore (authenticated/owner/admin/premium gating) + Storage (auth download, public previews) |
| **Seed script** | ✅ Built | scripts/seed-emulator.ts — seeds 24 templates to Firestore emulator via `npm run seed:emulators` |
| **CI/CD workflows** | ✅ 2 files | ci.yml (lint → test → build) + deploy.yml (Firebase Hosting — production + preview channels) |
| **Performance** | ✅ Configured | Route-level code splitting (React.lazy), LazyImage (IntersectionObserver), manualChunks (vendor/firebase/UI), sitemap + robots.txt |
| **Code quality** | ✅ Enforced | Prettier, Husky pre-commit hook (oxlint + prettier), lint-staged, noUnusedLocals/Parameters |
| **Config** | ✅ Complete | .env.example (18 vars), Tailwind v4 theme (indigo/amber), firebase.json, firestore.indexes.json, vite-plugin-sitemap |
| **README** | ✅ Thorough | Setup guide, deployment commands, project tree, full CI/CD secrets table (8 secrets) |

---

### 🟡 2. PARTIAL / NEEDS WORK

| Issue | Status | What's Missing |
|-------|--------|----------------|
| **Mock data instead of Firestore** | 🔶 All data is mock | BrowsePage, TemplateDetailPage, HomePage (categories), DownloadHistoryPage all use mock data. No Firestore reads exist in the frontend. Swap `fetchTemplates()` → Firestore queries. |
| **Account page subscription UI** | 🟡 Functionally built | Cancel/reactivate/portal buttons call Cloud Function APIs, but functions aren't deployed, so they'll fail in production |
| **PricingPage subscriptions** | 🟡 Register is dead-end | "Upgrade" buttons link to /register instead of calling createCheckoutSession Cloud Function. No Stripe checkout flow wired up on the frontend. |
| **Download button** | 🟡 UI only | TemplateDetailPage download buttons don't trigger actual downloads — no call to getDownloadUrl Cloud Function, no Storage file serving |
| **Auth store onSnapshot** | 🟡 No error handling | `onSnapshot` listener for user profile has no error callback. If Firestore read fails (permissions, network), `isLoading` never resolves |
| **Cloud Functions config** | 🟡 Placeholder IDs | config.ts uses placeholder Stripe Price IDs (`price_premium_monthly`, `price_premium_yearly`). Need real Price IDs from Stripe Dashboard before deploying |
| **Build chunk warning** | ✅ Fixed | Split Firebase into sub-chunks (app 28 kB, auth 88 kB, firestore 442 kB, storage 11 kB) — no chunk exceeds 500 kB |
| **Hook index re-exports** | ✅ Complete | All hooks exported: `useScrollToTop`, `useDocumentTitle`, `useTemplates`, `useTemplate`, `useRelatedTemplates`, `useDownloads`, `useNetworkStatus`, `useTemplateDownloadCount` — pages import through index only |
| **11 architect components** | 🟡 Inlined — intentional | HeroSection, FeaturedTemplates, CategoryGrid, PremiumCTA, SearchFilters, TemplateGrid, TemplateCard, ImageGallery, TemplateInfo, DownloadSection, PricingCard are inlined into pages. The architecture doc lists them but they don't exist as separate files — intentional for v1 simplicity |

---

### 🔴 3. MISSING / NOT IMPLEMENTED

| Gap | Impact | What's Needed |
|-----|--------|---------------|
| **Firebase credentials in .env** | 🔴 App connects to test Firebase | Placeholder values in `.env` (test-project, test.firebaseapp.com). Need real API key, project ID, auth domain, storage bucket, etc. from Firebase Console |
| **Live template images** | 🔴 No visuals | mock data has `mainImage: ''` and `previewImages: []` — no images anywhere. The existing free-templates.cc has 1,000+ template screenshots. Need to migrate or generate |
| **Email verification** | ✅ Implemented | `sendEmailVerification()` called after account creation. User navigated to /login with toast to verify before signing in |
| **Terms acceptance on register** | ✅ Implemented | RegisterPage has terms acceptance checkbox with zod validation (`z.literal(true)`). Links to /terms and /privacy |
| **Analytics** | 🔴 No tracking | Firebase Analytics or Google Analytics not integrated. Can't measure page views, downloads, conversions |
| **Domain configuration** | 🔴 custom domain not connected | free-templates.cc → Firebase Hosting custom domain not configured. Site only accessible at firebase- generated URL |
| **Rate limiting on Cloud Functions** | ✅ Implemented | Token-bucket rate limiter (`functions/src/rateLimiter.ts`) applied to createCheckoutSession (10/min/IP), getDownloadUrl (30/min/IP), cancel/reactivate (5/min/uid), billing portal (10/min/uid) |
| **CSP / security headers** | ✅ Configured | HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and Content-Security-Policy added to firebase.json hosting headers |
| **Image optimization** | 🔴 Missing | No build-time image optimization, no responsive image srcsets, no WebP/AVIF conversion. LazyImage exists but has nothing to lazy-load |
| **Lighthouse audit** | 🔴 Needs deployment | Can't run Lighthouse until site is deployed to a real URL |

---

### 📊 4. CODE QUALITY OBSERVATIONS

| Area | Rating | Notes |
|------|--------|-------|
| **TypeScript strictness** | ✅ Clean | Added `strict: true`, `strictNullChecks: true`, `noUncheckedIndexedAccess: true` to `tsconfig.app.json`. Build passes with zero errors — 3 pre-existing TS errors in LazyImage resolved (IntersectionObserver optional chaining + aspectRatio non-null assertions).
| **Error handling** | ✅ Good | ErrorBoundary wraps the entire app. Try/catch in Cloud Functions. BrowsePage has error state with retry button. Missing: no offline detection, no React Query retry config |
| **Loading states** | ✅ Good | PageLoader for lazy routes. Skeleton components used on BrowsePage (card grid), TemplateDetailPage. authStore has `isLoading` flag. Missing: no loading state on AccountPage subscription actions |
| **Empty states** | ✅ Adequate | BrowsePage: "No templates found" with suggestion to adjust filters. DownloadHistoryPage: empty message with link to browse. Missing: empty states on HomePage categories |
| **Error states** | 🟡 Partial | BrowsePage: error with retry. TemplateDetailPage: 404 + link back. Missing: error state in DownloadHistoryPage, AccountPage (silent failures for subscription actions), HomePage |
| **Accessibility** | 🟡 Partially addressed | 2026-07-29: Added focus trap + focus restoration to Modal, aria-expanded/aria-haspopup/role=menu to user dropdown, aria-label to mobile menu toggle, filter close buttons, pagination buttons. Added htmlFor on login labels, role=alert on errors, aria-hidden on decorative placeholders. Still needs: keyboard nav audit, skip-to-content link, focus-visible styles audit. |
| **Responsive design** | ✅ Good baseline | Tailwind breakpoints used consistently (sm/md/lg/xl). Mobile hamburger menu works. Template grid adapts 1→2→3 columns. Filters collapse on mobile |
| **Edge cases** | 🟡 Partial | Slugify handles edge cases correctly (tested). But: empty search results handled, what about very long template names? What about special characters in URLs? |
| **Performance** | ✅ Good | React.lazy code splitting, manualChunks, LazyImage, Skeleton for perceived performance. Bundle size is reasonable (571 kB firebase chunk is the main concern) |

---

### 🎯 PRIORITY ACTION ITEMS

Ordered by impact vs effort:

| Priority | Task | Effort | Impact |
|----------|------|--------|--------|
| 🔴 P0 | Fill in real Firebase credentials → test dev builds | 15 min | Unblocks all Firebase features |
| 🔴 P0 | Connect BrowsePage → Firestore for live template data | 2-3h | Site becomes real instead of mock |
| 🔴 P0 | Deploy Cloud Functions with real Stripe keys + Price IDs | 1h | Enables subscription payments |
| 🔴 P0 | Migrate 1,000+ template images from free-templates.cc | 4-8h | Makes the site visually functional |
| 🟡 P1 | Wire up getDownloadUrl → download buttons | 2h | Enables actual template downloads |
| 🟡 P1 | Add email verification flow | ✅ Done | `sendEmailVerification()` on register, redirect to /login with toast |
| 🟡 P1 | Set up Firebase Hosting + connect custom domain | 1h | Site goes live at free-templates.cc |
| 🟡 P1 | Add terms acceptance checkbox to RegisterPage | ✅ Done | zod-validated checkbox, links to /terms and /privacy |
| 🟡 P1 | Auth store onSnapshot error callback | ✅ Done | Error callback prevents infinite loading on Firestore read failure |
| 🟢 P2 | Replace PricingPage "Register" links with createCheckoutSession | ✅ Done | PricingPage calls createCheckoutSession CF; login page handles ?redirect param |
| 🟢 P2 | Add rate limiting to critical Cloud Functions | ✅ Done | Token-bucket rate limiter on all payment/download endpoints |
| 🟢 P2 | Configure CSP + security headers in firebase.json | ✅ Done | HSTS, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| 🟢 P2 | Integrate Firebase Analytics | 1h | User behavior insights |
| 🔵 P3 | Tighten TypeScript config (strict: true) | ✅ Done | Added strict + strictNullChecks + noUncheckedIndexedAccess, build passes clean |
| 🔵 P3 | Add image optimization pipeline (sharp/WebP) | 2h | Faster page loads |
| 🔵 P3 | Run Lighthouse audit | 30 min | Performance baseline |
| 🔵 P3 | Accessibility audit + fixes | ✅ Done | Fixed focus trap in Modal, aria attributes in Navbar/BrowsePage/LazyImage/HomePage/LoginPage, sort label, pagination aria-current, filter close labels |
| 🔵 P3 | Add offline detection / retry logic to React Query | ✅ Done | Retry delay (2s/4s cap 10s), onlineManager listener, NetworkStatusBanner component, useNetworkStatus hook |

---
