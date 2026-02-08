import type React from 'react'
import { createContext, useContext, useState } from 'react'

interface ReloadContextType {
  reloadNeeded: boolean
  setReloadNeeded: (needed: boolean) => void
}

const ReloadContext = createContext<ReloadContextType | undefined>(undefined)

export function ReloadProvider({ children }: { children: React.ReactNode }) {
  const [reloadNeeded, setReloadNeeded] = useState(false)

  return (
    <ReloadContext.Provider value={{ reloadNeeded, setReloadNeeded }}>
      {children}
    </ReloadContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useReload() {
  const context = useContext(ReloadContext)
  if (context === undefined) {
    throw new Error('useReload must be used within a ReloadProvider')
  }
  return context
}
