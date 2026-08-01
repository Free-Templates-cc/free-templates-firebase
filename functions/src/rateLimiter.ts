/**
 * Simple in-memory rate limiter for Cloud Functions.
 *
 * ⚠ In-memory only — suitable for moderate traffic on Cloud Run instances.
 *   For production at scale, replace with Firestore-based or Redis-based
 *   rate limiting.
 *
 * Usage:
 *   import { rateLimitByIp } from './rateLimiter'
 *   // inside onRequest handler:
 *   if (!rateLimitByIp(req.ip, 10, 60_000)) {
 *     res.status(429).json({ error: 'Too many requests. Please slow down.' })
 *     return
 *   }
 */

interface Bucket {
  tokens: number
  lastRefill: number
}

// Map of IP → { tokens, lastRefill }
const buckets = new Map<string, Bucket>()

/**
 * Map of uid → { tokens, lastRefill }.
 * Separate bucket pool from the IP limiter.
 */
const uidBuckets = new Map<string, Bucket>()

// Clean up stale entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000
const MAX_AGE_MS = 10 * 60 * 1000

let lastCleanup = Date.now()

/** Drop buckets that haven't been touched within `MAX_AGE_MS`. */
function purgeStale(entries: Map<string, Bucket>, now: number) {
  for (const [key, bucket] of entries) {
    if (now - bucket.lastRefill > MAX_AGE_MS) {
      entries.delete(key)
    }
  }
}

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now
  purgeStale(buckets, now)
  purgeStale(uidBuckets, now)
}

/**
 * Token-bucket rate limiter keyed by IP address.
 *
 * @param ip - The client IP address (e.g. `req.ip`).
 * @param maxRequests - Maximum requests allowed within the window.
 * @param windowMs - Time window in milliseconds.
 * @returns `true` if the request is within the limit, `false` if rate-limited.
 */
export function rateLimitByIp(
  ip: string | undefined,
  maxRequests: number,
  windowMs: number,
): boolean {
  if (!ip) return true // can't rate-limit without an IP

  cleanup()

  const now = Date.now()
  const key = ip
  let bucket = buckets.get(key)

  if (!bucket) {
    bucket = { tokens: maxRequests - 1, lastRefill: now }
    buckets.set(key, bucket)
    return true
  }

  // Refill tokens based on elapsed time
  const elapsed = now - bucket.lastRefill
  const refillRate = maxRequests / windowMs
  bucket.tokens = Math.min(maxRequests, bucket.tokens + elapsed * refillRate)
  bucket.lastRefill = now

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1
    return true
  }

  return false
}

/**
 * Simple in-memory rate limiter keyed by a custom identifier (e.g. uid).
 * Separate bucket pool from IP limiter.
 */
export function rateLimitByUid(
  uid: string | undefined,
  maxRequests: number,
  windowMs: number,
): boolean {
  if (!uid) return false // must have a uid

  cleanup()

  const now = Date.now()
  let bucket = uidBuckets.get(uid)

  if (!bucket) {
    bucket = { tokens: maxRequests - 1, lastRefill: now }
    uidBuckets.set(uid, bucket)
    return true
  }

  const elapsed = now - bucket.lastRefill
  const refillRate = maxRequests / windowMs
  bucket.tokens = Math.min(maxRequests, bucket.tokens + elapsed * refillRate)
  bucket.lastRefill = now

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1
    return true
  }

  return false
}
