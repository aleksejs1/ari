import { LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'

export function LogoutSection() {
  const { t } = useTranslation()
  const { logout } = useAuth()

  return (
    <DropdownMenuItem onClick={logout} className="cursor-pointer p-4 md:px-2 md:py-1.5">
      <LogOut className="mr-3 h-5 w-5 md:mr-2 md:h-4 md:w-4" />
      <span className="text-base md:text-sm">{t('auth.logout', 'Logout')}</span>
    </DropdownMenuItem>
  )
}
