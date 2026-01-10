import { Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useUpcomingAnniversaries } from './useUpcomingAnniversaries'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatLocalizedDate } from '@/lib/utils'

export default function UpcomingAnniversariesWidget() {
  const { t, i18n } = useTranslation()
  const { data: anniversaries, isLoading, error } = useUpcomingAnniversaries()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5 text-blue-500" />
            {t('dashboard.upcomingAnniversaries')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-4">
            <span className="animate-pulse">{t('common.loading')}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5 text-blue-500" />
            {t('dashboard.upcomingAnniversaries')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">{t('contacts.error')}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-5 w-5 text-blue-500" />
          {t('dashboard.upcomingAnniversaries')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!anniversaries || anniversaries.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('dashboard.noUpcoming')}</p>
        ) : (
          <ul className="space-y-4">
            {anniversaries.map((anniversary) => {
              const contactId = anniversary.contact?.['@id']?.split('/').pop()
              return (
                <li key={anniversary.id} className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <Link to={`/contacts/${contactId}`} className="font-medium hover:underline">
                      {anniversary.contact?.displayName || t('contacts.noName')}
                    </Link>
                    <span className="text-sm font-semibold text-primary">
                      {anniversary.nextAnniversaryDate
                        ? formatLocalizedDate(
                            anniversary.nextAnniversaryDate,
                            i18n.language,
                            'd MMMM',
                          )
                        : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{anniversary.text}</span>
                    {anniversary.yearsAtNextAnniversary !== undefined && (
                      <span>
                        {t('dashboard.yearsCount', {
                          count: anniversary.yearsAtNextAnniversary ?? 0,
                        })}
                      </span>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
