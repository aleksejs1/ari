import { useCallback, useMemo, useRef, useState } from 'react'

import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import { type LayoutPreset, layoutPresetRegistry } from '@/lib/widgets/LayoutPresets'
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

function redistributeWidgets(
  currentZones: Record<string, string[]>,
  targetPreset: LayoutPreset,
): Record<string, string[]> {
  // Collect all widget IDs preserving order
  const allWidgetIds = Object.values(currentZones).flat()

  // Initialize empty zones from target preset
  const newZones: Record<string, string[]> = {}
  for (const zone of targetPreset.zones) {
    newZones[zone.id] = []
  }

  // Distribute widgets into new zones based on defaultDimensions
  const zoneIds = targetPreset.zones.map((z) => z.id)
  const hasFullZone = zoneIds.includes('full')
  const columnZones = targetPreset.zones.filter((z) => z.basis !== '100%')

  for (const widgetId of allWidgetIds) {
    const def = widgetRegistry.get(widgetId)
    if (!def) {
      continue
    }
    const w = def.defaultDimensions.w
    if (w >= 12 && hasFullZone) {
      newZones['full'].push(widgetId)
    } else if (columnZones.length > 0) {
      // Round-robin or use heuristic based on width
      const targetZone = pickColumnZone(w, columnZones, newZones)
      newZones[targetZone].push(widgetId)
    } else {
      // Single zone layout — put everything in the first zone
      newZones[zoneIds[0]].push(widgetId)
    }
  }

  return newZones
}

function pickColumnZone(
  w: number,
  columnZones: { id: string; basis?: string }[],
  currentZones: Record<string, string[]>,
): string {
  if (columnZones.length === 1) {
    return columnZones[0].id
  }
  // For wider widgets prefer the first (wider) column zone
  if (w > 6) {
    return columnZones[0].id
  }
  // For narrower widgets, pick the zone with fewest items for balance
  let minCount = Infinity
  let targetId = columnZones[0].id
  for (const zone of columnZones) {
    const count = currentZones[zone.id]?.length ?? 0
    if (count < minCount) {
      minCount = count
      targetId = zone.id
    }
  }
  return targetId
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
  const [draftLayout, setDraftLayout] = useState<string>(DEFAULT_LAYOUT_ID)
  const snapshotRef = useRef<{
    zones: Record<string, string[]>
    hidden: string[]
    layout: string
  } | null>(null)

  const enterEditMode = useCallback(() => {
    const zonesClone = cloneZones(effectiveZones)
    setDraftZones(zonesClone)
    setDraftHidden([...settings.hidden])
    setDraftLayout(settings.layout)
    snapshotRef.current = {
      zones: zonesClone,
      hidden: [...settings.hidden],
      layout: settings.layout,
    }
    setIsEditMode(true)
  }, [effectiveZones, settings.hidden, settings.layout])

  const exitEditMode = useCallback(() => {
    setIsEditMode(false)
    snapshotRef.current = null
  }, [])

  const saveAndExit = useCallback(async () => {
    const newSettings: DashboardSettings = {
      layout: draftLayout,
      zones: draftZones,
      hidden: draftHidden,
    }
    await setDashboardSettings(JSON.stringify(newSettings))
    setIsEditMode(false)
    snapshotRef.current = null
  }, [draftLayout, draftZones, draftHidden, setDashboardSettings])

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

  const switchLayout = useCallback(
    (presetId: string) => {
      const preset = layoutPresetRegistry.get(presetId)
      if (!preset) {
        return
      }
      const currentZones = isEditMode ? draftZones : effectiveZones
      const newZones = redistributeWidgets(currentZones, preset)
      setDraftLayout(presetId)
      setDraftZones(newZones)
    },
    [isEditMode, draftZones, effectiveZones],
  )

  // Zones used for rendering: draft in edit mode, effective otherwise
  const activeZones = isEditMode ? draftZones : effectiveZones
  const activeHidden = isEditMode ? draftHidden : settings.hidden
  const activeLayout = isEditMode ? draftLayout : settings.layout

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
    activeLayout,
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
    switchLayout,
  }
}
