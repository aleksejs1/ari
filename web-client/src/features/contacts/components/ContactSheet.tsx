import { useTranslation } from 'react-i18next'

import { useCreateContact, useUpdateContact } from '../useContacts'

import { ContactForm } from './ContactForm'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { type Contact, type ContactFormValues } from '@/types/models'

// import { useState } from "react"

interface ContactSheetProps {
  isOpen: boolean
  onClose: () => void
  contact?: Contact | null // If present, it's Edit mode
}

export function ContactSheet({ isOpen, onClose, contact }: ContactSheetProps) {
  const createMutation = useCreateContact()
  const updateMutation = useUpdateContact()
  const { t } = useTranslation()

  // Transform Contact to FormValues if editing
  const defaultValues: ContactFormValues | undefined = contact
    ? {
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
          date: d.date ?? new Date().toISOString(), // Fallback if null, though backend should validate
          text: d.text ?? '',
        })),
      }
    : undefined

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
          <SheetTitle>{contact ? t('contacts.edit') : t('contacts.create')}</SheetTitle>
          <SheetDescription>
            {contact
              ? t('contacts.description', 'Make changes to your contact here.')
              : t('contacts.description', 'Add a new contact to your list.')}
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <ContactForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
