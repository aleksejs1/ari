# Settings Cookbook

This guide provides step-by-step recipes for adding new settings to the Ari Web Client.

## 1. Creating a New Settings Tab

To add a new section to the Settings page, you need to create a `SettingTab`.

### Step A: Create the Component
Create a component that uses the `Setting` builder to define your UI.

```typescript
// src/features/my-feature/MySettings.component.tsx
import { useMemo } from 'react'
import { Setting } from '@/lib/settings/Setting'
import { SettingItem } from '@/lib/settings/components/SettingItem'

export function MySettings() {
  const settings = useMemo(() => {
    const container = []
    
    new Setting(container)
      .setName('My Setting')
      .addText(text => text.setPlaceholder('Value...'))
      
    return container
  }, [])

  return (
    <div className="space-y-6">
       <div className="grid gap-6">
        {settings.map((s, i) => <SettingItem key={i} setting={s} />)}
      </div>
    </div>
  )
}
```

### Step B: Create the Tab Class
Extend the `SettingTab` abstract class.

```typescript
// src/features/my-feature/MySettingsTab.ts
import { SettingTab } from '@/lib/settings/SettingTab'
import { MySettings } from './MySettings.component'

export class MySettingsTab extends SettingTab {
  constructor() {
    super('my-feature', 'My Feature') // ID, Display Name (or translation key)
  }

  get Component() {
    return MySettings
  }
}
```

### Step C: Register the Tab
Register your tab in `src/main.tsx` (or your plugin entry point).

```typescript
import { settingsRegistry } from '@/lib/settings/SettingsRegistry'
import { MySettingsTab } from './features/my-feature/MySettingsTab'

settingsRegistry.registerTab(new MySettingsTab())
```

## 2. Adding Settings to an Existing Tab

If you want to add settings to an existing component (like `GeneralSettings`), follow usage of the **Setting Builder**.

### Base Pattern

```typescript
new Setting(settings)
  .setName(t('settings.yourSettingName'))
  .setDesc(t('settings.yourDescription'))
  // .addControl(...)
```

### Control Recipes

#### Simple Text Input

```typescript
new Setting(settings)
  .setName('API Key')
  .addText((text) =>
    text
      .setValue(apiKey)
      .onChange((val) => setApiKey(val)),
  )
```

#### Radio Group (Toggle/Choice)

```typescript
new Setting(settings)
  .setName('Theme')
  .addRadio((radio) =>
    radio
      .addOption('light', 'Light')
      .addOption('dark', 'Dark')
      .setValue(theme)
      .onChange((val) => setTheme(val)),
  )
```

#### Dropdown (Select)

```typescript
new Setting(settings)
  .setName('Policy')
  .addDropdown((dropdown) => {
    dropdown
      .addOption('a', 'Policy A')
      .addOption('b', 'Policy B')
      .setValue(currentPolicy)
      .onChange(val => setPolicy(val))
  })
```

#### Action Button

```typescript
new Setting(settings)
  .setName('Sync')
  .addButton((btn) =>
    btn
      .setButtonText('Sync Now')
      .setDisabled(isSyncing)
      .onClick(handleSync),
  )
```
