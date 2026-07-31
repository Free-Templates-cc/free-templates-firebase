/**
 * Error message helpers — normalize unknown error values into safe strings.
 * Firebase throws `FirebaseError` (an `Error` subclass), but callers should
 * not assume the caught value is an object (e.g. `throw 'string'`).
 */

/** Returns a readable message when `err` is an Error, otherwise the fallback. */
export function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback
}

/**
 * Returns a readable message for Firebase auth errors, stripping the
 * "Firebase: " prefix and the trailing "(auth/...)" code, otherwise the
 * fallback.
 */
export function getFirebaseAuthErrorMessage(err: unknown, fallback: string): string {
  if (!(err instanceof Error) || !err.message) return fallback
  return err.message.replace('Firebase: ', '').replace(/\(.*\)/, '')
}
