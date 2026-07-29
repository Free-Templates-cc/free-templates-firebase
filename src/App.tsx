import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import { queryClient } from './lib/queryClient'
import { Layout } from './components/layout/Layout'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { Skeleton } from './components/ui/Skeleton'

// Route-level code splitting
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })))
const BrowsePage = lazy(() => import('./pages/BrowsePage').then(m => ({ default: m.BrowsePage })))
const TemplateDetailPage = lazy(() => import('./pages/TemplateDetailPage').then(m => ({ default: m.TemplateDetailPage })))
const PricingPage = lazy(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })))
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })))
const AccountPage = lazy(() => import('./pages/AccountPage').then(m => ({ default: m.AccountPage })))
const TermsPage = lazy(() => import('./pages/static/TermsPage').then(m => ({ default: m.TermsPage })))
const PrivacyPage = lazy(() => import('./pages/static/PrivacyPage').then(m => ({ default: m.PrivacyPage })))
const ContactPage = lazy(() => import('./pages/static/ContactPage').then(m => ({ default: m.ContactPage })))
const FAQPage = lazy(() => import('./pages/static/FAQPage').then(m => ({ default: m.FAQPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })))

function PageLoader() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-8 w-48" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="templates" element={<BrowsePage />} />
                <Route path="templates/:slug" element={<TemplateDetailPage />} />
                <Route path="pricing" element={<PricingPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="account" element={<AccountPage />} />
                <Route path="account/downloads" element={<AccountPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
            },
          }}
        />
      </QueryClientProvider>
    </HelmetProvider>
    </ErrorBoundary>
  )
}
