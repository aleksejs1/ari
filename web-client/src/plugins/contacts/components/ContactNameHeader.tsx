import type { HeaderContext } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { Contact } from '@/types/models'

export function ContactNameHeader({ column }: HeaderContext<Contact, unknown>) {
  const { t } = useTranslation()

  return (
    <div
      className="flex cursor-pointer items-center gap-1 hover:text-foreground"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          column.toggleSorting(column.getIsSorted() === 'asc')
        }
      }}
      role="button"
      tabIndex={0}
    >
      {t('contacts.name')}
      {(() => {
        if (column.getIsSorted() === 'asc') {
          return <ArrowUp className="h-4 w-4" />
        }
        if (column.getIsSorted() === 'desc') {
          return <ArrowDown className="h-4 w-4" />
        }
        return <ArrowUpDown className="h-4 w-4 opacity-50" />
      })()}
    </div>
  )
}
