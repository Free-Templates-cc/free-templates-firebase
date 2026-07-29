import { describe, it, expect } from 'vitest'
import { cn, formatNumber, formatDate, slugify } from '../utils'

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
