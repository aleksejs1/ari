import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { AlertTriangle } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { type LayoutPreset, layoutPresetRegistry } from '@/lib/widgets/LayoutPresets'
import { widgetRegistry } from '@/lib/widgets/WidgetRegistry'

import DroppableZone from './DroppableZone'
import SortableWidget from './SortableWidget'

interface DynamicDashboardProps {
  zones: Record<string, string[]>
  layoutId: string
  isEditMode?: boolean
  onReorder?: (zone: string, oldIndex: number, newIndex: number) => void
  onMoveWidget?: (widgetId: string, fromZone: string, toZone: string, index: number) => void
}

function WidgetRenderer({ id }: { id: string }) {
  const def = widgetRegistry.get(id)
  if (!def) {
    return <FallbackWidget id={id} />
  }
  return (
    <div data-testid={`widget-${id}`}>
      <def.component />
    </div>
  )
}

function findZoneForWidget(zones: Record<string, string[]>, widgetId: string): string | null {
  for (const [zoneId, ids] of Object.entries(zones)) {
    if (ids.includes(widgetId)) {
      return zoneId
    }
  }
  return null
}

function resolveTargetZone(zones: Record<string, string[]>, overId: string): string | null {
  return zones[overId] ? overId : findZoneForWidget(zones, overId)
}

function basisToPercent(basis?: string): string | undefined {
  if (!basis) {
    return undefined
  }
  if (basis === '100%') {
    return '100%'
  }
  const match = /^(\d+)\/(\d+)$/.exec(basis)
  if (match) {
    return `${(Number(match[1]) / Number(match[2])) * 100}%`
  }
  return undefined
}

function getPreset(layoutId: string): LayoutPreset {
  return (
    layoutPresetRegistry.get(layoutId) ?? {
      id: layoutId,
      name: layoutId,
      description: '',
      zones: [{ id: 'main', label: 'Main', basis: '100%' }],
    }
  )
}

function EditModeDashboard({
  zones,
  layoutId,
  onReorder,
  onMoveWidget,
}: {
  zones: Record<string, string[]>
  layoutId: string
  onReorder?: (zone: string, oldIndex: number, newIndex: number) => void
  onMoveWidget?: (widgetId: string, fromZone: string, toZone: string, index: number) => void
}) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const preset = getPreset(layoutId)
  const fullWidthZones = preset.zones.filter((z) => z.basis === '100%')
  const columnZones = preset.zones.filter((z) => z.basis !== '100%')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) {
      return
    }

    const activeWidgetId = active.id as string
    const overId = over.id as string
    const fromZone = findZoneForWidget(zones, activeWidgetId)
    const toZone = resolveTargetZone(zones, overId)

    if (!fromZone || !toZone || fromZone === toZone) {
      return
    }

    const targetIndex = Math.max(0, zones[toZone]?.indexOf(overId) ?? 0)
    onMoveWidget?.(activeWidgetId, fromZone, toZone, targetIndex)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) {
      return
    }

    const activeWidgetId = active.id as string
    const overId = over.id as string
    const activeZone = findZoneForWidget(zones, activeWidgetId)
    const overZone = resolveTargetZone(zones, overId)

    if (activeZone && overZone && activeZone === overZone) {
      const ids = zones[activeZone]
      const oldIndex = ids.indexOf(activeWidgetId)
      const newIndex = ids.indexOf(overId)
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder?.(activeZone, oldIndex, newIndex)
      }
    }
  }

  const allItems = Object.values(zones).flat()

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4 pl-4">
        <SortableContext items={allItems} strategy={verticalListSortingStrategy}>
          {fullWidthZones.map((zoneDef) => (
            <DroppableZone key={zoneDef.id} id={zoneDef.id} label={zoneDef.label} isEditMode>
              {(zones[zoneDef.id] || []).map((id) => (
                <SortableWidget key={id} id={id} isEditMode>
                  <WidgetRenderer id={id} />
                </SortableWidget>
              ))}
            </DroppableZone>
          ))}

          {columnZones.length > 0 ? (
            <div className="flex flex-col gap-4 md:flex-row">
              {columnZones.map((zoneDef) => (
                <div
                  key={zoneDef.id}
                  className="flex min-w-0 flex-col"
                  style={{ flexBasis: basisToPercent(zoneDef.basis) }}
                >
                  <DroppableZone id={zoneDef.id} label={zoneDef.label} isEditMode>
                    {(zones[zoneDef.id] || []).map((id) => (
                      <SortableWidget key={id} id={id} isEditMode>
                        <WidgetRenderer id={id} />
                      </SortableWidget>
                    ))}
                  </DroppableZone>
                </div>
              ))}
            </div>
          ) : null}
        </SortableContext>
      </div>

      <DragOverlay>{activeId ? <WidgetRenderer id={activeId} /> : null}</DragOverlay>
    </DndContext>
  )
}

function StaticDashboard({
  zones,
  layoutId,
}: {
  zones: Record<string, string[]>
  layoutId: string
}) {
  const preset = getPreset(layoutId)
  const fullWidthZones = preset.zones.filter((z) => z.basis === '100%')
  const columnZones = preset.zones.filter((z) => z.basis !== '100%')

  return (
    <div className="space-y-4">
      {fullWidthZones.map((zoneDef) =>
        (zones[zoneDef.id] || []).map((id) => <WidgetRenderer key={id} id={id} />),
      )}
      {columnZones.length > 0 ? (
        <div className="flex flex-col gap-4 md:flex-row">
          {columnZones.map((zoneDef) => {
            const ids = zones[zoneDef.id] || []
            if (ids.length === 0) {
              return null
            }
            return (
              <div
                key={zoneDef.id}
                className="flex min-w-0 flex-col gap-4"
                style={{ flexBasis: basisToPercent(zoneDef.basis) }}
              >
                {ids.map((id) => (
                  <WidgetRenderer key={id} id={id} />
                ))}
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default function DynamicDashboard({
  zones,
  layoutId,
  isEditMode = false,
  onReorder,
  onMoveWidget,
}: DynamicDashboardProps) {
  if (isEditMode) {
    return (
      <EditModeDashboard
        zones={zones}
        layoutId={layoutId}
        onReorder={onReorder}
        onMoveWidget={onMoveWidget}
      />
    )
  }
  return <StaticDashboard zones={zones} layoutId={layoutId} />
}

function FallbackWidget({ id }: { id: string }) {
  const { t } = useTranslation()
  return (
    <Card className="border-dashed border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10">
      <CardContent className="flex items-center gap-2 p-4 text-yellow-600 dark:text-yellow-400">
        <AlertTriangle className="h-5 w-5" />
        <span className="font-medium">
          {t('dashboard.widgetNotFound', { defaultValue: 'Widget not found' })}: {id}
        </span>
      </CardContent>
    </Card>
  )
}
