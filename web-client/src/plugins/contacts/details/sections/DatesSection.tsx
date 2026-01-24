import { useTranslation } from 'react-i18next'
import { Calendar } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import type { Contact, ContactDate } from '@/types/models'

import { ContactDateInlineEdit } from '../../components/ContactDateInlineEdit'
import { DisplayItem } from '../../components/DisplayItem'
import { useCreateContactDate, useDeleteContactDate, useUpdateContactDate } from '../../useContacts'

export const DatesSection = ({ contact }: { contact: Contact }) => {
  const { t } = useTranslation('contacts')
  const { formatDate } = useUserPrefs()

  // Date Mutations
  const handleCreateDateMutation = useCreateContactDate()
  const handleUpdateDateMutation = useUpdateContactDate()
  const handleDeleteDateMutation = useDeleteContactDate()

  const handleUpdateDate = async (date: ContactDate) => {
    if (!contact['@id']) {
      return
    }
    if (date['@id']) {
      await handleUpdateDateMutation.mutateAsync({ id: date['@id'], data: date })
    } else {
      await handleCreateDateMutation.mutateAsync({ ...date, contact: contact['@id'] })
    }
  }

  const handleDeleteDate = async (date: ContactDate) => {
    if (date['@id']) {
      await handleDeleteDateMutation.mutateAsync(date['@id'])
    }
  }

  if (!contact.contactDates || contact.contactDates.length === 0) {
    return null
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('dates')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {(Array.isArray(contact.contactDates) ? contact.contactDates : []).map((date, i) => (
          <ContactDateInlineEdit
            key={i}
            date={date}
            onUpdate={handleUpdateDate}
            onDelete={() => handleDeleteDate(date)}
            hideAddButton
            className="h-auto w-full"
          >
            <DisplayItem
              icon={Calendar}
              label={date.text ?? undefined}
              value={(() => {
                if (!date.date) {
                  return ''
                }
                const formattedDate = formatDate(date.date)
                return date.yearsPassed ? `${formattedDate} (${date.yearsPassed})` : formattedDate
              })()}
            />
          </ContactDateInlineEdit>
        ))}
      </CardContent>
    </Card>
  )
}
