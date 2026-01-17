import '@testing-library/jest-dom'
import { vi } from 'vitest'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

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
  dashboardNotificationPolicy: '',
  setLanguage: vi.fn(),
  setDateFormat: vi.fn(),
  setTimeFormat: vi.fn(),
  setFavouriteGroupName: vi.fn(),
  setGoogleSyncOnUpdate: vi.fn(),
  setDashboardNotificationPolicy: vi.fn(),
  setContactTableSettings: vi.fn(),
  theme: 'system',
  setTheme: vi.fn(),
  formatDate,
  formatTime: vi.fn().mockReturnValue(''),
  isLoading: false,
}

// Global mock for useUserPrefs
vi.mock('@/hooks/useUserPrefs', () => ({
  useUserPrefs: () => defaultPrefs,
}))

// Global mock for useAutocomplete
vi.mock('@/features/contacts/hooks/useAutocomplete', () => ({
  useAutocomplete: () => ({
    data: {
      phoneTypes: ['Mobile', 'Work', 'Home'],
      emailTypes: ['Personal', 'Work', 'Other'],
      addressTypes: ['Home', 'Work', 'Other'],
      biographyTypes: ['Bio', 'Note'],
      dateTypes: ['Birthday', 'Anniversary'],
      organizationTypes: ['Work', 'Volunteer', 'Education'],
      organizationNames: [],
      organizationTitles: [],
      organizationDepartments: [],
    },
    isLoading: false,
  }),
}))
