import { useCallback, useState } from 'react'

import { storage, STORAGE_KEYS } from '@/lib/storage'

function getInitialState(): boolean {
  return storage.get(STORAGE_KEYS.SIDEBAR_COLLAPSED) === '1'
}

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(getInitialState)

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      storage.set(STORAGE_KEYS.SIDEBAR_COLLAPSED, next ? '1' : '0')
      return next
    })
  }, [])

  return { collapsed, toggle } as const
}
