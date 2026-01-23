import { Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { DropdownMenuGroup, DropdownMenuItem } from '@/components/ui/dropdown-menu'

export function CoreNavigationSection() {
  const { t } = useTranslation()

  return (
    <DropdownMenuGroup>
      <DropdownMenuItem asChild>
        <Link to="/settings" className="cursor-pointer p-4 md:px-2 md:py-1.5">
          <Settings className="mr-3 h-5 w-5 md:mr-2 md:h-4 md:w-4" />
          <span className="text-base md:text-sm">{t('settings.title', 'Settings')}</span>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  )
}
