import { describe, it, expect } from 'vitest'

import { cn } from './utils'

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
