import { useTranslation } from 'react-i18next'
import { Settings } from 'lucide-react'

import { SidebarNavItem } from '@/features/ui/sidebar/SidebarNavItem'

export function SettingsSidebarSection({
  onNavigate,
  collapsed,
}: {
  onNavigate?: () => void
  collapsed?: boolean
}) {
  const { t } = useTranslation()

  return (
    <SidebarNavItem
      to="/settings/general"
      icon={Settings}
      label={t('app.navigation.sidebar.settings', 'Settings')}
      onClick={onNavigate}
      collapsed={collapsed}
    />
  )
}
