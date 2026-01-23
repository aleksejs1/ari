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
  showLogo: '1',
  setShowLogo: vi.fn(),
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
vi.mock('@/plugins/contacts/hooks/useAutocomplete', () => ({
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

// Global mock for lucide-react
vi.mock('lucide-react', async (importOriginal) => {
  const actual = (await importOriginal()) as any
  const mockedIcons: any = {}
  for (const key in actual) {
    if (typeof actual[key] === 'function' || (actual[key] && actual[key].$$typeof)) {
      mockedIcons[key] = (props: any) => <div data-testid={`icon-${key}`} {...props} />
    }
  }
  return {
    ...mockedIcons,
    CircleUser: (props: any) => <div data-testid="icon-CircleUser" {...props} />,
    Loader2: (props: any) => <div data-testid="icon-Loader2" {...props} />,
    Camera: (props: any) => <div data-testid="icon-Camera" {...props} />,
    Maximize2: (props: any) => <div data-testid="icon-Maximize2" {...props} />,
    Pencil: (props: any) => <div data-testid="icon-Pencil" {...props} />,
    Star: (props: any) => <div data-testid="icon-Star" {...props} />,
    Trash2: (props: any) => <div data-testid="icon-Trash2" {...props} />,
    Plus: (props: any) => <div data-testid="icon-Plus" {...props} />,
    X: (props: any) => <div data-testid="icon-X" {...props} />,
    Check: (props: any) => <div data-testid="icon-Check" {...props} />,
    ChevronLeft: (props: any) => <div data-testid="icon-ChevronLeft" {...props} />,
    ChevronRight: (props: any) => <div data-testid="icon-ChevronRight" {...props} />,
    ChevronsUpDown: (props: any) => <div data-testid="icon-ChevronsUpDown" {...props} />,
    Search: (props: any) => <div data-testid="icon-Search" {...props} />,
    Filter: (props: any) => <div data-testid="icon-Filter" {...props} />,
    Download: (props: any) => <div data-testid="icon-Download" {...props} />,
    Upload: (props: any) => <div data-testid="icon-Upload" {...props} />,
    Settings: (props: any) => <div data-testid="icon-Settings" {...props} />,
    LogOut: (props: any) => <div data-testid="icon-LogOut" {...props} />,
    User: (props: any) => <div data-testid="icon-User" {...props} />,
    Mail: (props: any) => <div data-testid="icon-Mail" {...props} />,
    Phone: (props: any) => <div data-testid="icon-Phone" {...props} />,
    MapPin: (props: any) => <div data-testid="icon-MapPin" {...props} />,
    Briefcase: (props: any) => <div data-testid="icon-Briefcase" {...props} />,
    Calendar: (props: any) => <div data-testid="icon-Calendar" {...props} />,
    FileText: (props: any) => <div data-testid="icon-FileText" {...props} />,
    Users: (props: any) => <div data-testid="icon-Users" {...props} />,
  }
})
