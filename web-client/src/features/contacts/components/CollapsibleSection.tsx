import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState, type ReactNode } from 'react'

interface CollapsibleSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  className?: string
  action?: ReactNode
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  className = '',
  action,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between border-b pb-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-1 items-center gap-2 text-left transition-colors hover:text-blue-600"
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
          <h3 className="text-sm font-medium">{title}</h3>
        </button>
        {action ? <div className="ml-2">{action}</div> : null}
      </div>
      {isOpen ? (
        <div className="duration-200 animate-in fade-in slide-in-from-top-1">{children}</div>
      ) : null}
    </div>
  )
}
