import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Pencil, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface InlineEditTriggerProps {
  children: ReactNode // The view content
  popoverContent: ReactNode // The form content
  isExistent: boolean
  label: string // e.g. "Name" or "Date" for aria-label
  open: boolean
  onOpenChange: (open: boolean) => void
  hideAddButton?: boolean
  className?: string
}

export function InlineEditTrigger({
  children,
  popoverContent,
  isExistent,
  label,
  open,
  onOpenChange,
  hideAddButton,
  className,
}: InlineEditTriggerProps) {
  const { t } = useTranslation('contacts')

  if (!isExistent && hideAddButton) {
    return (
      <div className={cn('group relative flex h-8 w-full items-center', className)}>
        <div className="flex h-full w-full items-center gap-2 text-sm">{children}</div>
      </div>
    )
  }

  return (
    <div className={cn('group relative flex h-8 w-full items-center', className)}>
      <div className="flex h-full w-full items-center gap-2 text-sm">
        {isExistent ? children : <span className="h-full w-full" />}
      </div>

      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              'absolute right-0 top-1/2 h-6 w-6 -translate-y-1/2',
              'opacity-0 transition-opacity group-hover:opacity-100',
              open && 'opacity-100',
            )}
            onClick={(e) => e.stopPropagation()}
            aria-label={t(isExistent ? 'common.edit' : 'common.add', { item: label })}
          >
            {isExistent ? <Pencil className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 p-2"
          align="start"
          side="bottom"
          alignOffset={-10}
          onClick={(e) => e.stopPropagation()}
        >
          {popoverContent}
        </PopoverContent>
      </Popover>
    </div>
  )
}
