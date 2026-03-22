import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useDebounce } from '@/hooks/useDebounce'
import { getHydraMember } from '@/lib/api/hydra'
import { cn } from '@/lib/utils'
import { type Contact } from '@/types/models'

import { useContacts } from '@/plugins/contacts/useContacts'
import { useGroups } from '@/plugins/groups/hooks/useGroups'

interface SearchResult {
  id: string
  title: string
  type: 'contact' | 'group' | 'setting'
  url: string
}

const MIN_QUERY_LENGTH = 2
const MAX_QUERY_LENGTH = 200

export function GlobalSearch() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, 300)
  const [activeTab, setActiveTab] = useState<'contacts' | 'groups' | 'settings'>('contacts')
  const containerRef = useRef<HTMLDivElement>(null)

  // Contacts Search
  const { data: contactsData } = useContacts(1, { search: debouncedQuery }, undefined, {
    enabled: debouncedQuery.length >= MIN_QUERY_LENGTH,
  })
  const contacts = getHydraMember(contactsData)

  // Groups Search
  const { data: groupsData } = useGroups(undefined, {
    enabled: debouncedQuery.length >= MIN_QUERY_LENGTH,
  })
  const groups = groupsData || []
  const filteredGroups = groups.filter((group) =>
    group.name?.toLowerCase().includes(debouncedQuery.toLowerCase()),
  )

  // Settings Search — memoized to avoid recreation on every render
  const settingsRoutes = useMemo(
    () => [
      {
        id: 'nav-audit-logs',
        title: t('app.navigation.sidebar.auditLogs'),
        url: '/settings/audit-logs',
      },
      {
        id: 'nav-groups',
        title: t('app.navigation.sidebar.groups'),
        url: '/groups',
      },
      {
        id: 'nav-notification-channels',
        title: t('app.navigation.sidebar.notificationChannels'),
        url: '/settings/notification-channels',
      },
      {
        id: 'nav-notification-policies',
        title: t('app.navigation.sidebar.notificationPolicies'),
        url: '/settings/notification-policies',
      },
      {
        id: 'nav-create-notification-policy',
        title: t('notification_policies.create'),
        url: '/settings/notification-policies/new',
      },
      {
        id: 'nav-google-import',
        title: t('app.navigation.sidebar.googleImport'),
        url: '/settings/google-import',
      },
      {
        id: 'nav-settings',
        title: t('app.navigation.sidebar.settings'),
        url: '/settings/general',
      },
      {
        id: 'settings-export',
        title: t('settings.exportData'),
        url: '/settings/data',
      },
      {
        id: 'settings-import',
        title: t('settings.importData'),
        url: '/settings/data',
      },
    ],
    [t],
  )
  const filteredSettings = settingsRoutes.filter((setting) =>
    setting.title.toLowerCase().includes(debouncedQuery.toLowerCase()),
  )

  const contactResults = contacts
    .map((c, i) => mapContactToSearchResult(c, t('contacts.noName'), i))
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
    <div ref={containerRef} className="relative w-full min-w-[200px] max-w-sm">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Input
          type="search"
          placeholder={t('globalSearch.placeholder')}
          className="w-full bg-gray-50 pl-9 dark:bg-gray-900"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value.slice(0, MAX_QUERY_LENGTH))
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
        />
      </div>

      {open && query.length >= MIN_QUERY_LENGTH ? (
        <div className="fixed left-4 right-4 top-[3.5rem] z-[100] mt-2 overflow-hidden rounded-lg border bg-white shadow-lg dark:bg-gray-800 md:absolute md:left-0 md:right-0 md:top-full md:mt-2 md:w-full">
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
                {activeTab === 'contacts' && (contactsData?.totalItems ?? 0) > 5 && (
                  <div className="border-t border-gray-100 px-4 py-2 pt-2 dark:border-gray-700">
                    <button
                      onClick={() =>
                        // encodeURIComponent prevents query string injection (e.g. '&page=2')
                        handleSelect(
                          `/contacts?page=1&search=${encodeURIComponent(debouncedQuery)}`,
                        )
                      }
                      className="w-full rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {t('globalSearch.showAllResults')}
                    </button>
                  </div>
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

function mapContactToSearchResult(c: Contact, noName: string, index: number): SearchResult {
  return {
    // Prefer IRI or numeric id; fall back to index so the key is stable across renders
    id: c['@id'] ?? (c.id !== undefined ? String(c.id) : String(index)),
    title: getContactTitle(c, noName),
    type: 'contact',
    url: `/contacts/${c.id || c.uuid || c['@id']?.split('/').pop()}`,
  }
}

function getContactTitle(c: Contact, fallback: string): string {
  if (c.displayName) {
    return c.displayName
  }

  if (c.contactNames && c.contactNames.length > 0) {
    const first = c.contactNames[0]
    return `${first.given || ''} ${first.family || ''}`.trim()
  }

  return fallback
}
