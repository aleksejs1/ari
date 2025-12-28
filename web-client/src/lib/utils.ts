import { clsx, type ClassValue } from 'clsx'
import { format, type Locale } from 'date-fns'
import { enUS, ru } from 'date-fns/locale'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatApiDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().replace(/\.\d{3}Z$/, '+00:00')
}

const locales: Record<string, Locale> = {
  en: enUS,
  ru: ru,
}

export function formatLocalizedDate(
  date: string | Date | number,
  language = 'en',
  pattern = 'PPP',
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, pattern, { locale: locales[language] || enUS })
}

export function formatLocalizedDateTime(date: string | Date | number, language = 'en'): string {
  return formatLocalizedDate(date, language, 'PPP p')
}
