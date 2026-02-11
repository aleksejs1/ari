import { useCallback, useMemo } from 'react'

import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import { widgetRegistry } from '@/lib/widgets/WidgetRegistry'

export interface DashboardSettings {
  layout: string
  zones: Record<string, string[]>
  hidden: string[]
}

const DEFAULT_LAYOUT = 'two-column'

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
      layout: parsed.layout || DEFAULT_LAYOUT,
      zones: parsed.zones || {},
      hidden: parsed.hidden || [],
    }
  } catch {
    return { layout: DEFAULT_LAYOUT, zones: {}, hidden: [] }
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

export function useDashboardSettings() {
  const { dashboardSettings, setDashboardSettings } = useUserPrefs()

  const settings = useMemo(() => parseSettings(dashboardSettings), [dashboardSettings])

  const effectiveZones = useMemo(() => {
    const hasZones = Object.keys(settings.zones).length > 0
    const zones = hasZones ? { ...settings.zones } : buildDefaultZones()
    return mergeWithRegistry(zones)
  }, [settings.zones])

  const isWidgetVisible = useCallback(
    (id: string) => !settings.hidden.includes(id),
    [settings.hidden],
  )

  const visibleLayout = useMemo(() => {
    const result: Record<string, string[]> = {}
    for (const [zone, ids] of Object.entries(effectiveZones)) {
      result[zone] = ids.filter((id) => !settings.hidden.includes(id))
    }
    return result
  }, [effectiveZones, settings.hidden])

  const toggleWidget = useCallback(
    async (widgetId: string) => {
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
    [settings, effectiveZones, setDashboardSettings],
  )

  const allWidgets = useMemo(() => widgetRegistry.getAll(), [])

  return {
    settings,
    effectiveZones,
    visibleLayout,
    allWidgets,
    isWidgetVisible,
    toggleWidget,
  }
}
