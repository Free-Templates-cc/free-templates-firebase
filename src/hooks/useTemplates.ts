import { useQuery } from '@tanstack/react-query'
import { fetchTemplates, type PageData } from '../lib/api'
import type { Template, TemplateFilters } from '../types'

export interface UseTemplatesOptions {
  filters: TemplateFilters
  page?: number
  pageSize?: number
}

/**
 * React Query hook that fetches templates based on URL-derived filters.
 *
 * The query key encodes the filters so that changing any filter or page
 * automatically triggers a refetch — this is the URL-to-query sync.
 */
export function useTemplates({ filters, page = 1, pageSize = 9 }: UseTemplatesOptions) {
  return useQuery<PageData<Template>>({
    queryKey: ['templates', filters, page, pageSize],
    queryFn: () => fetchTemplates(filters, page, pageSize),
    placeholderData: (prev) => prev, // keep previous data while fetching next page
  })
}

/**
 * Convenience: extract the default filters object from URLSearchParams.
 */
export function filtersFromParams(params: URLSearchParams): TemplateFilters {
  return {
    search: params.get('search') || '',
    category: params.get('category') || '',
    framework: params.get('framework') || '',
    priceTier: (params.get('priceTier') as TemplateFilters['priceTier']) || 'all',
    sort: (params.get('sort') as TemplateFilters['sort']) || 'newest',
  }
}
