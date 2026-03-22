import { describe, expect, it } from 'vitest'

import { formatDate, formatTime } from './dateFormatting'

describe('formatDate', () => {
  it('returns empty string for null', () => {
    expect(formatDate(null, 'mm/dd/yyyy')).toBe('')
  })

  it('returns empty string for undefined', () => {
    expect(formatDate(undefined, 'mm/dd/yyyy')).toBe('')
  })

  it('returns empty string for invalid date string', () => {
    expect(formatDate('not-a-date', 'mm/dd/yyyy')).toBe('')
  })

  it('formats ISO string in US format (mm/dd/yyyy)', () => {
    expect(formatDate('2024-03-15', 'mm/dd/yyyy')).toBe('03/15/2024')
  })

  it('formats ISO string in European format (dd.mm.yyyy)', () => {
    expect(formatDate('2024-03-15', 'dd.mm.yyyy')).toBe('15.03.2024')
  })

  it('formats Date object in US format', () => {
    const d = new Date(2024, 2, 15) // month is 0-indexed
    expect(formatDate(d, 'mm/dd/yyyy')).toBe('03/15/2024')
  })

  it('formats Date object in European format', () => {
    const d = new Date(2024, 2, 15)
    expect(formatDate(d, 'dd.mm.yyyy')).toBe('15.03.2024')
  })

  it('pads single-digit day and month', () => {
    expect(formatDate('2024-01-05', 'mm/dd/yyyy')).toBe('01/05/2024')
  })
})

describe('formatTime', () => {
  it('returns empty string for null', () => {
    expect(formatTime(null, '24h')).toBe('')
  })

  it('returns empty string for undefined', () => {
    expect(formatTime(undefined, '24h')).toBe('')
  })

  it('returns empty string for invalid date string', () => {
    expect(formatTime('not-a-time', '24h')).toBe('')
  })

  it('formats HH:MM string in 24h mode', () => {
    expect(formatTime('14:30', '24h')).toBe('14:30')
  })

  it('formats HH:MM string in 12h mode (PM)', () => {
    expect(formatTime('14:30', '12h')).toBe('2:30 PM')
  })

  it('formats HH:MM string in 12h mode (AM)', () => {
    expect(formatTime('09:05', '12h')).toBe('9:05 AM')
  })

  it('formats midnight correctly in 12h mode', () => {
    expect(formatTime('00:00', '12h')).toBe('12:00 AM')
  })

  it('formats noon correctly in 12h mode', () => {
    expect(formatTime('12:00', '12h')).toBe('12:00 PM')
  })

  it('formats Date object in 24h mode', () => {
    const d = new Date(2024, 0, 1, 14, 30)
    expect(formatTime(d, '24h')).toBe('14:30')
  })

  it('formats Date object in 12h mode', () => {
    const d = new Date(2024, 0, 1, 9, 5)
    expect(formatTime(d, '12h')).toBe('9:05 AM')
  })

  it('pads hours in 24h mode', () => {
    expect(formatTime('09:05', '24h')).toBe('09:05')
  })
})
