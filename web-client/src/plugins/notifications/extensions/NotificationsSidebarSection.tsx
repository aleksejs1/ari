import { Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { SidebarNavItem } from '@/features/ui/sidebar/SidebarNavItem'

export function NotificationsSidebarSection({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation()

  return (
    <>
      <SidebarNavItem
        to="/notification-channels"
        icon={Bell}
        label={t('app.navigation.sidebar.notificationChannels', 'Notification Channels')}
        onClick={onNavigate}
      />
      <SidebarNavItem
        to="/settings/notification-policies"
        icon={Bell}
        label={t('app.navigation.sidebar.notificationPolicies', 'Notification Policies')}
        onClick={onNavigate}
      />
    </>
  )
}
