# Settings Architecture

## Overview

The settings system in **Ari Web Client** uses a **dedicated layout with a secondary sidebar** for navigation. All settings and administrative pages are organized under `/settings/*` URLs with their own nested routing.

## Layout

### `SettingsLayout`
-   **Location**: `src/plugins/settings/components/SettingsLayout.tsx`
-   **Role**: Provides a secondary sidebar with grouped navigation for all settings pages.
-   **Structure**: Uses `<Outlet />` for nested route rendering.
-   **Mobile**: On small screens, the secondary sidebar is hidden and accessible via a `Sheet` component.

### Navigation Groups

Settings pages are organized into four groups:

| Group | Pages |
|:------|:------|
| **Preferences** | General, Regional, Data, Plugins |
| **Notifications** | Notification Channels, Notification Policies |
| **Activity** | Sessions, Login History, Google Import, Audit Logs |
| **Account** | Change Password, Delete Account |

### Route Registration

Settings pages are registered using the `'settings'` route slot in `RouteRegistry`. Paths are relative to `/settings/`:

```tsx
routeRegistry.register('settings', {
  path: 'my-settings-page',  // renders at /settings/my-settings-page
  element: <MySettingsPage />,
})
```

The `SettingsLayout` navigation items are defined in `SettingsLayout.tsx` via the `settingsNavGroups` array.

## Settings Builder System

### `SettingsRegistry`
-   **Location**: `src/lib/settings/SettingsRegistry.ts`
-   **Role**: A singleton service that stores registered setting tabs.
-   **Reactivity**: Uses `useSyncExternalStore` (via `useSettingsTabs` hook) to push updates to the UI whenever a tab is registered or unregistered.

### `SettingTab`
-   **Location**: `src/lib/settings/SettingTab.ts`
-   **Role**: An abstract class defining the contract for a settings tab.
-   **Contract**:
    -   `id`: Unique identifier (e.g., `'general'`, `'regional'`).
    -   `name`: Display name or translation key (e.g., `'settings.tabs.general'`).
    -   `Component`: A React component to render the tab's content.

### Builder API (The "Fluent API")

#### `Setting` (Builder)
-   **Location**: `src/lib/settings/Setting.ts`
-   **Role**: Provides a chainable API to construct settings configurations.
-   **Usage**: `new Setting(container).setName(...).addControl(...)`

#### `SettingItem` (Renderer)
-   **Location**: `src/lib/settings/components/SettingItem.tsx`
-   **Role**: A pure React component that takes a `SettingConfig` and renders the appropriate UI controls (shadcn/ui components).

## Data Flow

1.  **Route Registration**: At plugin init, settings routes are registered in the `'settings'` slot.
2.  **Navigation**: `SettingsLayout` renders the secondary sidebar with grouped links.
3.  **Page Rendering**: When a settings page URL is visited, its component is rendered inside the `SettingsLayout` outlet.
4.  **Content Definition**: Settings pages use the `Setting` builder to define their UI.
5.  **Data Binding**: User interactions trigger `onChange` callbacks, which call updating functions from `useUserPrefs`.

## Standard Settings Pages

The core application provides these default settings pages (located in `src/features/settings`):
-   **General** (`/settings/general`): Language, Favorites, Notifications.
-   **Regional** (`/settings/regional`): Date & Time formats.
-   **Data** (`/settings/data`): Import & Export.

---

# Cookbook: Creating Settings

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
