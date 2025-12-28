import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatApiDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().replace(/\.\d{3}Z$/, '+00:00')
}
