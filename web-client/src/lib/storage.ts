export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebar-collapsed',
  SIDEBAR_GROUPS_EXPANDED: 'sidebar-groups-expanded',
} as const

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

function get(key: StorageKey): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function set(key: StorageKey, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // ignore (e.g. private mode with storage quota exceeded)
  }
}

function remove(key: StorageKey): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

export const storage = { get, set, remove }
