import { useCallback, useMemo, useRef, useState } from 'react'

import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import { layoutPresetRegistry } from '@/lib/widgets/LayoutPresets'
import { widgetRegistry } from '@/lib/widgets/WidgetRegistry'

export interface DashboardSettings {
  layout: string
  zones: Record<string, string[]>
  hidden: string[]
}

const DEFAULT_LAYOUT_ID = 'two-column'

const DEFAULT_ZONE_ORDER = [
  'stats',
  'recent-logins',
  'upcoming-anniversaries',
  'groups',
  'recent-audit-logs',
]

function parseSettings(json: string): DashboardSettings {
  try {
    const parsed = JSON.parse(json) as Partial<DashboardSettings>
    return {
      layout: parsed.layout || DEFAULT_LAYOUT_ID,
      zones: parsed.zones || {},
      hidden: parsed.hidden || [],
    }
  } catch {
    return { layout: DEFAULT_LAYOUT_ID, zones: {}, hidden: [] }
  }
}

function buildDefaultZones(): Record<string, string[]> {
  const zones: Record<string, string[]> = { full: [], left: [], right: [] }

  for (const id of DEFAULT_ZONE_ORDER) {
    const def = widgetRegistry.get(id)
    if (!def) {
      continue
    }
    const zone = getDefaultZoneForWidget(def.defaultDimensions.w)
    zones[zone].push(id)
  }

  // Also add any registered widgets not in the default order
  for (const def of widgetRegistry.getAll()) {
    if (DEFAULT_ZONE_ORDER.includes(def.id)) {
      continue
    }
    const zone = getDefaultZoneForWidget(def.defaultDimensions.w)
    zones[zone].push(def.id)
  }

  return zones
}

function getDefaultZoneForWidget(w: number): string {
  if (w >= 12) {
    return 'full'
  }
  return w > 6 ? 'left' : 'right'
}

function mergeWithRegistry(zones: Record<string, string[]>): Record<string, string[]> {
  const allKnown = new Set(Object.values(zones).flat())

  // Add any newly registered widgets not yet in any zone
  for (const def of widgetRegistry.getAll()) {
    if (allKnown.has(def.id)) {
      continue
    }
    const zone = getDefaultZoneForWidget(def.defaultDimensions.w)
    zones[zone] = [...(zones[zone] || []), def.id]
  }

  // Filter out widgets that are no longer registered
  const registered = new Set(widgetRegistry.getAll().map((d) => d.id))
  const result: Record<string, string[]> = {}
  for (const [zone, ids] of Object.entries(zones)) {
    result[zone] = ids.filter((id) => registered.has(id))
  }
  return result
}

function cloneZones(zones: Record<string, string[]>): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const [key, value] of Object.entries(zones)) {
    result[key] = [...value]
  }
  return result
}

export function useDashboardSettings() {
  const { dashboardSettings, setDashboardSettings } = useUserPrefs()

  const settings = useMemo(() => parseSettings(dashboardSettings), [dashboardSettings])

  const effectiveZones = useMemo(() => {
    const hasZones = Object.keys(settings.zones).length > 0
    const zones = hasZones ? { ...settings.zones } : buildDefaultZones()
    return mergeWithRegistry(zones)
  }, [settings.zones])

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false)
  const [draftZones, setDraftZones] = useState<Record<string, string[]>>({})
  const [draftHidden, setDraftHidden] = useState<string[]>([])
  const snapshotRef = useRef<{ zones: Record<string, string[]>; hidden: string[] } | null>(null)

  const enterEditMode = useCallback(() => {
    const zonesClone = cloneZones(effectiveZones)
    setDraftZones(zonesClone)
    setDraftHidden([...settings.hidden])
    snapshotRef.current = { zones: zonesClone, hidden: [...settings.hidden] }
    setIsEditMode(true)
  }, [effectiveZones, settings.hidden])

  const exitEditMode = useCallback(() => {
    setIsEditMode(false)
    snapshotRef.current = null
  }, [])

  const saveAndExit = useCallback(async () => {
    const newSettings: DashboardSettings = {
      ...settings,
      zones: draftZones,
      hidden: draftHidden,
    }
    await setDashboardSettings(JSON.stringify(newSettings))
    setIsEditMode(false)
    snapshotRef.current = null
  }, [settings, draftZones, draftHidden, setDashboardSettings])

  const resetToDefault = useCallback(async () => {
    await setDashboardSettings('{}')
    setIsEditMode(false)
    snapshotRef.current = null
  }, [setDashboardSettings])

  const reorderInZone = useCallback((zone: string, oldIndex: number, newIndex: number) => {
    setDraftZones((prev) => {
      const items = [...(prev[zone] || [])]
      const [moved] = items.splice(oldIndex, 1)
      items.splice(newIndex, 0, moved)
      return { ...prev, [zone]: items }
    })
  }, [])

  const moveWidget = useCallback(
    (widgetId: string, fromZone: string, toZone: string, newIndex: number) => {
      setDraftZones((prev) => {
        const from = [...(prev[fromZone] || [])].filter((id) => id !== widgetId)
        const to = fromZone === toZone ? from : [...(prev[toZone] || [])]
        to.splice(newIndex, 0, widgetId)
        return { ...prev, [fromZone]: from, [toZone]: to }
      })
    },
    [],
  )

  // Zones used for rendering: draft in edit mode, effective otherwise
  const activeZones = isEditMode ? draftZones : effectiveZones
  const activeHidden = isEditMode ? draftHidden : settings.hidden

  const isWidgetVisible = useCallback((id: string) => !activeHidden.includes(id), [activeHidden])

  const visibleLayout = useMemo(() => {
    const result: Record<string, string[]> = {}
    for (const [zone, ids] of Object.entries(activeZones)) {
      result[zone] = ids.filter((id) => !activeHidden.includes(id))
    }
    return result
  }, [activeZones, activeHidden])

  const toggleWidget = useCallback(
    async (widgetId: string) => {
      if (isEditMode) {
        setDraftHidden((prev) =>
          prev.includes(widgetId) ? prev.filter((id) => id !== widgetId) : [...prev, widgetId],
        )
        return
      }
      const newHidden = settings.hidden.includes(widgetId)
        ? settings.hidden.filter((id) => id !== widgetId)
        : [...settings.hidden, widgetId]

      const newSettings: DashboardSettings = {
        ...settings,
        zones: effectiveZones,
        hidden: newHidden,
      }
      await setDashboardSettings(JSON.stringify(newSettings))
    },
    [isEditMode, settings, effectiveZones, setDashboardSettings],
  )

  const allWidgets = useMemo(() => widgetRegistry.getAll(), [])
  const availableLayouts = useMemo(() => layoutPresetRegistry.getAll(), [])

  return {
    settings,
    effectiveZones: activeZones,
    visibleLayout,
    allWidgets,
    availableLayouts,
    isWidgetVisible,
    toggleWidget,
    isEditMode,
    enterEditMode,
    exitEditMode,
    saveAndExit,
    resetToDefault,
    reorderInZone,
    moveWidget,
  }
}
