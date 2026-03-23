import { useTranslation } from 'react-i18next'
import { Lock, Network } from 'lucide-react'

import { FeatureGate, useUpgradeModal } from '@/lib/entitlements'

import { SidebarNavItem } from '@/features/ui/sidebar/SidebarNavItem'

export function ContactGraphSidebarItem({
  onNavigate,
  collapsed,
}: {
  onNavigate?: () => void
  collapsed?: boolean
}) {
  const { t } = useTranslation()
  const { openUpgradeModal } = useUpgradeModal()
  const label = t('contactGraph.title', 'Contact Graph')
  return (
    <FeatureGate
      feature="contact_graph"
      promo={
        <button
          type="button"
          onClick={() => openUpgradeModal('contact_graph')}
          className={
            collapsed
              ? 'flex w-full justify-center rounded-lg px-2 py-2 text-gray-400 transition-colors hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-700'
              : 'flex w-full items-center gap-2 rounded-lg px-4 py-2 text-gray-400 transition-colors hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-700'
          }
          title={t('contactGraph.lockedHint', 'Available on higher-tier plans')}
        >
          <Network className="h-5 w-5 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{label}</span>
              <Lock className="h-3.5 w-3.5 shrink-0" />
            </>
          )}
        </button>
      }
    >
      <SidebarNavItem
        to="/contact-graph"
        icon={Network}
        label={label}
        onClick={onNavigate}
        collapsed={collapsed}
      />
    </FeatureGate>
  )
}
