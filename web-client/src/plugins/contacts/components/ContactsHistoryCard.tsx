import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Contact } from '@/types/models'

import { ContactTimeline } from './ContactTimeline'

export function ContactsHistoryCard({ contact }: { contact: Contact }) {
  const { t } = useTranslation('contacts')
  if (!contact.id) {
    return null
  }
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>{t('history.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ContactTimeline contactId={contact.id.toString()} />
      </CardContent>
    </Card>
  )
}
