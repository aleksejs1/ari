import { parseISO } from 'date-fns'

export type DateInput = Date | string | null | undefined

/**
 * Format a date value using the user's configured date format.
 * Supported formats: 'dd.mm.yyyy' (European) or 'mm/dd/yyyy' (US, default).
 */
export function formatDate(date: DateInput, dateFormat: string): string {
  if (!date) {
    return ''
  }
  const d = typeof date === 'string' ? parseISO(date) : new Date(date)
  if (isNaN(d.getTime())) {
    return ''
  }

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  if (dateFormat === 'dd.mm.yyyy') {
    return `${day}.${month}.${year}`
  }
  return `${month}/${day}/${year}`
}

function parseTimeString(dateStr: string): { hours: number; minutes: string } | null {
  if (/^\d{1,2}:\d{2}$/.test(dateStr)) {
    const [hStr, mStr] = dateStr.split(':')
    return {
      hours: parseInt(hStr, 10),
      minutes: mStr,
    }
  }
  return null
}

/**
 * Format a time value using the user's configured time format.
 * Supported formats: '12h' (AM/PM) or '24h' (default).
 * Accepts Date objects, ISO strings, or 'HH:MM' time strings.
 */
export function formatTime(date: DateInput, timeFormat: string): string {
  if (!date) {
    return ''
  }

  let hours: number
  let minutes: string

  if (typeof date === 'string') {
    const parsed = parseTimeString(date)
    if (parsed) {
      hours = parsed.hours
      minutes = parsed.minutes
    } else {
      const d = parseISO(date)
      if (isNaN(d.getTime())) {
        return ''
      }
      hours = d.getHours()
      minutes = String(d.getMinutes()).padStart(2, '0')
    }
  } else {
    if (isNaN(date.getTime())) {
      return ''
    }
    hours = date.getHours()
    minutes = String(date.getMinutes()).padStart(2, '0')
  }

  if (timeFormat === '12h') {
    const period = hours >= 12 ? 'PM' : 'AM'
    const h = hours % 12 || 12
    return `${h}:${minutes} ${period}`
  }

  return `${String(hours).padStart(2, '0')}:${minutes}`
}
