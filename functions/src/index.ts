/**
 * Free-Templates.cc — Firebase Cloud Functions
 *
 * Payment flow:
 *   1. Client calls `createCheckoutSession` → Stripe Checkout URL
 *   2. User completes payment on Stripe
 *   3. Stripe sends `checkout.session.completed` webhook
 *   4. We create/update the Firestore subscription doc
 *   5. Client listens to `users/{uid}` via onSnapshot for subscription changes
 */

import * as logger from 'firebase-functions/logger'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { onSchedule } from 'firebase-functions/v2/scheduler'
import { onRequest } from 'firebase-functions/v2/https'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import Stripe from 'stripe'
import * as admin from 'firebase-admin'
import { PLANS, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, APP_CURRENCY } from './config'
import type { PlanKey } from './config'

// ---------------------------------------------------------------------------
// Initialize Firebase Admin
// ---------------------------------------------------------------------------
initializeApp()

const db = getFirestore()
const storage = getStorage()

// ---------------------------------------------------------------------------
// 1. createCheckoutSession
// ---------------------------------------------------------------------------
/**
 * Creates a Stripe Checkout Session for the given plan and returns the URL.
 *
 * Request body (JSON):
 *   { "plan": "premium_monthly" | "premium_yearly", "uid": "<firebase-uid>",
 *     "successUrl": "...", "cancelUrl": "..." }
 *
 * Response:
 *   { "url": "https://checkout.stripe.com/..." }
 */
export const createCheckoutSession = onRequest(
  { cors: true, secrets: [STRIPE_SECRET_KEY] },
  async (req, res) => {
    // Only allow POST
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    try {
      const { plan, uid, successUrl, cancelUrl } = req.body as {
        plan: PlanKey
        uid: string
        successUrl?: string
        cancelUrl?: string
      }

      // Validate plan
      const planConfig = PLANS[plan]
      if (!planConfig) {
        res.status(400).json({ error: `Invalid plan "${plan}".` })
        return
      }

      // Validate uid
      if (!uid || typeof uid !== 'string') {
        res.status(400).json({ error: 'Missing or invalid uid.' })
        return
      }

      // Look up existing customer or create a new one
      const stripe = new Stripe(STRIPE_SECRET_KEY.value(), {
        apiVersion: '2024-06-20',
      })

      let stripeCustomerId: string

      const userDoc = await db.collection('users').doc(uid).get()
      const userData = userDoc.data()

      if (userData?.subscription?.stripeCustomerId) {
        stripeCustomerId = userData.subscription.stripeCustomerId
      } else {
        // Create a new Stripe customer
        const customer = await stripe.customers.create({
          email: userData?.email,
          name: userData?.displayName,
          metadata: { firebaseUID: uid },
        })
        stripeCustomerId = customer.id

        // Persist customer ID immediately
        await db.collection('users').doc(uid).update({
          'subscription.stripeCustomerId': stripeCustomerId,
        })
      }

      // Create the checkout session
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: 'subscription',
        line_items: [
          {
            price: planConfig.priceId,
            quantity: 1,
          },
        ],
        subscription_data: {
          metadata: {
            firebaseUID: uid,
            tier: planConfig.tier,
            plan,
          },
        },
        success_url: successUrl ?? 'https://free-templates.cc/account?checkout=success',
        cancel_url: cancelUrl ?? 'https://free-templates.cc/pricing?checkout=canceled',
        currency: APP_CURRENCY,
        allow_promotion_codes: true,
      })

      res.json({ url: session.url })
    } catch (err) {
      logger.error('createCheckoutSession failed', err)
      res.status(500).json({ error: 'Failed to create checkout session.' })
    }
  },
)

// ---------------------------------------------------------------------------
// 2. stripeWebhook
// ---------------------------------------------------------------------------
/**
 * Stripe webhook endpoint.
 *
 * Handles:
 *   - checkout.session.completed   → activate subscription
 *   - invoice.paid                 → renew subscription period
 *   - invoice.payment_failed       → mark past_due
 *   - customer.subscription.updated → sync any status changes
 *   - customer.subscription.deleted → mark canceled
 */
export const stripeWebhook = onRequest(
  { cors: false, secrets: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET] },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY.value(), {
      apiVersion: '2024-06-20',
    })

    // Verify webhook signature
    const sig = req.headers['stripe-signature'] as string
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        STRIPE_WEBHOOK_SECRET.value(),
      )
    } catch (err) {
      logger.error('Webhook signature verification failed', err)
      res.status(400).json({ error: 'Invalid signature.' })
      return
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session
          await handleCheckoutCompleted(session, stripe)
          break
        }

        case 'invoice.paid': {
          const invoice = event.data.object as Stripe.Invoice
          await handleInvoicePaid(invoice, stripe)
          break
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice
          await handlePaymentFailed(invoice)
          break
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription
          await handleSubscriptionUpdated(subscription)
          break
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription
          await handleSubscriptionDeleted(subscription)
          break
        }

        default:
          logger.info(`Unhandled event type: ${event.type}`)
      }

      res.json({ received: true })
    } catch (err) {
      logger.error('Webhook handler failed', err)
      res.status(500).json({ error: 'Webhook handler failed.' })
    }
  },
)

// ---------------------------------------------------------------------------
// Webhook handlers
// ---------------------------------------------------------------------------

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  stripe: Stripe,
): Promise<void> {
  const firebaseUID = session.metadata?.firebaseUID
  if (!firebaseUID) {
    logger.warn('checkout.session.completed missing firebaseUID metadata')
    return
  }

  const subscriptionId = session.subscription as string
  if (!subscriptionId) return

  // Fetch full subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const tier = subscription.metadata?.tier ?? 'premium'
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000)

  await db.collection('users').doc(firebaseUID).update({
    'subscription.status': 'active',
    'subscription.tier': tier,
    'subscription.stripeSubscriptionId': subscriptionId,
    'subscription.currentPeriodEnd': currentPeriodEnd,
    'subscription.canceledAt': null,
    updatedAt: new Date(),
  })

  logger.info(`Subscription activated for ${firebaseUID} (${tier})`)
}

async function handleInvoicePaid(
  invoice: Stripe.Invoice,
  stripe: Stripe,
): Promise<void> {
  const subscriptionId = invoice.subscription as string
  if (!subscriptionId) return

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const firebaseUID = subscription.metadata?.firebaseUID
  if (!firebaseUID) {
    logger.warn('invoice.paid missing firebaseUID metadata on subscription')
    return
  }

  const currentPeriodEnd = new Date(subscription.current_period_end * 1000)

  await db.collection('users').doc(firebaseUID).update({
    'subscription.status': subscription.status === 'active' ? 'active' : 'past_due',
    'subscription.tier': subscription.metadata?.tier ?? 'premium',
    'subscription.currentPeriodEnd': currentPeriodEnd,
    updatedAt: new Date(),
  })

  logger.info(`Invoice paid — subscription renewed for ${firebaseUID}`)
}

async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const subscriptionId = invoice.subscription as string
  if (!subscriptionId) return

  // Find the user by subscription ID
  const snapshot = await db
    .collection('users')
    .where('subscription.stripeSubscriptionId', '==', subscriptionId)
    .limit(1)
    .get()

  if (snapshot.empty) {
    logger.warn('payment_failed: no user found for subscription', subscriptionId)
    return
  }

  const uid = snapshot.docs[0].id
  await db.collection('users').doc(uid).update({
    'subscription.status': 'past_due',
    updatedAt: new Date(),
  })

  logger.warn(`Payment failed for ${uid} — subscription marked past_due`)
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
): Promise<void> {
  const firebaseUID = subscription.metadata?.firebaseUID
  if (!firebaseUID) return

  const status =
    subscription.status === 'active'
      ? 'active'
      : subscription.status === 'past_due'
        ? 'past_due'
        : subscription.status === 'canceled'
          ? 'canceled'
          : 'incomplete'

  const currentPeriodEnd = new Date(subscription.current_period_end * 1000)

  await db.collection('users').doc(firebaseUID).update({
    'subscription.status': status,
    'subscription.tier': subscription.metadata?.tier ?? 'premium',
    'subscription.currentPeriodEnd': currentPeriodEnd,
    'subscription.canceledAt':
      status === 'canceled' ? new Date() : null,
    updatedAt: new Date(),
  })

  logger.info(`Subscription updated for ${firebaseUID} → ${status}`)
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
): Promise<void> {
  const firebaseUID = subscription.metadata?.firebaseUID
  if (!firebaseUID) return

  await db.collection('users').doc(firebaseUID).update({
    'subscription.status': 'canceled',
    'subscription.tier': 'free',
    'subscription.canceledAt': new Date(),
    updatedAt: new Date(),
  })

  logger.info(`Subscription deleted for ${firebaseUID} — reverted to free`)
}

// ---------------------------------------------------------------------------
// 3. getDownloadUrl
// ---------------------------------------------------------------------------
/**
 * Generates a signed download URL for a template file.
 *
 * Free templates: returns a public download URL directly.
 * Premium templates: checks if the user has an active subscription before
 * returning a signed URL.
 *
 * Request (POST):
 *   { "templateId": "abc123", "uid": "<firebase-uid>" }
 *
 * Response:
 *   { "url": "https://storage.googleapis.com/...", "downloads": 42 }
 */
export const getDownloadUrl = onRequest(
  { cors: true },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    try {
      const { templateId, uid } = req.body as {
        templateId: string
        uid?: string
      }

      if (!templateId) {
        res.status(400).json({ error: 'Missing templateId.' })
        return
      }

      // Fetch template
      const templateDoc = await db.collection('templates').doc(templateId).get()
      if (!templateDoc.exists) {
        res.status(404).json({ error: 'Template not found.' })
        return
      }

      const template = templateDoc.data()!
      const isPremium = template.priceTier === 'premium'

      // Premium check
      if (isPremium) {
        if (!uid) {
          res.status(401).json({ error: 'Authentication required for premium downloads.' })
          return
        }

        const userDoc = await db.collection('users').doc(uid).get()
        const user = userDoc.data()

        if (!user) {
          res.status(401).json({ error: 'User not found.' })
          return
        }

        const sub = user.subscription
        const hasActiveSubscription =
          sub?.tier === 'premium' &&
          (sub?.status === 'active' || sub?.status === 'past_due') &&
          sub?.currentPeriodEnd?.toDate() > new Date()

        if (!hasActiveSubscription) {
          res.status(403).json({ error: 'Active premium subscription required.' })
          return
        }
      }

      // Generate signed URL
      const filePath = template.downloadUrl
      if (!filePath) {
        res.status(500).json({ error: 'No file configured for this template.' })
        return
      }

      const bucket = storage.bucket()
      const file = bucket.file(filePath)

      // Free templates are publicly readable; premium ones get signed URLs
      let url: string
      if (isPremium) {
        const ONE_HOUR = 60 * 60 * 1000
        const [signedUrl] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + ONE_HOUR,
        })
        url = signedUrl
      } else {
        url = file.publicUrl()
      }

      res.json({ url, downloads: template.downloads ?? 0 })
    } catch (err) {
      logger.error('getDownloadUrl failed', err)
      res.status(500).json({ error: 'Failed to generate download URL.' })
    }
  },
)

// ---------------------------------------------------------------------------
// 4. cancelSubscription
// ---------------------------------------------------------------------------
/**
 * Cancels an active subscription at period end.
 *
 * Request body (JSON):
 *   { "uid": "<firebase-uid>" }
 *
 * Response:
 *   { "canceledAt": "ISO-date", "currentPeriodEnd": "ISO-date" }
 */
export const cancelSubscription = onRequest(
  { cors: true, secrets: [STRIPE_SECRET_KEY] },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    try {
      const { uid } = req.body as { uid: string }

      if (!uid || typeof uid !== 'string') {
        res.status(400).json({ error: 'Missing or invalid uid.' })
        return
      }

      // Fetch user
      const userDoc = await db.collection('users').doc(uid).get()
      if (!userDoc.exists) {
        res.status(404).json({ error: 'User not found.' })
        return
      }

      const userData = userDoc.data()!
      const subscriptionId = userData.subscription?.stripeSubscriptionId

      if (!subscriptionId) {
        res.status(400).json({ error: 'No active subscription found.' })
        return
      }

      const stripe = new Stripe(STRIPE_SECRET_KEY.value(), {
        apiVersion: '2024-06-20',
      })

      // Cancel at period end
      const canceled = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      })

      const currentPeriodEnd = new Date(canceled.current_period_end * 1000)
      const canceledAt = new Date()

      // Update Firestore
      await db.collection('users').doc(uid).update({
        'subscription.canceledAt': canceledAt,
        'subscription.currentPeriodEnd': currentPeriodEnd,
        'subscription.cancel_at_period_end': true,
        updatedAt: canceledAt,
      })

      logger.info(`Subscription canceled for ${uid} — ends ${currentPeriodEnd.toISOString()}`)

      res.json({
        canceledAt: canceledAt.toISOString(),
        currentPeriodEnd: currentPeriodEnd.toISOString(),
        status: 'canceled',
      })
    } catch (err) {
      logger.error('cancelSubscription failed', err)
      res.status(500).json({ error: 'Failed to cancel subscription.' })
    }
  },
)

// ---------------------------------------------------------------------------
// 5. reactivateSubscription
// ---------------------------------------------------------------------------
/**
 * Reactivates a subscription that was set to cancel at period end.
 * Only works if the subscription hasn't expired yet.
 *
 * Request body (JSON):
 *   { "uid": "<firebase-uid>" }
 *
 * Response:
 *   { "status": "active", "currentPeriodEnd": "ISO-date" }
 */
export const reactivateSubscription = onRequest(
  { cors: true, secrets: [STRIPE_SECRET_KEY] },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    try {
      const { uid } = req.body as { uid: string }

      if (!uid || typeof uid !== 'string') {
        res.status(400).json({ error: 'Missing or invalid uid.' })
        return
      }

      // Fetch user
      const userDoc = await db.collection('users').doc(uid).get()
      if (!userDoc.exists) {
        res.status(404).json({ error: 'User not found.' })
        return
      }

      const userData = userDoc.data()!
      const subscriptionId = userData.subscription?.stripeSubscriptionId

      if (!subscriptionId) {
        res.status(400).json({ error: 'No subscription found to reactivate.' })
        return
      }

      const stripe = new Stripe(STRIPE_SECRET_KEY.value(), {
        apiVersion: '2024-06-20',
      })

      // Remove cancel_at_period_end
      const reactivated = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      })

      const currentPeriodEnd = new Date(reactivated.current_period_end * 1000)

      // Update Firestore
      await db.collection('users').doc(uid).update({
        'subscription.canceledAt': null,
        'subscription.currentPeriodEnd': currentPeriodEnd,
        'subscription.cancel_at_period_end': false,
        updatedAt: new Date(),
      })

      logger.info(`Subscription reactivated for ${uid}`)

      res.json({
        status: 'active',
        currentPeriodEnd: currentPeriodEnd.toISOString(),
      })
    } catch (err) {
      logger.error('reactivateSubscription failed', err)
      res.status(500).json({ error: 'Failed to reactivate subscription.' })
    }
  },
)

// ---------------------------------------------------------------------------
// 6. createBillingPortalSession
// ---------------------------------------------------------------------------
/**
 * Creates a Stripe Customer Portal session for self-service billing management.
 *
 * Request body (JSON):
 *   { "uid": "<firebase-uid>" }
 *
 * Response:
 *   { "url": "https://billing.stripe.com/..." }
 */
export const createBillingPortalSession = onRequest(
  { cors: true, secrets: [STRIPE_SECRET_KEY] },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    try {
      const { uid } = req.body as { uid: string }

      if (!uid || typeof uid !== 'string') {
        res.status(400).json({ error: 'Missing or invalid uid.' })
        return
      }

      // Fetch user to get Stripe customer ID
      const userDoc = await db.collection('users').doc(uid).get()
      if (!userDoc.exists) {
        res.status(404).json({ error: 'User not found.' })
        return
      }

      const userData = userDoc.data()!
      const stripeCustomerId = userData.subscription?.stripeCustomerId

      if (!stripeCustomerId) {
        res.status(400).json({ error: 'No Stripe customer found.' })
        return
      }

      const stripe = new Stripe(STRIPE_SECRET_KEY.value(), {
        apiVersion: '2024-06-20',
      })

      const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: 'https://free-templates.cc/account',
      })

      res.json({ url: session.url })
    } catch (err) {
      logger.error('createBillingPortalSession failed', err)
      res.status(500).json({ error: 'Failed to create billing portal session.' })
    }
  },
)

// ---------------------------------------------------------------------------
// 7. incrementDownloadCount
// ---------------------------------------------------------------------------
/**
 * Triggered when a user downloads a template.
 * Writes a download record and increments the download counters.
 */
export const onTemplateDownloaded = onDocumentCreated(
  'downloads/{downloadId}',
  async (event) => {
    const download = event.data?.data()
    if (!download) return

    const { templateId, userId } = download

    try {
      // Increment template download count (Firestore atomic increment)
      await db
        .collection('templates')
        .doc(templateId)
        .update({
          downloads: admin.firestore.FieldValue.increment(1),
        })

      // Increment user download count
      if (userId) {
        await db.collection('users').doc(userId).update({
          downloadCount: admin.firestore.FieldValue.increment(1),
        })
      }

      logger.info(`Download recorded: template=${templateId}, user=${userId || 'anonymous'}`)
    } catch (err) {
      logger.error('Failed to increment download count', err)
    }
  },
)

// Need admin import for FieldValue — re-import at top is cleaner,
// but we use the initialized app's Firestore instance.

// ---------------------------------------------------------------------------
// 8. Scheduled — Cleanup expired subscriptions
// ---------------------------------------------------------------------------
/**
 * Runs daily at 03:00 to clean up expired subscriptions.
 * Marks any subscription whose `currentPeriodEnd` has passed as canceled
 * and reverts the tier to free.
 */
export const cleanupExpiredSubscriptions = onSchedule(
  {
    schedule: '0 3 * * *',
    timeZone: 'Europe/Berlin',
    retryCount: 2,
    maxBackoffSeconds: 60,
  },
  async () => {
    const now = new Date()

    try {
      const expired = await db
        .collection('users')
        .where('subscription.status', '==', 'active')
        .where('subscription.currentPeriodEnd', '<', now)
        .get()

      let count = 0
      const batch = db.batch()

      expired.forEach((doc) => {
        batch.update(doc.ref, {
          'subscription.status': 'canceled',
          'subscription.tier': 'free',
          'subscription.canceledAt': now,
          updatedAt: now,
        })
        count++
      })

      if (count > 0) {
        await batch.commit()
        logger.info(`Cleaned up ${count} expired subscription(s)`)
      } else {
        logger.info('No expired subscriptions to clean up')
      }
    } catch (err) {
      logger.error('cleanupExpiredSubscriptions failed', err)
    }
  },
)
