import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, FolderOpen, Settings2 } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { storage, STORAGE_KEYS } from '@/lib/storage'
import { cn } from '@/lib/utils'

import { useGroups } from '../hooks/useGroups'

function getGroupsExpanded(): boolean {
  return storage.get(STORAGE_KEYS.SIDEBAR_GROUPS_EXPANDED) !== '0'
}

export function GroupsSidebarSection({
  onNavigate,
  collapsed,
}: {
  onNavigate?: () => void
  collapsed?: boolean
}) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(getGroupsExpanded)
  const { data: allGroups = [] } = useGroups()
  const groups = allGroups.filter((g) => (g.contactsCount ?? 0) > 0)

  const toggleExpanded = () => {
    setExpanded((prev) => {
      const next = !prev
      storage.set(STORAGE_KEYS.SIDEBAR_GROUPS_EXPANDED, next ? '1' : '0')
      return next
    })
  }

  // In collapsed mode: show just the icon, link to /groups
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to="/groups"
            onClick={onNavigate}
            className="flex items-center justify-center rounded-lg px-2 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <FolderOpen className="h-5 w-5 shrink-0" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{t('app.navigation.sidebar.groups', 'Groups')}</TooltipContent>
      </Tooltip>
    )
  }

  const Chevron = expanded ? ChevronDown : ChevronRight

  return (
    <div data-testid="sidebar-groups-section">
      {/* Groups header — click to toggle */}
      <button
        onClick={toggleExpanded}
        className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <FolderOpen className="h-5 w-5 shrink-0" />
        <span className="flex-1 text-left">{t('app.navigation.sidebar.groups', 'Groups')}</span>
        <Chevron className="h-4 w-4 shrink-0 text-gray-400" />
      </button>

      {/* Expanded group list */}
      {expanded ? (
        <div className="ml-4 mt-1 space-y-0.5 border-l border-gray-200 pl-3 dark:border-gray-700">
          {groups.map((group) => {
            const groupId = group.id
            return (
              <Link
                key={group.id}
                to={`/contacts?group=${groupId}`}
                onClick={onNavigate}
                className={cn(
                  'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
                )}
              >
                {group.color ? (
                  <span
                    className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                ) : null}
                <span className="min-w-0 truncate">{group.name}</span>
                <span className="ml-auto shrink-0 text-xs text-gray-400 dark:text-gray-500">
                  {group.contactsCount}
                </span>
              </Link>
            )
          })}
          <Link
            to="/groups"
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <Settings2 className="h-3.5 w-3.5 shrink-0" />
            <span>{t('app.navigation.sidebar.manageGroups', 'Manage Groups')}</span>
          </Link>
        </div>
      ) : null}
    </div>
  )
}
