import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { SidebarRegistry, type SidebarSectionDef } from '@/lib/ui/sidebar/SidebarRegistry'

import { registerDefaultSidebarSections } from '../ui/defaults_sidebar'
import { SidebarHeader } from '../ui/sidebar/SidebarHeader'

// Register sections immediately
registerDefaultSidebarSections()

interface SidebarContentProps {
  onNavigate?: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function SidebarContent({
  onNavigate,
  collapsed = false,
  onToggleCollapse,
}: SidebarContentProps) {
  const { t } = useTranslation()
  const [sections, setSections] = useState<SidebarSectionDef[]>(() =>
    SidebarRegistry.getInstance().getAll(),
  )

  useEffect(() => {
    const registry = SidebarRegistry.getInstance()

    return registry.subscribe(() => {
      setSections([...registry.getAll()])
    })
  }, [])

  return (
    <div className="flex h-full flex-col">
      <SidebarHeader onNavigate={onNavigate} collapsed={collapsed} />
      <nav className="flex-1 space-y-1 px-2">
        {sections.map((section) => {
          const Component = section.component
          return <Component key={section.id} onNavigate={onNavigate} collapsed={collapsed} />
        })}
      </nav>
      {onToggleCollapse ? (
        <div className="border-t p-2">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onToggleCollapse}
                  className="flex w-full items-center justify-center rounded-lg px-2 py-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <ChevronsRight className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{t('sidebar.expand', 'Expand sidebar')}</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={onToggleCollapse}
              className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <ChevronsLeft className="h-5 w-5" />
              <span className="text-sm">{t('sidebar.collapse', 'Collapse')}</span>
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}
