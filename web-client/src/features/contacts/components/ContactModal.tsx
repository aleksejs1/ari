import { mapContactToFormValues } from '../contactUtils'
import { useCreateContact, useUpdateContact } from '../useContacts'

import { ContactModalForm } from './ContactModalForm'

import { type Contact, type ContactFormValues } from '@/types/models'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  contact?: Contact | null // If present, it's Edit mode
}

export function ContactModal({ isOpen, onClose, contact }: ContactModalProps) {
  const createMutation = useCreateContact()
  const updateMutation = useUpdateContact()

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
    <ContactModalForm
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isSubmitting={createMutation.isPending || updateMutation.isPending}
    />
  )
}
