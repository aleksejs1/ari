/* eslint-disable complexity */
import { type ClassValue, clsx } from 'clsx'
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
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date

    if (isNaN(d.getTime())) {
        return typeof date === 'string' ? date : ''
    }
    return format(d, pattern, { locale: locales[language] || enUS })
}

export function formatLocalizedDateTime(date: string | Date | number, language = 'en'): string {
    return formatLocalizedDate(date, language, 'PPP p')
}

export function parseLocalizedDate(input: string, dateFormat: string): string | null {
    if (!input.trim()) {
        return null
    }

    const parts = input.split(/[./-]/)
    if (parts.length !== 3) {
        return null
    }

    let day, month, year

    if (dateFormat === 'dd.mm.yyyy') {
        day = parseInt(parts[0], 10)
        month = parseInt(parts[1], 10)
        year = parseInt(parts[2], 10)
    } else {
        // mm/dd/yyyy
        month = parseInt(parts[0], 10)
        day = parseInt(parts[1], 10)
        year = parseInt(parts[2], 10)
    }

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return null
    }
    if (month < 1 || month > 12) {
        return null
    }
    if (day < 1 || day > 31) {
        return null
    }
    if (year < 1000 || year > 9999) {
        return null
    }

    const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const d = new Date(iso)
    return isNaN(d.getTime()) ? null : iso
}
