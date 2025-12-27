import { Pencil, Plus } from 'lucide-react'
import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

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
}

export function InlineEditTrigger({
  children,
  popoverContent,
  isExistent,
  label,
  open,
  onOpenChange,
}: InlineEditTriggerProps) {
  const { t } = useTranslation()

  return (
    <div className="relative group w-full h-8 flex items-center">
      <div className="flex items-center gap-2 text-sm w-full h-full">
        {isExistent ? children : <span className="w-full h-full" />}
      </div>

      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6',
              'opacity-0 group-hover:opacity-100 transition-opacity',
              open && 'opacity-100',
            )}
            aria-label={t(isExistent ? 'common.edit' : 'common.add', { item: label })}
          >
            {isExistent ? <Pencil className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-2" align="start" side="bottom" alignOffset={-10}>
          {popoverContent}
        </PopoverContent>
      </Popover>
    </div>
  )
}
