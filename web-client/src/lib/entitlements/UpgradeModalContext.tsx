import { createContext, type ReactNode, useContext, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { getFeatureContent } from './featureContent'

interface UpgradeModalState {
  open: boolean
  feature: string | null
}

interface UpgradeModalContextValue {
  openUpgradeModal: (feature: string) => void
}

const UpgradeModalContext = createContext<UpgradeModalContextValue | null>(null)

export function UpgradeModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UpgradeModalState>({ open: false, feature: null })

  const openUpgradeModal = (feature: string) => {
    setState({ open: true, feature })
  }

  const close = () => setState({ open: false, feature: null })

  const content = state.feature ? getFeatureContent(state.feature) : null

  return (
    <UpgradeModalContext.Provider value={{ openUpgradeModal }}>
      {children}
      <Dialog open={state.open} onOpenChange={(open) => !open && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{content?.title ?? 'Upgrade Required'}</DialogTitle>
            <DialogDescription>{content?.description}</DialogDescription>
          </DialogHeader>
          {content?.upgradeHint ? <p className="text-sm">{content.upgradeHint}</p> : null}
          <DialogFooter>
            <Button variant="outline" onClick={close}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UpgradeModalContext.Provider>
  )
}

export function useUpgradeModal(): UpgradeModalContextValue {
  const ctx = useContext(UpgradeModalContext)
  if (!ctx) {
    throw new Error('useUpgradeModal must be used within UpgradeModalProvider')
  }
  return ctx
}
