import { useQuery } from '@tanstack/react-query'
import { fetchDownloads } from '../lib/api'
import type { Download } from '../types'

/**
 * Fetch the download history for a given user.
 *
 * Currently returns mock data; swap the implementation to a Firestore
 * query when the Firebase project is connected.
 */
export function useDownloads(userId: string | undefined) {
  return useQuery<Download[]>({
    queryKey: ['downloads', userId],
    queryFn: () => fetchDownloads(userId!),
    enabled: !!userId,
  })
}
