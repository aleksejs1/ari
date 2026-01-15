import { useSyncExternalStore } from 'react'

import type { SettingTab } from './SettingTab'

type Listener = () => void

class SettingsRegistry {
  private tabs = new Map<string, SettingTab>()
  private listeners = new Set<Listener>()
  private cachedTabs: SettingTab[] = []

  registerTab(tab: SettingTab) {
    if (this.tabs.has(tab.id)) {
      console.warn(`Settings Tab with id "${tab.id}" is already registered.`)
      return
    }
    this.tabs.set(tab.id, tab)
    this.updateCache()
    this.notify()
  }

  unregisterTab(id: string) {
    if (this.tabs.delete(id)) {
      this.updateCache()
      this.notify()
    }
  }

  getTabs(): SettingTab[] {
    return this.cachedTabs
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private updateCache() {
    this.cachedTabs = Array.from(this.tabs.values())
  }

  private notify() {
    this.listeners.forEach((listener) => listener())
  }
}

export const settingsRegistry = new SettingsRegistry()

// React Hook
export function useSettingsTabs() {
  return useSyncExternalStore(
    (callback) => settingsRegistry.subscribe(callback),
    () => settingsRegistry.getTabs(),
  )
}
