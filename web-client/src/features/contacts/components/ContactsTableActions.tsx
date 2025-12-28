import { Edit, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { type Contact } from '@/types/models'

interface ContactsTableActionsProps {
  contact: Contact
  onEdit: (contact: Contact) => void
  onDelete: (contact: Contact) => void
}

export function ContactsTableActions({ contact, onEdit, onDelete }: ContactsTableActionsProps) {
  const { t } = useTranslation()

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation()
          onEdit(contact)
        }}
        aria-label={t('common.edit')}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-red-500 hover:text-red-600"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(contact)
        }}
        aria-label={t('common.delete')}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
