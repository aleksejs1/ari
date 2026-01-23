import { useTranslation } from 'react-i18next'
import { Edit } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { type Contact } from '@/types/models'

interface ContactActionsCellProps {
  contact: Contact
  onEdit: (contact: Contact) => void
}

export function ContactActionsCell({ contact, onEdit }: ContactActionsCellProps) {
  const { t } = useTranslation()

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 transition-opacity group-hover/row:opacity-100"
        onClick={(e) => {
          e.stopPropagation()
          onEdit(contact)
        }}
        aria-label={t('common.edit')}
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  )
}
