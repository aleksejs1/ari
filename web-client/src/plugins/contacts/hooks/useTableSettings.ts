import { useEffect, useRef, useState } from 'react'
import type { ColumnOrderState, VisibilityState } from '@tanstack/react-table'

import { useUserPrefs } from '@/hooks/useUserPrefs.hook'

import type { TypedColumnSpec } from '../utils'

export interface TableSettings {
  visibility: VisibilityState
  order: ColumnOrderState
  typedColumns: TypedColumnSpec[]
  viewMode: 'table' | 'cards'
}

export function parseTableSettings(raw: string): TableSettings {
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !('visibility' in parsed)) {
      return {
        visibility: parsed as VisibilityState,
        order: [],
        typedColumns: [],
        viewMode: 'table',
      }
    }
    return {
      visibility: {},
      order: [],
      typedColumns: [],
      viewMode: 'table',
      ...(parsed as Partial<TableSettings>),
    }
  } catch {
    return { visibility: {}, order: [], typedColumns: [], viewMode: 'table' }
  }
}

export function useTableSettings() {
  const { contactTableSettings, setContactTableSettings, formatDate, isLoading } = useUserPrefs()

  const [settings, setSettings] = useState<TableSettings>(() =>
    parseTableSettings(contactTableSettings),
  )

  // C1 fix: the useState initializer runs once on mount before prefs are fetched from the
  // server. When prefs arrive (isLoading → false), we need to sync local state with the
  // server data. We do this exactly once — after that, local state is the source of truth
  // so that subsequent user interactions are not overwritten by stale server responses.
  const hasInitializedFromServer = useRef(false)
  useEffect(() => {
    if (isLoading || hasInitializedFromServer.current) {
      return
    }
    hasInitializedFromServer.current = true
    setSettings(parseTableSettings(contactTableSettings))
  }, [isLoading, contactTableSettings])

  const updateSettings = (next: Partial<TableSettings>) => {
    const newSettings = { ...settings, ...next }
    setSettings(newSettings)
    void setContactTableSettings(JSON.stringify(newSettings))
  }

  return { settings, formatDate, isLoading, updateSettings }
}
