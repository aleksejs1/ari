import { useTranslation } from 'react-i18next'
import { Calendar } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import type { Contact } from '@/types/models'

import { DisplayItem } from '../../components/DisplayItem'

export const UpcomingDatesSection = ({ contact }: { contact: Contact }) => {
  const { t } = useTranslation('contacts')
  const { formatDate } = useUserPrefs()
  const upcomingDates = (Array.isArray(contact.contactDates) ? contact.contactDates : [])?.filter(
    (d) => d.nextAnniversaryDate,
  )

  if (!upcomingDates || upcomingDates.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('nextAnniversary')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {upcomingDates.map((date, i) => (
          <DisplayItem
            key={i}
            icon={Calendar}
            label={date.text ?? undefined}
            value={`${formatDate(date.nextAnniversaryDate ?? '')} (${date.yearsAtNextAnniversary})`}
          />
        ))}
      </CardContent>
    </Card>
  )
}
