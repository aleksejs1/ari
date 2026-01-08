import { Search } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useContacts } from '@/features/contacts/useContacts'
import { getHydraMember } from '@/features/contacts/utils'
import { useGroups } from '@/features/groups/useGroups'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchResult {
  id: string
  title: string
  type: 'contact' | 'group' | 'setting'
  url: string
}

export function GlobalSearch() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, 300)
  const containerRef = useRef<HTMLDivElement>(null)

  // Contacts Search
  const { data: contactsData } = useContacts(1, { search: debouncedQuery })
  const contacts = getHydraMember(contactsData)

  // Groups Search
  const { data: groupsData } = useGroups()
  const groups = groupsData || []
  const filteredGroups = groups.filter((group) =>
    group.name?.toLowerCase().includes(debouncedQuery.toLowerCase()),
  )

  // Settings Search
  const settingsRoutes = [
    {
      id: 'settings-language',
      title: t('settings.language'),
      url: '/settings',
    },
    {
      id: 'settings-date-format',
      title: t('settings.dateFormat'),
      url: '/settings',
    },
    {
      id: 'settings-time-format',
      title: t('settings.timeFormat'),
      url: '/settings',
    },
    {
      id: 'settings-fav-group',
      title: t('settings.favouriteGroupName'),
      url: '/settings',
    },
    {
      id: 'settings-export',
      title: t('settings.exportData'),
      url: '/settings',
    },
    {
      id: 'settings-import',
      title: t('settings.importData'),
      url: '/settings',
    },
  ]
  const filteredSettings = settingsRoutes.filter((setting) =>
    setting.title.toLowerCase().includes(debouncedQuery.toLowerCase()),
  )

  const hasResults = contacts.length > 0 || filteredGroups.length > 0 || filteredSettings.length > 0

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = async (url: string) => {
    setOpen(false)
    setQuery('')
    await navigate(url)
  }

  const renderSection = (title: string, items: SearchResult[]) => {
    if (items.length === 0) {
      return null
    }

    return (
      <div className="py-2">
        <h3 className="px-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        {items.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item.url)}
            className="flex w-full cursor-pointer items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            {item.title}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Input
          type="search"
          placeholder={t('globalSearch.placeholder')}
          className="w-full bg-gray-50 pl-9 dark:bg-gray-900"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
        />
      </div>

      {open && query.length > 0 ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-full overflow-hidden rounded-lg border bg-white shadow-lg dark:bg-gray-800">
          <ScrollArea className="max-h-[80vh]">
            {hasResults ? (
              <div className="divide-y dark:divide-gray-700">
                {renderSection(
                  t('globalSearch.sections.contacts'),
                  contacts.map((c) => ({
                    id: c['@id'] || String(c.id) || crypto.randomUUID(),
                    title:
                      c.displayName ||
                      (c.names && c.names.length > 0
                        ? `${c.names[0].givenName || ''} ${c.names[0].familyName || ''}`.trim()
                        : t('contacts.noName')),
                    type: 'contact',
                    // @ts-expect-error - id is present in hydra response
                    url: `/contacts/${c.id || c.uuid || c['@id']?.split('/').pop()}`,
                  })),
                )}
                {renderSection(
                  t('globalSearch.sections.groups'),
                  filteredGroups.map((g) => ({
                    id: g['@id'] || String(g.id),
                    title: g.name || t('common.unknown'),
                    type: 'group',
                    url: `/contacts?group=${g['@id']}`,
                  })),
                )}
                {renderSection(
                  t('globalSearch.sections.settings'),
                  filteredSettings.map((s) => ({
                    ...s,
                    type: 'setting' as const,
                  })),
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">{t('common.noResults')}</div>
            )}
          </ScrollArea>
        </div>
      ) : null}
    </div>
  )
}
