import { Edit } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { type Contact } from '@/types/models'

interface ContactsTableActionsProps {
  contact: Contact
  onEdit: (contact: Contact) => void
}

export function ContactsTableActions({ contact, onEdit }: ContactsTableActionsProps) {
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
