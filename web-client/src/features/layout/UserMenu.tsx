import { CircleUser } from 'lucide-react'
import React from 'react'

import { registerDefaultUserMenuSections } from '../ui/defaults_usermenu'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserMenuRegistry } from '@/lib/ui/usermenu/UserMenuRegistry'

// Register sections immediately
registerDefaultUserMenuSections()

export function UserMenu() {
  const registry = UserMenuRegistry.getInstance()
  const sections = registry.getAll()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 md:w-56" align="end" forceMount>
        {sections.map((section, index) => {
          const Component = section.component
          return (
            <React.Fragment key={section.id}>
              <Component />
              {index < sections.length - 1 && <DropdownMenuSeparator />}
            </React.Fragment>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
