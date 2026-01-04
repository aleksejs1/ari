import { Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { ContactDateInlineEdit } from '../ContactDateInlineEdit'
import { DisplayItem } from '../DisplayItem'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import type { Contact, ContactDate } from '@/types/models'

interface DatesCardProps {
  contact: Contact
  onUpdateDate: (date: ContactDate) => void
  onDeleteDate: (date: ContactDate) => void
}

export const DatesCard = ({ contact, onUpdateDate, onDeleteDate }: DatesCardProps) => {
  const { t } = useTranslation()
  const { formatDate } = useUserPrefs()
  if (!contact.contactDates || contact.contactDates.length === 0) {
    return null
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('contacts.dates')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {contact.contactDates.map((date, i) => (
          <ContactDateInlineEdit
            key={i}
            date={date}
            onUpdate={onUpdateDate}
            onDelete={() => onDeleteDate(date)}
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
