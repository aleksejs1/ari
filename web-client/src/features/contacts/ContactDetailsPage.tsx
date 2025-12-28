import { ArrowLeft, Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { ContactForm } from './components/ContactForm'
import { ContactTimeline } from './components/ContactTimeline'
import { useContact, useUpdateContact, useDeleteContact } from './useContacts'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatApiDate } from '@/lib/utils'
import { type ContactFormValues } from '@/types/models'

export default function ContactDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { data: contact, isLoading, error } = useContact(id ?? '')
  const updateMutation = useUpdateContact()
  const deleteMutation = useDeleteContact()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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
        <p className="mb-4 text-red-500">{t('errors.failedToLoadContact')}</p>
        <Button onClick={() => navigate(-1)}>{t('common.backToContacts')}</Button>
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
      date: d.date ?? formatApiDate(new Date()),
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

  const handleDelete = async () => {
    try {
      if (contact?.['@id']) {
        await deleteMutation.mutateAsync(contact['@id'])
        await navigate(-1)
      }
    } catch (error) {
      console.error('Failed to delete contact', error)
    }
  }

  return (
    <div className="container mx-auto max-w-3xl space-y-6 py-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="flex-1 text-2xl font-bold">{t('contacts.details')}</h1>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          {t('common.delete')}
        </Button>
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
          <CardTitle>{t('contacts.history.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {contact.id ? <ContactTimeline contactId={contact.id.toString()} /> : null}
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('contacts.deleteConfirmTitle')}</DialogTitle>
            <DialogDescription>{t('contacts.deleteConfirm')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => void handleDelete()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
