import { describe, it, expect, vi, beforeEach } from 'vitest'

type FakeUser = { getIdToken: () => Promise<string> } | null

// The Cloud Function helpers authenticate via a Firebase ID token in the
// `Authorization` header (the server verifies it and never trusts a uid from
// the request body). These tests pin down that header behavior for both the
// signed-in and signed-out paths.
const mocks = vi.hoisted(() => {
  const state: { currentUser: FakeUser } = {
    currentUser: { getIdToken: async (): Promise<string> => 'test-id-token' },
  }
  return state
})

vi.mock('../firebase', () => ({
  db: {},
  auth: {
    get currentUser() {
      return mocks.currentUser
    },
  },
}))

import { createCheckoutSession } from '../api'

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

describe('api — Cloud Function Authorization header', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ url: 'https://checkout.stripe.com/test' }),
    })
  })

  it('attaches a Bearer token when a user is signed in', async () => {
    mocks.currentUser = { getIdToken: async (): Promise<string> => 'test-id-token' }

    await createCheckoutSession('uid123', 'monthly')

    const [, options] = mockFetch.mock.calls[0]!
    const headers = (options as { headers: Record<string, string> }).headers
    expect(headers.Authorization).toBe('Bearer test-id-token')
  })

  it('omits the Authorization header when signed out', async () => {
    mocks.currentUser = null

    await createCheckoutSession('uid123', 'monthly')

    const [, options] = mockFetch.mock.calls[0]!
    const headers = (options as { headers: Record<string, string> }).headers
    expect(headers.Authorization).toBeUndefined()
  })
})
