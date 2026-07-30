# Backend (Cloud Functions) Specification

## Purpose

Firebase Cloud Functions implement server-side logic for subscription management (Stripe Checkout, billing portal, cancellation), file delivery (signed download URLs), download tracking, and automated subscription cleanup. They are located in `functions/src/` and deployed via Firebase CLI.

## Requirements

### Requirement: createCheckoutSession
The system SHALL provide a callable HTTPS function that creates a Stripe Checkout Session for premium subscriptions.

#### Scenario: Successful checkout creation
- **GIVEN** a valid request with `{ plan, uid, successUrl, cancelUrl }`
- **WHEN** `createCheckoutSession` is called via POST
- **THEN** it SHALL create a Stripe Checkout Session with the matching price ID from `PLANS`
- **AND** return `{ url: "https://checkout.stripe.com/..." }`
- **AND** it SHALL set `client_reference_id` to the Firebase UID
- **AND** it SHALL set `metadata.uid` for webhook identification
- **AND** it SHALL rate-limit at 10 requests per minute per IP

#### Scenario: Invalid plan
- **GIVEN** a request with an unknown plan key
- **WHEN** the function executes
- **THEN** it SHALL return 400 with `{ error: "Invalid plan ..." }`

#### Scenario: Missing uid
- **GIVEN** a request without a valid uid
- **WHEN** the function executes
- **THEN** it SHALL return 400 with `{ error: "Missing or invalid uid." }`

#### Scenario: Rate limited
- **GIVEN** an IP exceeds 10 requests per minute
- **WHEN** a new request arrives
- **THEN** it SHALL return 429 with `{ error: "Too many requests. Please slow down." }`

#### Scenario: Method not allowed
- **GIVEN** a non-POST request
- **WHEN** the function receives it
- **THEN** it SHALL return 405 with `{ error: "Method not allowed" }`

### Requirement: stripeWebhook
The system SHALL provide an HTTPS function that receives Stripe webhook events for subscription lifecycle management.

#### Scenario: Checkout completed
- **GIVEN** a `checkout.session.completed` event with mode "subscription"
- **WHEN** the webhook processes it
- **THEN** it SHALL create/update the Firestore user doc at `users/{uid}`
- **AND** set `subscription.status` to "active"
- **AND** set `subscription.tier` to "premium"
- **AND** set `subscription.stripeCustomerId` and `stripeSubscriptionId`
- **AND** set `subscription.currentPeriodEnd` from the Stripe subscription

#### Scenario: Invoice paid
- **GIVEN** an `invoice.paid` event
- **WHEN** the webhook processes it
- **THEN** it SHALL update `subscription.currentPeriodEnd`
- **AND** ensure `subscription.status` is "active"

#### Scenario: Payment failed
- **GIVEN** an `invoice.payment_failed` event
- **WHEN** the webhook processes it
- **THEN** it SHALL set `subscription.status` to "past_due"

#### Scenario: Subscription updated
- **GIVEN** a `customer.subscription.updated` event
- **WHEN** the webhook processes it
- **THEN** it SHALL sync the subscription status and period end to Firestore

#### Scenario: Subscription deleted
- **GIVEN** a `customer.subscription.deleted` event
- **WHEN** the webhook processes it
- **THEN** it SHALL set `subscription.status` to "canceled"
- **AND** set `subscription.tier` to "free"

#### Scenario: Signature verification
- **GIVEN** any webhook event
- **WHEN** the function receives it
- **THEN** it SHALL verify the Stripe signature using `STRIPE_WEBHOOK_SECRET`
- **AND** return 401 on invalid signature

### Requirement: getDownloadUrl
The system SHALL provide an HTTPS function that generates signed download URLs for template files, checking subscription for premium templates.

#### Scenario: Free template download
- **GIVEN** a free template with `priceTier: "free"`
- **WHEN** `getDownloadUrl` is called
- **THEN** it SHALL generate a signed URL for the free template file
- **AND** return `{ url: "..." }`
- **AND** rate-limit at 30 requests per minute per IP

#### Scenario: Premium template + active subscriber
- **GIVEN** a premium template and the user has an active premium subscription
- **WHEN** `getDownloadUrl` is called
- **THEN** it SHALL generate a signed URL for the premium template file
- **AND** return `{ url: "..." }`

#### Scenario: Premium template + not subscriber
- **GIVEN** a premium template and the user does NOT have an active subscription
- **WHEN** `getDownloadUrl` is called
- **THEN** it SHALL return 403 with `{ error: "Active premium subscription required." }`

#### Scenario: Template not found
- **GIVEN** a non-existent template ID
- **WHEN** `getDownloadUrl` is called
- **THEN** it SHALL return 404 with `{ error: "Template not found." }`

### Requirement: onTemplateDownloaded
The system SHALL provide a Firestore-triggered function that increments the download counter on a template when a download document is created.

#### Scenario: Increment counter
- **GIVEN** a new document is created in the `downloads` collection
- **WHEN** `onTemplateDownloaded` triggers
- **THEN** it SHALL increment `templates/{templateId}.downloads` by 1

### Requirement: cancelSubscription
The system SHALL provide a callable function that cancels a premium subscription at period end.

#### Scenario: Cancel active subscription
- **GIVEN** a user with an active premium subscription
- **WHEN** `cancelSubscription` is called
- **THEN** it SHALL cancel the Stripe subscription at period end
- **AND** update Firestore `subscription.status` to "canceled"
- **AND** set `subscription.canceledAt`
- **AND** rate-limit at 5 requests per minute per UID

#### Scenario: No subscription
- **GIVEN** a user with no active subscription
- **WHEN** `cancelSubscription` is called
- **THEN** it SHALL return an error

### Requirement: reactivateSubscription
The system SHALL provide a callable function that reactivates a canceled subscription.

#### Scenario: Reactivate
- **GIVEN** a user with a canceled subscription
- **WHEN** `reactivateSubscription` is called
- **THEN** it SHALL set `cancel_at_period_end` to false on the Stripe subscription
- **AND** update Firestore `subscription.status` to "active"
- **AND** clear `subscription.canceledAt`
- **AND** rate-limit at 5 requests per minute per UID

### Requirement: createBillingPortalSession
The system SHALL provide a callable function that creates a Stripe Customer Portal session.

#### Scenario: Portal session
- **GIVEN** a user with a Stripe customer ID
- **WHEN** `createBillingPortalSession` is called
- **THEN** it SHALL create a Stripe Billing Portal session
- **AND** return `{ url: "https://billing.stripe.com/..." }`
- **AND** rate-limit at 10 requests per minute per UID

### Requirement: cleanupExpiredSubscriptions
The system SHALL provide a scheduled function that runs daily at 03:00 CET to clean up expired subscriptions.

#### Scenario: Cleanup
- **GIVEN** the scheduled trigger fires
- **WHEN** the function runs
- **THEN** it SHALL query Firestore for users where `subscription.currentPeriodEnd < now`
- **AND** `subscription.status` is "active" or "past_due"
- **AND** it SHALL set `subscription.status` to "expired" and `subscription.tier` to "free"

### Requirement: Rate Limiter
The system SHALL provide a token-bucket rate limiter utility for Cloud Functions.

#### Scenario: Rate limit by IP
- **GIVEN** `rateLimitByIp(ip, maxRequests, windowMs)` is called
- **WHEN** the IP has exceeded the limit
- **THEN** it SHALL return `false`
- **WHEN** the IP is within the limit
- **THEN** it SHALL return `true`

#### Scenario: Rate limit by UID
- **GIVEN** `rateLimitByUid(uid, maxRequests, windowMs)` is called
- **WHEN** the UID has exceeded the limit
- **THEN** it SHALL return `false`

### Requirement: Config
The system SHALL provide a configuration module with Stripe keys, price IDs, and plan definitions.

#### Scenario: Plan configuration
- **GIVEN** the `PLANS` object
- **WHEN** accessed
- **THEN** it SHALL define `premium_monthly` and `premium_yearly` with price IDs, name, and description
- **AND** use Stripe Price IDs that are replaceable for production
