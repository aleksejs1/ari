import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import { contactColumnRegistry } from '@/lib/contacts/ContactColumnRegistry'
import { type Contact } from '@/types/models'

import { registerDefaultColumns } from '../columns'
import { ContactModal } from '../components/ContactModal'
import { ContactsHeader } from '../components/ContactsHeader'
import { ContactsPagination } from '../components/ContactsPagination'
import { ContactsTable } from '../components/ContactsTable'
import { useContactsParams } from '../hooks/useContactsParams'
import { useNeedsAttentionPaged } from '../hooks/useInteractions'
import { getHydraMember, getHydraPagination, useContacts } from '../useContacts'

// Ensure default columns are registered
registerDefaultColumns()

interface PageDataParams {
  page: number
  needsAttention: boolean
  group?: string
  search?: string
  sorting?: { id: string; desc: boolean }
}

function usePageData({ page, needsAttention, group, search, sorting }: PageDataParams) {
  const filters = useMemo(() => {
    const f: { group?: string; search?: string } = {}
    if (group) {
      f.group = group
    }
    if (search) {
      f.search = search
    }
    return f
  }, [group, search])

  const regularQuery = useContacts(page, filters, sorting, { enabled: !needsAttention })
  const needsAttentionQuery = useNeedsAttentionPaged(page, { enabled: needsAttention })
  return needsAttention ? needsAttentionQuery : regularQuery
}

export default function ContactsPage() {
  const { page, group, search, needsAttention, sorting, handleSearch, handleSort, setPage } =
    useContactsParams()
  const { t } = useTranslation('contacts')

  const { data, isLoading, isPlaceholderData, isError } = usePageData({
    page,
    needsAttention,
    group,
    search,
    sorting,
  })

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
    return <div>{t('loading')}</div>
  }
  if (isError) {
    return <div>{t('error')}</div>
  }

  const contacts = getHydraMember(data)
  const { totalPages, hasNext, hasPrevious } = getHydraPagination(data, page)

  return (
    <div className={`space-y-6 ${isPlaceholderData ? 'opacity-50' : ''}`}>
      <ContactsHeader onCreate={handleCreate} search={search || ''} onSearchChange={handleSearch} />

      <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div className="flex-1">
          <ErrorBoundary>
            <ContactsTable
              data={contacts}
              columns={columns}
              onEdit={handleEdit}
              onSort={handleSort}
              sorting={sorting}
            />
          </ErrorBoundary>
        </div>

        {totalPages > 1 && (
          <ContactsPagination
            onPrevious={() => setPage(Math.max(1, page - 1))}
            onNext={() => {
              if (hasNext) {
                setPage(page + 1)
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
