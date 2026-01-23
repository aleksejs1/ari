import { registerDefaultSidebarSections } from '../ui/defaults_sidebar'
import { SidebarHeader } from '../ui/sidebar/SidebarHeader'

import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'

// Register sections immediately
registerDefaultSidebarSections()

interface SidebarContentProps {
  onNavigate?: () => void
}

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  const registry = SidebarRegistry.getInstance()
  const sections = registry.getAll()

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
