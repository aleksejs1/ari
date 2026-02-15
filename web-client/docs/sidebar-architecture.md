# Sidebar Architecture

The Sidebar uses a **Registry-based Plugin Architecture** with support for a **collapsible mode**. This allows adding new navigation sections without modifying the core `SidebarContent` component.

## Core Concepts

### 1. Registry (`SidebarRegistry`)
A singleton that manages a list of navigation sections to be rendered in the sidebar.

**Path:** `src/lib/ui/sidebar/SidebarRegistry.ts`

### 2. Sections
A "Section" is a React component that renders a group of navigation links using the `SidebarNavItem` component.
-   Sections are independent and should use `useTranslation`.
-   They receive `onNavigate` and `collapsed` props.
-   `onNavigate` closes the mobile sidebar when a link is clicked.
-   `collapsed` indicates whether the sidebar is in collapsed (icon-only) mode.

### 3. Navigation Item (`SidebarNavItem`)
A shared component that ensures all sidebar links have consistent styling and behavior.
-   Accepts a `collapsed` prop — when `true`, renders only the icon with a `Tooltip`.

**Path:** `src/features/ui/sidebar/SidebarNavItem.tsx`

### 4. Collapsible Sidebar
The sidebar supports two modes:
-   **Expanded** (~256px): Shows icons and labels.
-   **Collapsed** (~64px): Shows only icons with tooltips on hover.

The collapse state is managed by `useSidebarCollapsed` hook and persisted in `localStorage`. A toggle button at the bottom of the sidebar switches between modes.

**Path:** `src/hooks/useSidebarCollapsed.ts`

### 5. Bootstrapping
Sidebar sections are registered by individual plugins during their `register()` phase. The `defaults_sidebar.ts` file handles initial setup.

**Path:** `src/features/ui/defaults_sidebar.ts`

## Default Sidebar Sections (by order)

| Order | Section | Plugin |
|:------|:--------|:-------|
| 0 | Home | `dashboard` |
| 10 | Contacts | `contacts` |
| 20 | Groups (collapsible) | `groups` |
| 30 | Contact Graph | `contact-graph` |
| 50+ | Plugin items | Various |
| 100 | Settings | `settings` |

## How to Add a New Navigation Section

To add a new section (e.g., "Reports"):

1.  **Create the Component:**
    ```tsx
    // src/plugins/reports/extensions/ReportsSidebarSection.tsx
    import { BarChart } from 'lucide-react'
    import { SidebarNavItem } from '@/features/ui/sidebar/SidebarNavItem'

    export function ReportsSidebarSection({
      onNavigate,
      collapsed,
    }: {
      onNavigate?: () => void
      collapsed?: boolean
    }) {
      return (
        <SidebarNavItem
          to="/reports"
          icon={BarChart}
          label="Reports"
          onClick={onNavigate}
          collapsed={collapsed}
        />
      )
    }
    ```

2.  **Register the Section:**
    ```ts
    import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'
    import { ReportsSidebarSection } from './ReportsSidebarSection'

    SidebarRegistry.getInstance().register({
      id: 'reports',
      component: ReportsSidebarSection,
      order: 15 // Order relative to other sections
    })
    ```
