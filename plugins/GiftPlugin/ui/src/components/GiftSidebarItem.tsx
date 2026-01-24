import { useTranslation } from 'react-i18next'
import { Gift } from 'lucide-react'

import { SidebarNavItem } from './SidebarNavItem'

export function GiftSidebarItem({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation('gift-plugin')

  return (
    <SidebarNavItem
      to="/gift-lists"
      icon={Gift}
      label={t('sidebar', 'Gifts')} // Fallback 'Gifts' if translation missing
      onClick={onNavigate}
    />
  )
}
