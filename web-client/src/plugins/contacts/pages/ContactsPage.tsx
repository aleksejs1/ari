import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { registerDefaultColumns } from '../columns'
import { ContactModal } from '../components/ContactModal'
import { ContactsHeader } from '../components/ContactsHeader'
import { ContactsPagination } from '../components/ContactsPagination'
import { ContactsTable } from '../components/ContactsTable'
import { getHydraMember, getHydraPagination, useContacts } from '../useContacts'

import { contactColumnRegistry } from '@/lib/contacts/ContactColumnRegistry'
import { type Contact } from '@/types/models'

// Ensure default columns are registered
registerDefaultColumns()

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

  const [sorting, setSorting] = useState<{ id: string; desc: boolean } | undefined>(undefined)

  const handleSort = (id: string, desc: boolean) => {
    setSorting({ id, desc })
  }

  const { data, isLoading, isPlaceholderData, isError } = useContacts(
    page,
    { group, search },
    sorting,
  )
  const { t } = useTranslation()

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  const columns = useMemo(() => contactColumnRegistry.getAll(), [])

  const handleCreate = () => {
    setSelectedContact(null)
    setIsSheetOpen(true)
  }

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact)
    setIsSheetOpen(true)
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
            columns={columns}
            onEdit={handleEdit}
            onSort={handleSort}
            sorting={sorting}
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

      <ContactModal
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        contact={selectedContact}
      />
    </div>
  )
}
