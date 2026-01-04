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
  useUpdateContactGroups,
  useCreateContactEmail,
  useUpdateContactEmail,
  useDeleteContactEmail,
  useCreateContactPhone,
  useUpdateContactPhone,
  useDeleteContactPhone,
  useCreateContactName,
  useUpdateContactName,
  useDeleteContactName,
  getHydraMember,
  getHydraPagination,
} from './useContacts'

import {
  type Contact,
  type ContactDate,
  type ContactEmailAdress,
  type ContactPhoneNumber,
  type ContactName,
} from '@/types/models'

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
  const handleUpdateGroupsMutation = useUpdateContactGroups()

  const handleCreateEmailMutation = useCreateContactEmail()
  const handleUpdateEmailMutation = useUpdateContactEmail()
  const handleDeleteEmailMutation = useDeleteContactEmail()

  const handleCreatePhoneMutation = useCreateContactPhone()
  const handleUpdatePhoneMutation = useUpdateContactPhone()
  const handleDeletePhoneMutation = useDeleteContactPhone()

  const handleCreateNameMutation = useCreateContactName()
  const handleUpdateNameMutation = useUpdateContactName()
  const handleDeleteNameMutation = useDeleteContactName()

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

  const handleUpdateGroups = async (contact: Contact, groupIds: string[]) => {
    if (!contact['@id']) {
      return
    }
    await handleUpdateGroupsMutation.mutateAsync({
      contactId: contact['@id'],
      groupIds,
    })
  }

  const handleUpdateEmail = async (contact: Contact, email: ContactEmailAdress) => {
    if (!contact['@id']) {
      return
    }

    if (email['@id']) {
      // Update existing
      await handleUpdateEmailMutation.mutateAsync({
        id: email['@id'],
        data: email,
      })
    } else {
      // Create new
      await handleCreateEmailMutation.mutateAsync({
        ...email,
        contact: contact['@id'],
      })
    }
  }

  const handleDeleteEmail = async (_contact: Contact, email: ContactEmailAdress) => {
    if (!email['@id']) {
      return
    }

    await handleDeleteEmailMutation.mutateAsync(email['@id'])
  }

  const handleUpdatePhone = async (contact: Contact, phone: ContactPhoneNumber) => {
    if (!contact['@id']) {
      return
    }

    if (phone['@id']) {
      // Update existing
      await handleUpdatePhoneMutation.mutateAsync({
        id: phone['@id'],
        data: phone,
      })
    } else {
      // Create new
      await handleCreatePhoneMutation.mutateAsync({
        ...phone,
        contact: contact['@id'],
      })
    }
  }

  const handleDeletePhone = async (_contact: Contact, phone: ContactPhoneNumber) => {
    if (!phone['@id']) {
      return
    }

    await handleDeletePhoneMutation.mutateAsync(phone['@id'])
  }

  const handleUpdateName = async (contact: Contact, name: ContactName) => {
    if (!contact['@id']) {
      return
    }

    if (name['@id']) {
      // Update existing
      await handleUpdateNameMutation.mutateAsync({
        id: name['@id'],
        data: name,
      })
    } else {
      // Create new
      await handleCreateNameMutation.mutateAsync({
        ...name,
        contact: contact['@id'],
      })
    }
  }

  const handleDeleteName = async (_contact: Contact, name: ContactName) => {
    if (!name['@id']) {
      return
    }

    await handleDeleteNameMutation.mutateAsync(name['@id'])
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
            onUpdateGroups={handleUpdateGroups}
            onUpdateEmail={handleUpdateEmail}
            onDeleteEmail={handleDeleteEmail}
            onUpdatePhone={handleUpdatePhone}
            onDeletePhone={handleDeletePhone}
            onUpdateName={handleUpdateName}
            onDeleteName={handleDeleteName}
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
