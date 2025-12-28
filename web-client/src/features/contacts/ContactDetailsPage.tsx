import { ArrowLeft, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { ContactForm } from './components/ContactForm'
import { ContactTimeline } from './components/ContactTimeline'
import { useContact, useUpdateContact } from './useContacts'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type ContactFormValues } from '@/types/models'

export default function ContactDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { data: contact, isLoading, error } = useContact(id ?? '')
  const updateMutation = useUpdateContact()

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !contact) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-4">{t('errors.failedToLoadContact')}</p>
        <Button onClick={() => navigate('/')}>{t('common.backToContacts')}</Button>
      </div>
    )
  }

  const defaultValues: ContactFormValues = {
    contactNames: (contact.contactNames ?? []).map((n) => ({
      id: n.id?.toString(),
      '@id': n['@id'],
      '@type': 'ContactName',
      given: n.given ?? '',
      family: n.family ?? '',
    })),
    contactDates: (contact.contactDates ?? []).map((d) => ({
      id: d.id?.toString(),
      '@id': d['@id'],
      '@type': 'ContactDate',
      date: d.date ?? new Date().toISOString(),
      text: d.text ?? '',
    })),
  }

  const handleSubmit = async (data: ContactFormValues) => {
    try {
      if (contact['@id']) {
        await updateMutation.mutateAsync({ id: contact['@id'], data })
      }
    } catch (error) {
      console.error('Failed to update contact', error)
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{t('contacts.details')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('contacts.editContact')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isSubmitting={updateMutation.isPending}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('contacts.history')}</CardTitle>
        </CardHeader>
        <CardContent>
          {contact.id && <ContactTimeline contactId={contact.id.toString()} />}
        </CardContent>
      </Card>
    </div>
  )
}
