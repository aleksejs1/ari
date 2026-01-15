import { describe, expect, it, vi } from 'vitest'

import { settingsRegistry } from './SettingsRegistry'
import { SettingTab } from './SettingTab'

// Mock Component
const MockComponent = () => <div>Mock </div>

class TestTab extends SettingTab {
  get Component() {
    return MockComponent
  }
}

describe('SettingsRegistry', () => {
  it('should register a tab', () => {
    const tab = new TestTab('test', 'Test Tab')
    settingsRegistry.registerTab(tab)

    expect(settingsRegistry.getTabs()).toContain(tab)
  })

  it('should not register duplicate tabs', () => {
    const tab1 = new TestTab('dup', 'Duplicate')
    const tab2 = new TestTab('dup', 'Duplicate 2')

    settingsRegistry.registerTab(tab1)
    settingsRegistry.registerTab(tab2)

    expect(settingsRegistry.getTabs().filter((t) => t.id === 'dup')).toHaveLength(1)
  })

  it('should unregister a tab', () => {
    const tab = new TestTab('tounreg', 'To Unregister')
    settingsRegistry.registerTab(tab)
    settingsRegistry.unregisterTab('tounreg')

    expect(settingsRegistry.getTabs()).not.toContain(tab)
  })

  it('should notify subscribers', () => {
    const listener = vi.fn()
    const unsubscribe = settingsRegistry.subscribe(listener)

    const tab = new TestTab('sub', 'Subscriber Test')
    settingsRegistry.registerTab(tab)

    expect(listener).toHaveBeenCalled()
    unsubscribe()
  })
})
