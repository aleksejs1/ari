import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useDroppable } from '@dnd-kit/core'

interface DroppableZoneProps {
  id: string
  label: string
  children: ReactNode
  isEditMode: boolean
}

function editModeClass(isEditMode: boolean, isOver: boolean): string {
  if (!isEditMode) {
    return ''
  }
  if (isOver) {
    return 'min-h-[80px] border-2 border-dashed p-2 border-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
  }
  return 'min-h-[80px] border-2 border-dashed p-2 border-gray-200 dark:border-gray-700'
}

export default function DroppableZone({ id, label, children, isEditMode }: DroppableZoneProps) {
  const { t } = useTranslation()
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-4 rounded-lg transition-colors ${editModeClass(isEditMode, isOver)}`}
    >
      {isEditMode ? (
        <div className="text-xs font-medium uppercase tracking-wider text-gray-400">{t(label)}</div>
      ) : null}
      {children}
    </div>
  )
}
