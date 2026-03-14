import { createContext } from 'react'

export interface UpgradeModalContextValue {
  openUpgradeModal: (feature: string) => void
}

export const UpgradeModalContext = createContext<UpgradeModalContextValue | null>(null)
