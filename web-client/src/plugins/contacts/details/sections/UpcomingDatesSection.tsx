import { useTranslation } from 'react-i18next'
import { Calendar } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRegionalPrefs } from '@/contexts/RegionalPrefsContext'
import type { Contact } from '@/types/models'

import { DisplayItem } from '../../components/DisplayItem'

function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.max(0, Math.round((target.getTime() - today.getTime()) / 86_400_000))
}

export const UpcomingDatesSection = ({ contact }: { contact: Contact }) => {
  const { t } = useTranslation('contacts')
  const { formatDate } = useRegionalPrefs()
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
        {upcomingDates.map((date, i) => {
          const days = daysUntil(date.nextAnniversaryDate!)
          const years = date.yearsAtNextAnniversary
          const hint =
            years !== null && years !== undefined
              ? `${t('anniversaryInDays', { count: days })} · ${t('anniversaryYears', { count: years })}`
              : t('anniversaryInDays', { count: days })
          return (
            <DisplayItem
              key={i}
              icon={Calendar}
              label={date.text ?? undefined}
              value={`${formatDate(date.nextAnniversaryDate!)} (${hint})`}
            />
          )
        })}
      </CardContent>
    </Card>
  )
}
