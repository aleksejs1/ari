import { describe, expect, it } from 'vitest'

import { cn, formatApiDate, formatLocalizedDate } from './utils'

describe('cn utility', () => {
  it('should merge classes correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  it('should handle conditional classes', () => {
    const isTrue = true
    const isFalse = false
    expect(cn('class1', isTrue && 'class2', isFalse && 'class3')).toBe('class1 class2')
  })

  it('should merge tailwind classes correctly', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8')
  })
})

describe('formatApiDate utility', () => {
  it('should format date correctly to YYYY-MM-DDTHH:mm:ss+00:00', () => {
    // We use a fixed date to test
    const date = new Date('2025-12-02T12:34:56Z')
    // formatApiDate should produce +00:00 for UTC
    expect(formatApiDate(date)).toBe('2025-12-02T12:34:56+00:00')
  })

  it('should handle string input', () => {
    expect(formatApiDate('2025-12-02T12:34:56Z')).toBe('2025-12-02T12:34:56+00:00')
  })
})

describe('formatLocalizedDate utility', () => {
  it('should return original string on invalid date string', () => {
    expect(formatLocalizedDate('invalid-date')).toBe('invalid-date')
  })
})
