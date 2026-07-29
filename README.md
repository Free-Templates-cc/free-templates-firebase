# Free-Templates.cc

A modern template marketplace for developers — browse, search, and download free & premium website templates. Built with **React + TypeScript** on the frontend and **Firebase** on the backend.

## Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| **Frontend**   | React 19, TypeScript, Vite 8        |
| **Styling**    | Tailwind CSS 4, clsx, tailwind-merge |
| **Routing**    | React Router v6                     |
| **Data**       | TanStack React Query v5             |
| **State**      | Zustand v5                          |
| **Forms**      | react-hook-form + zod               |
| **Auth**       | Firebase Auth (email/password, Google OAuth) |
| **Backend**    | Firebase Cloud Functions (Node 20)  |
| **Database**   | Firestore (NoSQL)                   |
| **Storage**    | Firebase Storage                    |
| **Payments**   | Stripe (via Cloud Functions)        |
| **Hosting**    | Firebase Hosting                    |
| **SEO**        | react-helmet-async                  |
| **Linting**    | Oxlint                              |

## Features

### Public Site
- **Browse & Search** — filter templates by category, framework, price tier; sort by newest, popular, or name
- **Template Detail** — preview images, features, tags, demo & GitHub links, download with conditional auth/premium gating
- **Pricing Page** — free vs premium comparison with monthly/yearly toggle
- **Dark Mode** — persistent dark/light theme toggle
- **Responsive** — mobile-first layout (Navbar collapses, filters become drawers)

### Auth & Accounts
- **Sign In / Sign Up** — email/password or Google OAuth via Firebase Auth
- **Forgot Password** — Firebase password reset flow
- **Persistent Auth** — Firebase `onAuthStateChanged` synced to Zustand store
- **Account Page** — profile details, subscription status, change password
- **Protected Routes** — route guards for auth-only and premium-only pages

### Subscriptions (Stripe)
- **Free Tier** — browse all, download free templates
- **Premium Tier** — unlimited downloads of premium templates
- **Checkout** — Stripe Checkout session via Cloud Function
- **Webhook** — handles subscription lifecycle (create, renew, cancel, expire)
- **Grace Period** — expired subscriptions handled with `currentPeriodEnd` checks

### Admin (External CMS)
Template management (CRUD, uploads) is handled by a separate admin dashboard — this project is the public-facing site only.

## Getting Started

### Prerequisites

- **Node.js** 20+
- **npm** 10+
- A **Firebase** project with the following services enabled:
  - Authentication (Email/Password + Google provider)
  - Firestore Database
  - Storage
  - Functions (pay-as-you-go/Blaze plan for Stripe integration)
  - Hosting
- A **Stripe** account (test mode for development)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_ORG/free-templates-firebase.git
cd free-templates-firebase

# 2. Install frontend dependencies
npm install

# 3. Install Cloud Functions dependencies
cd functions
npm install
cd ..

# 4. Copy environment variables and fill them in
cp .env.example .env
```

### Environment Variables

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Use Firebase Emulators (true/false)
VITE_USE_FIREBASE_EMULATORS=false
```

Copy these values from your Firebase project → Project Settings → General → Your apps → Web app.

### Firebase Emulators (Local Development)

To run the full stack locally:

```bash
# Start emulators
npm run emulators

# In another terminal, start the Vite dev server
npm run dev
```

The app will automatically connect to emulators when `VITE_USE_FIREBASE_EMULATORS=true`.

### Stripe Setup for Cloud Functions

Set the following environment variables for your Cloud Functions:

```bash
firebase functions:config:set stripe.secret_key="sk_test_..."
firebase functions:config:set stripe.webhook_secret="whsec_..."
firebase functions:config:set app.url="http://localhost:5173"
```

## Available Scripts

### Frontend (root)

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start Vite dev server (HMR)             |
| `npm run build`     | Type-check + build for production       |
| `npm run preview`   | Preview production build locally        |
| `npm run lint`      | Run Oxlint on all source files          |

### Cloud Functions (functions/)

| Script                        | Description                      |
| ----------------------------- | -------------------------------- |
| `npm run build`               | Compile TypeScript to JS         |
| `npm run serve`               | Build + emulate functions locally |
| `npm run deploy`              | Deploy functions to Firebase     |
| `npm run shell`               | Interactive functions shell      |

## Project Structure

```
free-templates-firebase/
├── functions/                  # Cloud Functions (Node 20)
│   ├── src/
│   │   ├── config.ts           # Stripe / app config
│   │   └── index.ts            # Function handlers
│   ├── package.json
│   └── tsconfig.json
├── public/                     # Static assets (robots.txt, favicon)
├── src/
│   ├── components/
│   │   ├── auth/               # ProtectedRoute, PremiumRoute
│   │   ├── layout/             # Layout, Navbar, Footer
│   │   ├── seo/                # SEOHead (react-helmet-async)
│   │   └── ui/                 # Button, Card, Badge, Input, Modal, Skeleton, ErrorBoundary, Breadcrumbs
│   ├── hooks/                  # Custom hooks (useTemplates, useTemplate, useScrollToTop, useDocumentTitle)
│   ├── lib/                    # SDK init, utils, API layer, query client
│   ├── pages/
│   │   ├── auth/               # LoginPage, RegisterPage, ForgotPasswordPage
│   │   ├── static/             # TermsPage, PrivacyPage, ContactPage, FAQPage
│   │   ├── AccountPage.tsx
│   │   ├── BrowsePage.tsx
│   │   ├── HomePage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── PricingPage.tsx
│   │   └── TemplateDetailPage.tsx
│   ├── stores/                 # Zustand (authStore, uiStore)
│   ├── types/                  # TypeScript type definitions
│   ├── App.tsx                 # Root component with routes
│   ├── index.css               # Tailwind imports
│   └── main.tsx                # Entry point
├── .env.example                # Environment variable template
├── .gitignore
├── .oxlintrc.json
├── firebase.json               # Firebase hosting / functions config
├── firestore.indexes.json      # Firestore composite indexes
├── firestore.rules             # Firestore security rules
├── storage.rules               # Storage security rules
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── vite.config.ts
```

## Deployment

Deploy everything to Firebase:

```bash
# Build the frontend
npm run build

# Deploy hosting + functions + Firestore rules + Storage rules
firebase deploy

# Or deploy individual services
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only storage
```

### Setting Up the Custom Domain

1. Go to Firebase Console → Hosting → Add custom domain
2. Follow the DNS verification steps
3. Firebase will provision an SSL certificate automatically

## Phase 6 TODOs (upcoming)

- [ ] Lazy loading for images and components
- [ ] Sitemap generation
- [ ] Lighthouse audit (target 90+)
- [ ] Unit tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Analytics (Firebase Analytics)
- [ ] Cross-browser testing

## License

See the [LICENSE](./LICENSE) file for details (TBD).
