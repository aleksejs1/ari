import { Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { SidebarNavItem } from '@/features/ui/sidebar/SidebarNavItem'

export function DashboardSidebarSection({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation()

  return (
    <SidebarNavItem
      to="/"
      icon={Home}
      label={t('app.navigation.home', 'Home')}
      onClick={onNavigate}
    />
  )
}
