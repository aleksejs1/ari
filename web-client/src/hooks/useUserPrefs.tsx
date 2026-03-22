import type { ReactNode } from 'react'

import { FeaturePrefsProvider } from '@/contexts/FeaturePrefsContext'
import { RegionalPrefsProvider } from '@/contexts/RegionalPrefsContext'
import { UIPrefsProvider } from '@/contexts/UIPrefsContext'

export function UserPrefsProvider({ children }: { children: ReactNode }) {
  return (
    <RegionalPrefsProvider>
      <UIPrefsProvider>
        <FeaturePrefsProvider>{children}</FeaturePrefsProvider>
      </UIPrefsProvider>
    </RegionalPrefsProvider>
  )
}
