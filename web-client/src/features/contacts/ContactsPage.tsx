import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ContactsHeader } from './components/ContactsHeader'
import { ContactSheet } from './components/ContactSheet'
import { ContactsPagination } from './components/ContactsPagination'
import { ContactsTable } from './components/ContactsTable'
import { useContacts, useDeleteContact, type HydraCollection } from './useContacts'

import { type Contact } from '@/types/models'

export default function ContactsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useContacts(page)
  const deleteMutation = useDeleteContact()
  const { t } = useTranslation()

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  const handleCreate = () => {
    setSelectedContact(null)
    setIsSheetOpen(true)
  }

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact)
    setIsSheetOpen(true)
  }

  const handleDelete = async (contact: Contact) => {
    if (confirm(t('contacts.deleteConfirm'))) {
      if (contact['@id']) {
        await deleteMutation.mutateAsync(contact['@id'])
      }
    }
  }

  if (isLoading) return <div>{t('contacts.loading')}</div>
  if (isError) return <div>{t('contacts.error')}</div>

  const response = data as HydraCollection<Contact>
  const contacts = response['hydra:member'] ?? response.member ?? []
  const view = response['hydra:view']

  return (
    <div className="space-y-4">
      <ContactsHeader onCreate={handleCreate} />

      <ContactsTable data={contacts} onEdit={handleEdit} onDelete={handleDelete} />

      <ContactsPagination
        onPrevious={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
        hasPrevious={!!view?.['hydra:previous']}
        hasNext={!!view?.['hydra:next']}
      />

      <ContactSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        contact={selectedContact}
      />
    </div>
  )
}
