/**
 * Shared configuration for Firebase Cloud Functions.
 *
 * All secrets (Stripe API key, etc.) are loaded via Firebase Config
 * (firebase functions:config:set) — never hardcode them.
 */

import { defineString } from 'firebase-functions/params'

// ---------------------------------------------------------------------------
// Stripe
// ---------------------------------------------------------------------------
export const STRIPE_SECRET_KEY = defineString('stripe.secret_key')
export const STRIPE_WEBHOOK_SECRET = defineString('stripe.webhook_secret')

// ---------------------------------------------------------------------------
// Subscription plans (prices in cents / EUR)
// ---------------------------------------------------------------------------
export const PLANS = {
  premium_monthly: {
    priceId: 'price_premium_monthly',      // ⚠ Replace with actual Stripe Price ID
    amount: 1200,                           // €12.00 / month
    currency: 'eur',
    interval: 'month' as const,
    tier: 'premium' as const,
  },
  premium_yearly: {
    priceId: 'price_premium_yearly',       // ⚠ Replace with actual Stripe Price ID
    amount: 9600,                           // €96.00 / year (€8/mo)
    currency: 'eur',
    interval: 'year' as const,
    tier: 'premium' as const,
  },
} as const

export type PlanKey = keyof typeof PLANS

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export const APP_CURRENCY = 'eur'
export const TRIAL_PERIOD_DAYS = 0           // no trial period
