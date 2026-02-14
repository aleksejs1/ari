import { useCallback, useState } from 'react'

const STORAGE_KEY = 'sidebar-collapsed'

function getInitialState(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === '1'
  } catch {
    return false
  }
}

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(getInitialState)

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  return { collapsed, toggle } as const
}
