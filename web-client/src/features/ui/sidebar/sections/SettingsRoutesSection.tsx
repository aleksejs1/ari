import { Lock, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { SidebarNavItem } from '../SidebarNavItem'

export function SettingsRoutesSection({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation()

  return (
    <>
      <SidebarNavItem
        to="/settings"
        icon={Settings}
        label={t('app.navigation.sidebar.settings', 'Settings')}
        onClick={onNavigate}
      />
      <SidebarNavItem
        to="/change-password"
        icon={Lock}
        label={t('app.navigation.sidebar.changePassword', 'Change Password')}
        onClick={onNavigate}
      />
    </>
  )
}
