import { useTranslation } from 'react-i18next'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { type Contact, type ContactFormValues } from '@/types/models'

import { mapContactToFormValues } from '../contactUtils'
import { useCreateContact, useUpdateContact } from '../useContacts'

import { ContactForm } from './ContactForm'
import { ContactTimeline } from './ContactTimeline'

// import { useState } from "react"

interface ContactSheetProps {
  isOpen: boolean
  onClose: () => void
  contact?: Contact | null // If present, it's Edit mode
}

export function ContactSheet({ isOpen, onClose, contact }: ContactSheetProps) {
  const createMutation = useCreateContact()
  const updateMutation = useUpdateContact()
  const { t } = useTranslation('contacts')

  // Transform Contact to FormValues if editing
  const defaultValues = contact ? mapContactToFormValues(contact) : undefined

  const handleSubmit = async (data: ContactFormValues) => {
    try {
      if (contact && contact['@id']) {
        await updateMutation.mutateAsync({ id: contact['@id'], data })
      } else {
        await createMutation.mutateAsync(data)
      }
      onClose()
    } catch (error) {
      console.error('Failed to save contact', error)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{contact ? t('edit') : t('create')}</SheetTitle>
          <SheetDescription>
            {contact ? t('editDescription') : t('createDescription')}
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <ContactForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
          {contact && contact.id ? <ContactTimeline contactId={contact.id.toString()} /> : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
