import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Contact } from '@/types/models'

import { ContactTimeline } from './ContactTimeline'

export function ContactsHistoryCard({ contact }: { contact: Contact }) {
  const { t } = useTranslation('contacts')
  const [isOpen, setIsOpen] = useState(false)

  if (!contact.id) {
    return null
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader className="cursor-pointer select-none" onClick={() => setIsOpen((v) => !v)}>
        <CardTitle className="flex items-center justify-between">
          {t('history.title')}
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CardTitle>
      </CardHeader>
      {isOpen ? (
        <CardContent>
          <ContactTimeline contactId={contact.id.toString()} />
        </CardContent>
      ) : null}
    </Card>
  )
}
