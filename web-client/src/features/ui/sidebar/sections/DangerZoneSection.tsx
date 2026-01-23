import { UserX } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { SidebarNavItem } from '../SidebarNavItem'

export function DangerZoneSection({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation()

  return (
    <SidebarNavItem
      to="/delete-account"
      icon={UserX}
      label={t('app.navigation.sidebar.deleteAccount', 'Delete Account')}
      onClick={onNavigate}
      variant="danger"
    />
  )
}
