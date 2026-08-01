import { useQuery } from '@tanstack/react-query'
import { fetchTemplateBySlug } from '../lib/api'

/**
 * Mock hook for live download counter — fetches a single template
 * and returns its current download count.
 *
 * Replace with a Firestore real-time listener when Firebase is connected.
 */
export function useTemplateDownloadCount(slug: string) {
  return useQuery({
    queryKey: ['template', slug, 'download-count'],
    queryFn: async (): Promise<number> => {
      const template = await fetchTemplateBySlug(slug)
      if (!template) throw new Error('Template not found')
      // Simulate a live-ish count by toggling a small random delta
      return template.downloads + Math.floor(Math.random() * 3) - 1
    },
    refetchInterval: 60_000, // refresh every 60s to simulate "live"
    staleTime: 30_000,
  })
}
