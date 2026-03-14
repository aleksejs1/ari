import { type ReactNode, useState } from 'react'

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
import { UpgradeModalContext } from './upgradeModalContext'

interface UpgradeModalState {
  open: boolean
  feature: string | null
}

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
