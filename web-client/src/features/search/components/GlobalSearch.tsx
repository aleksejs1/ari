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
import { cn } from '@/lib/utils'
import { type Contact } from '@/types/models'

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
  const [activeTab, setActiveTab] = useState<'contacts' | 'groups' | 'settings'>('contacts')
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

  const contactResults = contacts
    .map((c) => mapContactToSearchResult(c, t('contacts.noName')))
    .slice(0, 5)
  const groupResults = filteredGroups
    .map((g) => ({
      id: g['@id'] || String(g.id),
      title: g.name || t('common.unknown'),
      type: 'group' as const,
      url: `/contacts?group=${g['@id']}`,
    }))
    .slice(0, 5)
  const settingResults = filteredSettings
    .map((s) => ({
      ...s,
      type: 'setting' as const,
    }))
    .slice(0, 5)

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

  const tabs = [
    {
      id: 'contacts' as const,
      label: t('globalSearch.sections.contacts'),
      count: contactResults.length,
    },
    {
      id: 'groups' as const,
      label: t('globalSearch.sections.groups'),
      count: groupResults.length,
    },
    {
      id: 'settings' as const,
      label: t('globalSearch.sections.settings'),
      count: settingResults.length,
    },
  ]

  const getActiveResults = () => {
    switch (activeTab) {
      case 'contacts':
        return contactResults
      case 'groups':
        return groupResults
      case 'settings':
        return settingResults
      default:
        return []
    }
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
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 border-b-2 px-1 py-2 text-center text-xs font-medium transition-colors',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <ScrollArea className="max-h-[80vh]">
            {activeTab && getActiveResults().length > 0 ? (
              <div className="py-2">
                {getActiveResults().map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.url)}
                    className="flex w-full cursor-pointer items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    {item.title}
                  </button>
                ))}
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

function mapContactToSearchResult(c: Contact, noName: string): SearchResult {
  return {
    id: c['@id'] || String(c.id) || crypto.randomUUID(),
    title: getContactTitle(c, noName),
    type: 'contact',
    // @ts-expect-error - id is present in hydra response
    url: `/contacts/${c.id || c.uuid || c['@id']?.split('/').pop()}`,
  }
}

function getContactTitle(c: Contact, fallback: string): string {
  if (c.displayName) {
    return c.displayName
  }

  if (c.names && c.names.length > 0) {
    const first = c.names[0]
    return `${first.givenName || ''} ${first.familyName || ''}`.trim()
  }

  return fallback
}
