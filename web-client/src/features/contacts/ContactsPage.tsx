import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ContactsHeader } from './components/ContactsHeader'
import { ContactSheet } from './components/ContactSheet'
import { ContactsPagination } from './components/ContactsPagination'
import { ContactsTable } from './components/ContactsTable'
import {
  useContacts,
  useDeleteContact,
  useUpdateContactName,
  useCreateContactName,
  useDeleteContactName,
  getHydraMember,
  getHydraPagination,
} from './useContacts'

import { type Contact, type ContactName } from '@/types/models'

export default function ContactsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isPlaceholderData, isError } = useContacts(page)
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
    if (confirm(t('contacts.deleteConfirm')) && contact['@id']) {
      await deleteMutation.mutateAsync(contact['@id'])
    }
  }

  const handleUpdateNameMutation = useUpdateContactName()
  const handleCreateNameMutation = useCreateContactName()
  const handleDeleteNameMutation = useDeleteContactName()

  const handleUpdateName = async (contact: Contact, name: ContactName) => {
    if (name['@id']) {
      await handleUpdateNameMutation.mutateAsync({ id: name['@id'], data: name })
    } else if (contact['@id']) {
      // Create new name
      await handleCreateNameMutation.mutateAsync({
        ...name,
        contact: contact['@id'],
      })
    }
  }

  const handleDeleteName = async (_contact: Contact, name: ContactName) => {
    if (!name['@id']) return
    await handleDeleteNameMutation.mutateAsync(name['@id'])
  }

  if (isLoading && !isPlaceholderData) return <div>{t('contacts.loading')}</div>
  if (isError) return <div>{t('contacts.error')}</div>

  const contacts = getHydraMember(data)
  const { totalPages, hasNext, hasPrevious } = getHydraPagination(data, page)

  return (
    <div className={`space-y-4 ${isPlaceholderData ? 'opacity-50' : ''}`}>
      <ContactsHeader onCreate={handleCreate} />

      <ContactsTable
        data={contacts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUpdateName={handleUpdateName}
        onDeleteName={handleDeleteName}
      />

      {totalPages > 1 && (
        <ContactsPagination
          onPrevious={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => (hasNext ? setPage((p) => p + 1) : null)}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      )}

      <ContactSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        contact={selectedContact}
      />
    </div>
  )
}
