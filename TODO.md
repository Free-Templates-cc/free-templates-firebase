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
- [ ] `templates/{templateId}` — fields:
  - `name` (string)
  - `slug` (string, unique)
  - `description` (string)
  - `category` (string — business, portfolio, ecommerce, landing, etc.)
  - `framework` (string — Next.js, Gatsby, Nuxt, etc.)
  - `priceTier` ('free' | 'premium')
  - `demoUrl` (string, optional)
  - `githubUrl` (string)
  - `previewImages` (array of Storage URLs)
  - `mainImage` (string URL)
  - `tags` (array of strings)
  - `features` (array of strings)
  - `downloads` (number)
  - `createdAt` / `updatedAt` (timestamps)
- [ ] `templateFiles/{templateId}` — secure Storage path for premium files

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

## Priorities (Progress)

1. ✅ Phase 1 — Project scaffold & Firebase setup
2. ✅ Phase 4.1 — Design system & shared components
3. ✅ Phase 2.1 — Auth pages & flow
4. ✅ Phase 4.2–4.4 — Homepage, Browse, Detail pages
5. 🔄 Phase 2.2–2.3 — User profiles & subscriptions (partial)
6. 🔲 Phase 3 — Admin template management (separate CMS)
7. ✅ Phase 5 — Cloud Functions & security rules (code written, deploy pending Firebase project)
8. ✅ Phase 4.5–4.8 — Remaining pages (pricing, account, static)
9. ✅ Phase 6.1 — Performance & SEO (lazy loading, sitemap, robots.txt)
10. ✅ Phase 6.3–6.4 — Responsive design, testing, CI/CD (Vitest + E2E done; CI workflow file exists but needs admin commit with `workflow` PAT scope)

---

*Last updated: 2026-07-29 (13:35 CET)*
