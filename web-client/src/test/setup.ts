import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Global mock for i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => Promise.resolve(true),
      language: 'en',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => undefined,
  },
}))

const formatDate = (date: Date | string | null | undefined) => {
  if (!date) {
    return ''
  }
  const d = new Date(date)
  if (isNaN(d.getTime())) {
    return ''
  }
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${month}/${day}/${year}`
}

const defaultPrefs = {
  language: 'en',
  dateFormat: 'mm/dd/yyyy',
  setLanguage: vi.fn(),
  setDateFormat: vi.fn(),
  formatDate,
  isLoading: false,
}

// Global mock for useUserPrefs
vi.mock('@/hooks/useUserPrefs', () => ({
  useUserPrefs: () => defaultPrefs,
}))
