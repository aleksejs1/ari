import type { ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

interface SortableWidgetProps {
  id: string
  children: ReactNode
  isEditMode: boolean
}

export default function SortableWidget({ id, children, isEditMode }: SortableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: !isEditMode,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'z-10 opacity-75' : ''}`}
    >
      {isEditMode ? (
        <button
          type="button"
          className="absolute -left-2 top-3 z-10 flex h-8 w-8 cursor-grab items-center justify-center rounded-md bg-white text-gray-400 shadow-md transition-colors hover:text-gray-600 active:cursor-grabbing dark:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      ) : null}
      {children}
    </div>
  )
}
