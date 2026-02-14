import { useTranslation } from 'react-i18next'
import { Home } from 'lucide-react'

import { SidebarNavItem } from '@/features/ui/sidebar/SidebarNavItem'

export function DashboardSidebarSection({
  onNavigate,
  collapsed,
}: {
  onNavigate?: () => void
  collapsed?: boolean
}) {
  const { t } = useTranslation()

  return (
    <SidebarNavItem
      to="/"
      icon={Home}
      label={t('app.navigation.home', 'Home')}
      onClick={onNavigate}
      collapsed={collapsed}
    />
  )
}
