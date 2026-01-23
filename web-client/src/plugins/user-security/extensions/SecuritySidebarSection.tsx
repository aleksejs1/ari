import { Lock, UserX } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { SidebarNavItem } from '@/features/ui/sidebar/SidebarNavItem'

export function SecuritySidebarSection({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation()

  return (
    <>
      <SidebarNavItem
        to="/change-password"
        icon={Lock}
        label={t('app.navigation.sidebar.changePassword', 'Change Password')}
        onClick={onNavigate}
      />
      <SidebarNavItem
        to="/delete-account"
        icon={UserX}
        label={t('app.navigation.sidebar.deleteAccount', 'Delete Account')}
        onClick={onNavigate}
        variant="danger"
      />
    </>
  )
}
