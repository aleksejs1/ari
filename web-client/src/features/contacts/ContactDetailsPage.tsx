import { ArrowLeft, Loader2, Trash2, Download } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { ContactForm } from './components/ContactForm'
import { ContactTimeline } from './components/ContactTimeline'
import { ContactView } from './components/ContactView'
import { DeleteContactDialog } from './components/DeleteContactDialog'
import { SimilarContactsWidget } from './components/SimilarContactsWidget'
import { mapContactToFormValues } from './contactUtils'
import {
  useContact,
  useUpdateContact,
  useDeleteContact,
  useExportContactVcard,
} from './useContacts'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type Contact, type ContactFormValues } from '@/types/models'

function ContactDetailsContent({ contact }: { contact: Contact }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const updateMutation = useUpdateContact()
  const deleteMutation = useDeleteContact()
  const exportVcardMutation = useExportContactVcard()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const defaultValues = mapContactToFormValues(contact)

  const handleSubmit = async (data: ContactFormValues) => {
    try {
      if (contact['@id']) {
        await updateMutation.mutateAsync({ id: contact['@id'], data })
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Failed to update contact', error)
    }
  }

  const handleExportVcard = async () => {
    try {
      if (contact?.['@id']) {
        await exportVcardMutation.mutateAsync({
          id: contact['@id'],
          filename: `contact_${contact.contactNames?.[0]?.given || 'export'}_${contact.contactNames?.[0]?.family || ''}`,
        })
      }
    } catch (error) {
      console.error('Failed to export contact vCard', error)
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex w-full items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => {
              if (isEditing) {
                setIsEditing(false)
              } else {
                await navigate(-1)
              }
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="flex-1 truncate text-2xl font-bold">
            {isEditing ? t('contacts.editContact') : t('contacts.details')}
          </h1>
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto">
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleExportVcard()}
              disabled={exportVcardMutation.isPending}
              className="flex-1 gap-2 md:flex-none"
            >
              {exportVcardMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {t('contacts.exportVcard')}
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex-1 gap-2 md:flex-none"
          >
            <Trash2 className="h-4 w-4" />
            {t('common.delete')}
          </Button>
        </div>
      </div>

      {isEditing ? (
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
      ) : (
        <ContactView contact={contact} onEdit={() => setIsEditing(true)} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('contacts.history.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {contact.id ? <ContactTimeline contactId={contact.id.toString()} /> : null}
        </CardContent>
      </Card>

      {!!contact['@id'] && (
        <SimilarContactsWidget
          contactId={contact['@id']}
          existingRelations={contact.contactRelations}
        />
      )}

      <DeleteContactDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}

export default function ContactDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { data: contact, isLoading, error } = useContact(id ?? '')

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

  return <ContactDetailsContent contact={contact} />
}
