import { describe, it, expect } from 'vitest'
import {
  cn,
  formatNumber,
  formatDate,
  slugify,
  templateImageUrl,
  templateGalleryUrls,
} from '../utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('handles conditional classes', () => {
    const showHidden = false
    expect(cn('base', showHidden && 'hidden', 'visible')).toBe('base visible')
  })

  it('resolves tailwind conflicts (last wins)', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6')
  })

  it('accepts array inputs', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c')
  })

  it('ignores falsy values', () => {
    expect(cn('a', null, undefined, false, '', 'b')).toBe('a b')
  })
})

describe('formatNumber', () => {
  it('formats numbers below 1000', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(42)).toBe('42')
    expect(formatNumber(999)).toBe('999')
  })

  it('formats thousands', () => {
    expect(formatNumber(1000)).toBe('1.0K')
    expect(formatNumber(1500)).toBe('1.5K')
    expect(formatNumber(999999)).toBe('1000.0K')
  })

  it('formats millions', () => {
    expect(formatNumber(1_000_000)).toBe('1.0M')
    expect(formatNumber(2_500_000)).toBe('2.5M')
  })
})

describe('formatDate', () => {
  it('formats a Date object', () => {
    const date = new Date(2024, 0, 15) // Jan 15, 2024
    expect(formatDate(date)).toBe('January 15, 2024')
  })

  it('formats a Firestore Timestamp-like object', () => {
    const timestamp = { seconds: 1_704_800_000, nanoseconds: 0 }
    const result = formatDate(timestamp)
    expect(result).toMatch(/\w+ \d+, \d{4}/)
  })
})

describe('slugify', () => {
  it('converts text to lowercase slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('removes special characters', () => {
    expect(slugify('Hello! World?')).toBe('hello-world')
  })

  it('collapses multiple hyphens', () => {
    expect(slugify('Hello---World')).toBe('hello-world')
  })

  it('trims whitespace', () => {
    expect(slugify('  hello world  ')).toBe('hello-world')
  })

  it('handles single words', () => {
    expect(slugify('Hello')).toBe('hello')
  })
})

describe('templateImageUrl', () => {
  it('generates a main image URL for a slug', () => {
    const url = templateImageUrl('portfolio-pro')
    expect(url).toBe('https://picsum.photos/seed/portfolio-pro/640/360')
  })

  it('includes variant in seed when not main', () => {
    const url = templateImageUrl('portfolio-pro', 'preview-1')
    expect(url).toBe('https://picsum.photos/seed/portfolio-pro-preview-1/640/360')
  })

  it('respects custom width and height', () => {
    const url = templateImageUrl('test', 'main', 1280, 720)
    expect(url).toBe('https://picsum.photos/seed/test/1280/720')
  })
})

describe('templateGalleryUrls', () => {
  it('generates the requested number of preview URLs', () => {
    const urls = templateGalleryUrls('my-template', 3)
    expect(urls).toHaveLength(3)
    expect(urls[0]).toBe('https://picsum.photos/seed/my-template-preview-1/640/360')
    expect(urls[1]).toBe('https://picsum.photos/seed/my-template-preview-2/640/360')
    expect(urls[2]).toBe('https://picsum.photos/seed/my-template-preview-3/640/360')
  })

  it('defaults to 5 previews', () => {
    const urls = templateGalleryUrls('test')
    expect(urls).toHaveLength(5)
  })
})
