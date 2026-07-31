import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { BadgeVariant } from '../components/ui/Badge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function formatDate(date: Date | { seconds: number; nanoseconds: number }): string {
  const d = date instanceof Date ? date : new Date(date.seconds * 1000)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Generate a deterministic placeholder image URL for a given template slug.
 *
 * Uses picsum.photos with a seed so the same slug always gets the same image.
 * Swap these for real uploaded images when available.
 */
export function templateImageUrl(
  slug: string,
  variant = 'main',
  width = 640,
  height = 360,
): string {
  return `https://picsum.photos/seed/${slug}${variant === 'main' ? '' : `-${variant}`}/${width}/${height}`
}

/**
 * Generate an array of preview gallery URLs for a template.
 */
export function templateGalleryUrls(slug: string, count = 5): string[] {
  return Array.from({ length: count }, (_, i) => templateImageUrl(slug, `preview-${i + 1}`))
}

/**
 * Normalize a `?redirect=` style path so it can only ever be an internal,
 * same-origin path. External URLs (https://…), protocol-relative URLs
 * (//host), and backslash variants are rejected and fall back to `fallback`.
 */
export function sanitizeRedirectPath(path: string | null, fallback = '/'): string {
  if (path && path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/\\')) {
    return path
  }
  return fallback
}

/**
 * Map a template framework name (e.g. 'Next.js') to a Badge variant key.
 * Falls back to 'default' for unknown frameworks instead of returning an
 * undefined variant.
 */
export function frameworkBadgeVariant(framework: string): BadgeVariant {
  switch (framework.toLowerCase()) {
    case 'next.js':
      return 'nextjs'
    case 'gatsby.js':
      return 'gatsby'
    case 'nuxt.js':
      return 'nuxt'
    case 'vue.js':
      return 'vue'
    case 'react':
      return 'react'
    default:
      return 'default'
  }
}
