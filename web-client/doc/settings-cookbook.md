# Settings Cookbook

This guide provides step-by-step recipes for adding new settings to the Ari Web Client.

## Prerequisites

Before adding a setting to the UI, ensure the state is managed in `src/hooks/useUserPrefs.tsx`.

1.  Add the property to the `UserPrefType` union type.
2.  Add a getter in `useUserPrefsLogic` (using `getPrefValue`).
3.  Add a setter function in `UserPrefsProvider`.
4.  Expose both in the context.

## Base Template

All settings follow this pattern in `src/pages/Settings.tsx`:

```typescript
new Setting(settings)
  .setName(t('settings.yourSettingName'))
  .setDesc(t('settings.yourDescription'))
  // .addControl(...)
```

## Recipes

### 1. Simple Text Input

Useful for names, API keys, or custom strings.

```typescript
new Setting(settings)
  .setName(t('settings.apiKey'))
  .setDesc(t('settings.apiKeyDesc'))
  .addText((text) =>
    text
      .setPlaceholder('Enter key...')
      .setValue(apiKey)
      .onChange((val) => setApiKey(val)),
  )
```

### 2. Radio Group (Toggle/Choice)

Useful for mutually exclusive options (e.g., On/Off, Layout Mode).

```typescript
new Setting(settings)
  .setName(t('settings.theme'))
  .setDesc(t('settings.themeDesc'))
  .addRadio((radio) =>
    radio
      .addOption('light', t('theme.light'))
      .addOption('dark', t('theme.dark'))
      .setValue(theme)
      .onChange((val) => setTheme(val)),
  )
```

### 3. Dropdown (Select)

Useful when there are many options.

```typescript
new Setting(settings)
  .setName(t('settings.notificationPolicy'))
  .setDesc(t('settings.choosePolicy'))
  .addDropdown((dropdown) => {
     // You can use logic inside the callback
    dropdown
      .addOption('', t('common.none'))
      .setValue(policyId)
      .onChange((val) => setPolicyId(val))

    // Dynamic options
    policies.forEach(p => {
        dropdown.addOption(p.id, p.name)
    })
  })
```

### 4. Action Button

Useful for triggering actions like Import/Export, Reset, or API calls.

```typescript
const handleSync = async () => {
    await api.sync();
}

new Setting(settings)
  .setName(t('settings.sync'))
  .setDesc(t('settings.syncDesc'))
  .addButton((btn) =>
    btn
      .setButtonText(t('settings.syncNow'))
      .setVariant('default') // 'default' | 'secondary' | 'destructive' | 'outline'
      .setDisabled(isSyncing)
      .onClick(handleSync),
  )
```

### 5. Multiple Controls in One Setting

You can chain multiple controls to appear in the same setting block.

```typescript
new Setting(settings)
  .setName('Complex Setting')
  .setDesc('This setting has two inputs')
  .addText(t => t.setPlaceholder('Host'))
  .addText(t => t.setPlaceholder('Port'))
```
