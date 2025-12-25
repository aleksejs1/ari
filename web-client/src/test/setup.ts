import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Global mock for i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => new Promise((resolve) => resolve(undefined)),
      language: 'en',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => undefined,
  },
}))
