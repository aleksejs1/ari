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
import { widgetRegistry } from '@/lib/widgets/WidgetRegistry'

import DroppableZone from './DroppableZone'
import SortableWidget from './SortableWidget'

interface DynamicDashboardProps {
  zones: Record<string, string[]>
  isEditMode?: boolean
  onReorder?: (zone: string, oldIndex: number, newIndex: number) => void
  onMoveWidget?: (widgetId: string, fromZone: string, toZone: string, index: number) => void
}

function WidgetRenderer({ id }: { id: string }) {
  const def = widgetRegistry.get(id)
  if (!def) {
    return <FallbackWidget id={id} />
  }
  return <def.component />
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

function EditModeDashboard({
  zones,
  onReorder,
  onMoveWidget,
}: {
  zones: Record<string, string[]>
  onReorder?: (zone: string, oldIndex: number, newIndex: number) => void
  onMoveWidget?: (widgetId: string, fromZone: string, toZone: string, index: number) => void
}) {
  const [activeId, setActiveId] = useState<string | null>(null)

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
  const fullIds = zones.full || []
  const leftIds = zones.left || []
  const rightIds = zones.right || []
  const hasColumns = leftIds.length > 0 || rightIds.length > 0

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
          <DroppableZone id="full" label="dashboard.zone.full" isEditMode>
            {fullIds.map((id) => (
              <SortableWidget key={id} id={id} isEditMode>
                <WidgetRenderer id={id} />
              </SortableWidget>
            ))}
          </DroppableZone>

          {hasColumns ? (
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex flex-1 flex-col md:basis-7/12">
                <DroppableZone id="left" label="dashboard.zone.left" isEditMode>
                  {leftIds.map((id) => (
                    <SortableWidget key={id} id={id} isEditMode>
                      <WidgetRenderer id={id} />
                    </SortableWidget>
                  ))}
                </DroppableZone>
              </div>
              <div className="flex flex-1 flex-col md:basis-5/12">
                <DroppableZone id="right" label="dashboard.zone.right" isEditMode>
                  {rightIds.map((id) => (
                    <SortableWidget key={id} id={id} isEditMode>
                      <WidgetRenderer id={id} />
                    </SortableWidget>
                  ))}
                </DroppableZone>
              </div>
            </div>
          ) : null}
        </SortableContext>
      </div>

      <DragOverlay>{activeId ? <WidgetRenderer id={activeId} /> : null}</DragOverlay>
    </DndContext>
  )
}

function StaticDashboard({ zones }: { zones: Record<string, string[]> }) {
  const fullIds = zones.full || []
  const leftIds = zones.left || []
  const rightIds = zones.right || []
  const hasColumns = leftIds.length > 0 || rightIds.length > 0

  return (
    <div className="space-y-4">
      {fullIds.map((id) => (
        <WidgetRenderer key={id} id={id} />
      ))}
      {hasColumns ? (
        <div className="flex flex-col gap-4 md:flex-row">
          {leftIds.length > 0 ? (
            <div className="flex flex-1 flex-col gap-4 md:basis-7/12">
              {leftIds.map((id) => (
                <WidgetRenderer key={id} id={id} />
              ))}
            </div>
          ) : null}
          {rightIds.length > 0 ? (
            <div className="flex flex-1 flex-col gap-4 md:basis-5/12">
              {rightIds.map((id) => (
                <WidgetRenderer key={id} id={id} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default function DynamicDashboard({
  zones,
  isEditMode = false,
  onReorder,
  onMoveWidget,
}: DynamicDashboardProps) {
  if (isEditMode) {
    return <EditModeDashboard zones={zones} onReorder={onReorder} onMoveWidget={onMoveWidget} />
  }
  return <StaticDashboard zones={zones} />
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
