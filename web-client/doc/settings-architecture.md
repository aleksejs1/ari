# Settings Architecture

## Overview

The settings system in **Ari Web Client** follows a **Plugin-First Architecture**. It consists of three main layers:

1.  **Registry**: A global registry (`SettingsRegistry`) that manages available setting tabs.
2.  **Tabs**: Individual modules (`SettingTab` subclasses) that implement specific setting pages.
3.  **Builder API**: A **Fluent API (Builder Pattern)** used within tabs to declaratively define the UI (`Setting` class).

This approach is heavily inspired by the [Obsidian Plugin API](https://docs.obsidian.md/Plugins/User+interface/Settings#Settings).

## 1. Registry System

### `SettingsRegistry`
-   **Location**: `src/lib/settings/SettingsRegistry.ts`
-   **Role**: A singleton service that stores registered tabs.
-   **Reactivity**: Uses `useSyncExternalStore` (via `useSettingsTabs` hook) to push updates to the UI whenever a tab is registered or unregistered.

### `SettingTab`
-   **Location**: `src/lib/settings/SettingTab.ts`
-   **Role**: An abstract class defining the contract for a settings tab.
-   **Contract**:
    -   `id`: Unique identifier (e.g., `'general'`, `'regional'`).
    -   `name`: Display name or translation key (e.g., `'settings.tabs.general'`).
    -   `Component`: A React component to render the tab's content.

## 2. Builder System (The "Fluent API")

### `Setting` (Builder)
-   **Location**: `src/lib/settings/Setting.ts`
-   **Role**: Provides a chainable API to construct settings configurations.
-   **Usage**: `new Setting(container).setName(...).addControl(...)`

### `SettingItem` (Renderer)
-   **Location**: `src/lib/settings/components/SettingItem.tsx`
-   **Role**: A pure React component that takes a `SettingConfig` and renders the appropriate UI controls (shadcn/ui components).

## 3. Data Flow

1.  **Registration**: At application startup (`main.tsx` or plugin init), `SettingTab` instances are registered with `settingsRegistry`.
    ```typescript
    settingsRegistry.registerTab(new GeneralSettingsTab())
    ```
2.  **Navigation**: `SettingsPage.tsx` subscribes to the registry and renders the sidebar list of tabs.
3.  **Tab Rendering**: When a tab is selected, its `Component` (e.g., `GeneralSettings`) is rendered.
4.  **Content Definition**: Inside `GeneralSettings`, `useMemo` is used to create a `settings` array using the `Setting` builder.
5.  **Data Binding**: User interactions trigger `onChange` callbacks, which call updating functions from `useUserPrefs`.

## Standard Tabs

The core application provides three default tabs (located in `src/features/settings`):
-   **General**: Language, Favorites, Notifications.
-   **Regional**: Date & Time formats.
-   **Data**: Import & Export.
