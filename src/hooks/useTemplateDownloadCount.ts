import { useQuery } from '@tanstack/react-query'
import { fetchTemplates } from '../lib/api'
import type { Template, TemplateFilters } from '../types'

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
      const filters: TemplateFilters = {
        search: '',
        category: '',
        framework: '',
        priceTier: 'all',
        sort: 'popular',
      }
      const templates = await fetchTemplates(filters, 1, 100)
      const template = templates.items.find((t: Template) => t.slug === slug)
      if (!template) throw new Error('Template not found')
      // Simulate a live-ish count by toggling a small random delta
      return template.downloads + Math.floor(Math.random() * 3) - 1
    },
    refetchInterval: 60_000, // refresh every 60s to simulate "live"
    staleTime: 30_000,
  })
}
