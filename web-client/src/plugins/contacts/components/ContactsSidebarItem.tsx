import { useTranslation } from 'react-i18next'
import { Users } from 'lucide-react'

import { SidebarNavItem } from '@/features/ui/sidebar/SidebarNavItem'

export function ContactsSidebarItem({
  onNavigate,
  collapsed,
}: {
  onNavigate?: () => void
  collapsed?: boolean
}) {
  const { t } = useTranslation('contacts')
  return (
    <SidebarNavItem
      to="/contacts"
      icon={Users}
      label={t('title', 'Contacts')}
      onClick={onNavigate}
      collapsed={collapsed}
    />
  )
}
