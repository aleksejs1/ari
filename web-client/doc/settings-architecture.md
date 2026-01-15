# Settings Architecture

## Overview

The settings system in **Ari Web Client** has been refactored to follow a **Plugin-First Architecture**. Instead of hardcoding React components for each setting, we now use a **Fluent API (Builder Pattern)** to declaratively define the settings UI.

This approach is heavily inspired by the [Obsidian Plugin API](https://docs.obsidian.md/Plugins/User+interface/Settings#Settings).

## Core Principles

1.  **Declarative Configuration**: Settings are defined as data structures (configurations) via a Fluent API, not as direct React Code.
2.  **UI Agnostic**: The `Setting` class knows nothing about the DOM or React. It simply builds a configuration object (`SettingConfig`).
3.  **Extensibility**: This architecture allows future plugins or modules to inject settings without modifying the core React components.

## Components

### 1. `Setting` (Builder)

-   **Location**: `src/lib/settings/Setting.ts`
-   **Role**: Provides a chainable API to construct settings.
-   **Usage**: `new Setting(container).setName(...).addControl(...)`

### 2. `SettingItem` (Renderer)

-   **Location**: `src/lib/settings/components/SettingItem.tsx`
-   **Role**: A pure React component that takes a `SettingConfig` and renders the appropriate UI controls (shadcn/ui components).

### 3. `useUserPrefs` (State)

-   **Location**: `src/hooks/useUserPrefs.hook.tsx` (and implementation in `useUserPrefs.tsx`)
-   **Role**: Manages the persistent state of user preferences. The `Setting` definitions connect to this state via `setValue` and `onChange` callbacks.

## Data Flow

1.  **Definition**: The `SettingsPage` (`src/pages/Settings.tsx`) instantiates `Setting` objects.
2.  **Configuration**: Each `Setting` instance populates a shared `settings` array with configuration objects.
3.  **Rendering**: The `SettingsPage` iterates over this array and renders `SettingItem` components.
4.  **Interaction**: User interaction triggers `onChange` callbacks defined in the builder, which call setters from `useUserPrefs`.

## Future Improvements

-   **Dynamic Registry**: Move from a local array in `SettingsPage` to a global `SettingsRegistry` where features can register their own settings tab.
-   **Serialization**: If callbacks are removed or handled differently, settings implementations could be serialized to JSON, allowing backend-driven UI.
