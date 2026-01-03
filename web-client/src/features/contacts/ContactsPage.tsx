import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { ContactsHeader } from './components/ContactsHeader'
import { ContactSheet } from './components/ContactSheet'
import { ContactsPagination } from './components/ContactsPagination'
import { ContactsTable } from './components/ContactsTable'
import {
  useContacts,
  useDeleteContact,
  useUpdateContactDate,
  useCreateContactDate,
  getHydraMember,
  getHydraPagination,
} from './useContacts'

import { type Contact, type ContactDate } from '@/types/models'

export default function ContactsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const group = searchParams.get('group') ?? undefined
  const search = searchParams.get('search') ?? undefined

  const handleSearch = (value: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      if (value) {
        newParams.set('search', value)
      } else {
        newParams.delete('search')
      }
      newParams.set('page', '1')
      return newParams
    })
  }

  const { data, isLoading, isPlaceholderData, isError } = useContacts(page, { group, search })
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

  const handleUpdateDateMutation = useUpdateContactDate()
  const handleCreateDateMutation = useCreateContactDate()
  const handleDeleteDateMutation = useDeleteContact()

  const handleUpdateDate = async (contact: Contact, date: ContactDate) => {
    if (date['@id']) {
      await handleUpdateDateMutation.mutateAsync({ id: date['@id'], data: date })
    } else if (contact['@id']) {
      // Create new date
      await handleCreateDateMutation.mutateAsync({
        ...date,
        contact: contact['@id'],
      })
    }
  }

  const handleDeleteDate = async (_contact: Contact, date: ContactDate) => {
    if (!date['@id']) {
      return
    }
    await handleDeleteDateMutation.mutateAsync(date['@id'])
  }

  if (isLoading && !isPlaceholderData) {
    return <div>{t('contacts.loading')}</div>
  }
  if (isError) {
    return <div>{t('contacts.error')}</div>
  }

  const contacts = getHydraMember(data)
  const { totalPages, hasNext, hasPrevious } = getHydraPagination(data, page)

  return (
    <div className={`space-y-6 ${isPlaceholderData ? 'opacity-50' : ''}`}>
      <ContactsHeader onCreate={handleCreate} search={search || ''} onSearchChange={handleSearch} />

      <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div className="flex-1">
          <ContactsTable
            data={contacts}
            onEdit={handleEdit}
            onUpdateDate={handleUpdateDate}
            onDeleteDate={handleDeleteDate}
          />
        </div>

        {totalPages > 1 && (
          <ContactsPagination
            onPrevious={() => {
              const newParams = new URLSearchParams(searchParams)
              newParams.set('page', Math.max(1, page - 1).toString())
              setSearchParams(newParams)
            }}
            onNext={() => {
              if (hasNext) {
                const newParams = new URLSearchParams(searchParams)
                newParams.set('page', (page + 1).toString())
                setSearchParams(newParams)
              }
            }}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            currentPage={page}
            totalPages={totalPages}
          />
        )}
      </div>

      <ContactSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        contact={selectedContact}
      />
    </div>
  )
}
