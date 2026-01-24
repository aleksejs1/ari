import { useEffect, useState } from 'react'

import { SidebarRegistry, type SidebarSectionDef } from '@/lib/ui/sidebar/SidebarRegistry'

import { registerDefaultSidebarSections } from '../ui/defaults_sidebar'
import { SidebarHeader } from '../ui/sidebar/SidebarHeader'

// Register sections immediately
registerDefaultSidebarSections()

interface SidebarContentProps {
  onNavigate?: () => void
}

export function SidebarContent({ onNavigate }: SidebarContentProps) {
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
      <SidebarHeader onNavigate={onNavigate} />
      <nav className="space-y-2 px-4">
        {sections.map((section) => {
          const Component = section.component
          return <Component key={section.id} onNavigate={onNavigate} />
        })}
      </nav>
    </div>
  )
}
