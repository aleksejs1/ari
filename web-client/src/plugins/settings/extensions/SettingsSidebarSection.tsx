import { useTranslation } from 'react-i18next'
import { Settings } from 'lucide-react'

import { SidebarNavItem } from '@/features/ui/sidebar/SidebarNavItem'

export function SettingsSidebarSection({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation()

  return (
    <SidebarNavItem
      to="/settings"
      icon={Settings}
      label={t('app.navigation.sidebar.settings', 'Settings')}
      onClick={onNavigate}
    />
  )
}
