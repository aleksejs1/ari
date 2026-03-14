import { useContext } from 'react'

import { UpgradeModalContext, type UpgradeModalContextValue } from './upgradeModalContext'

export function useUpgradeModal(): UpgradeModalContextValue {
  const ctx = useContext(UpgradeModalContext)
  if (!ctx) {
    throw new Error('useUpgradeModal must be used within UpgradeModalProvider')
  }
  return ctx
}
