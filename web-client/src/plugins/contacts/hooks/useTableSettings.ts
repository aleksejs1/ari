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

const DEFAULTS: TableSettings = { visibility: {}, order: [], typedColumns: [], viewMode: 'table' }

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

function parseNewFormat(p: Record<string, unknown>): TableSettings {
  return {
    visibility: isPlainObject(p['visibility']) ? (p['visibility'] as VisibilityState) : {},
    order: Array.isArray(p['order']) ? (p['order'] as ColumnOrderState) : [],
    typedColumns: Array.isArray(p['typedColumns']) ? (p['typedColumns'] as TypedColumnSpec[]) : [],
    viewMode: p['viewMode'] === 'cards' ? 'cards' : 'table',
  }
}

export function parseTableSettings(raw: string): TableSettings {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isPlainObject(parsed)) {
      return DEFAULTS
    }
    // Legacy format: top-level object was the visibility map (no 'visibility' key)
    if (!('visibility' in parsed)) {
      return { ...DEFAULTS, visibility: parsed as VisibilityState }
    }
    return parseNewFormat(parsed)
  } catch {
    return DEFAULTS
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
