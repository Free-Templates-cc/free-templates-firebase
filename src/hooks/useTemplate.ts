import { useQuery } from '@tanstack/react-query'
import { fetchTemplateBySlug, fetchRelatedTemplates } from '../lib/api'
import type { Template } from '../types'

/**
 * Fetch a single template by its slug.
 */
export function useTemplate(slug: string) {
  return useQuery<Template | null>({
    queryKey: ['template', slug],
    queryFn: () => fetchTemplateBySlug(slug),
    enabled: !!slug,
  })
}

/**
 * Fetch related templates (same category, excluding the current one).
 */
export function useRelatedTemplates(currentSlug: string, category: string) {
  return useQuery<Template[]>({
    queryKey: ['relatedTemplates', currentSlug, category],
    queryFn: () => fetchRelatedTemplates(currentSlug, category),
    enabled: !!currentSlug && !!category,
  })
}
