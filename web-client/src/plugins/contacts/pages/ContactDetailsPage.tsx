import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ContactDetailsRegistry } from '@/lib/contacts/details/ContactDetailsRegistry'
import { type Contact } from '@/types/models'

import { DeleteContactDialog } from '../components/DeleteContactDialog'
import { SimilarContactsWidget } from '../components/SimilarContactsWidget'
import { GeneralInfoSection } from '../details/sections/GeneralInfoSection'
import { useContact, useDeleteContact, useExportContactVcard } from '../useContacts'

function ContactDetailsContent({ contact }: { contact: Contact }) {
  const { t } = useTranslation('contacts')
  const navigate = useNavigate()
  const deleteMutation = useDeleteContact()
  const exportVcardMutation = useExportContactVcard()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const allSections = ContactDetailsRegistry.getInstance().getAll()
  const topSections = allSections.filter((s) => s.layout === 'full' && s.id !== 'general_info')
  const leftSections = allSections.filter((s) => s.layout === 'left')
  const rightSections = allSections.filter((s) => s.layout === 'right')
  const bottomSections = allSections.filter((s) => s.layout === 'full-bottom')

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
    <div className="container mx-auto max-w-5xl space-y-6 py-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        data-testid="contact-details-back"
        className="gap-1 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-xs">{t('backToContacts')}</span>
      </Button>

      <GeneralInfoSection
        contact={contact}
        isEditing={isEditing}
        onEditingChange={setIsEditing}
        onExport={() => void handleExportVcard()}
        isExportPending={exportVcardMutation.isPending}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />

      {topSections.map((section) => {
        const Component = section.component
        return <Component key={section.id} contact={contact} />
      })}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-1">
          {rightSections.map((section) => {
            const Component = section.component
            return <Component key={section.id} contact={contact} />
          })}
        </div>
        <div className="flex flex-col gap-6 lg:col-span-2">
          {leftSections.map((section) => {
            const Component = section.component
            return <Component key={section.id} contact={contact} />
          })}
        </div>
      </div>

      {bottomSections.map((section) => {
        const Component = section.component
        return <Component key={section.id} contact={contact} />
      })}

      {!!contact['@id'] && (
        <SimilarContactsWidget
          contactId={contact['@id']}
          existingRelations={contact.contactRelations || []}
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
  const { t } = useTranslation('contacts')
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
