# Project Architecture

This document provides a high-level overview of the `web-client` project architecture to assist with navigation and development.

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router 7
- **State Management & Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS with `shadcn/ui` (Radix UI) components
- **Forms**: React Hook Form using Zod for validation
- **HTTP Client**: Axios
- **Internationalization**: i18next (en, ru)
- **Testing**: Vitest, React Testing Library
- **Code Quality**: ESLint, Prettier, Stylelint, Dependency Cruiser, Knip

## Directory Structure

The project follows a **Feature-Based Architecture** (inspired by Feature-Sliced Design), where code is organized by business domain rather than technical layer.

```
src/
├── assets/          # Static assets (images, fonts)
├── components/      # Shared UI components (mostly shadcn/ui primitives)
│   └── ui/          # Atomic UI elements (Button, Input, Card, etc.)
├── contexts/        # Global React Contexts (e.g., AuthContext)
├── features/        # Business features (The core of the application)
│   ├── auth/        # Login, Register pages and logic
│   ├── activity-feed/ # User notifications and activity history
│   ├── contacts/    # Contact management (List, Details, Forms, Relations)
│   ├── dashboard/   # Dashboard widgets and layout
│   ├── groups/      # Contact groups management (Alphabetical sort, color support)
│   ├── notification-policies/ # Notification policies management (Create, Edit, List)
│   ├── ...          # Other feature modules
│   └── [feature]/
│       ├── components/  # Feature-specific components
│       └── [hook].ts    # Feature-specific data hooks (e.g. useContacts.ts)
├── hooks/           # Shared global hooks (e.g. useAuth)
├── i18n/            # Localization configuration and JSON translation files
├── lib/             # Utility libraries and configurations (axios, utils)
├── pages/           # Route components (Page wrappers around features)
├── test/            # Global test setup and utilities
└── types/           # Global TypeScript definitions
    └── schema.d.ts  # Auto-generated API types from OpenAPI
```

## Key Patterns

- **API Client**: We use a `schema.d.ts` file generated from the backend OpenAPI/Swagger definition (`npm run gen:types`).
- **Data Fetching**: Data access logic is encapsulated in custom hooks within each feature (e.g., `features/contacts/useContacts.ts`). We use TanStack Query for caching and state management.
- **Authentication**: JWT-based authentication handled via `AuthContext` and Axios interceptors in `src/lib/axios.ts`.
- **User Preferences**: Global preferences (language, date format, google sync) are managed via `useUserPrefs` hook and persisted to backend.
- **Notification Channels**: Support for multiple types (Telegram, Web). Telegram required config (token, ID), Web is config-less.
- **Validation**: All forms use Zod schemas defined in `src/types/models.ts` or co-located with forms ensures type safety between API and UI.
- **Favorites**: Contact favorites are managed via a special group (default `favourites`, configurable in User Settings).
- **Data Export**: Users can export all their data in XML format from the Settings page. This is handled via the `useExportContacts` hook which triggers a file download.
- **Data Import**: Users can import contacts from an XML file via the Settings page. This is handled by the `useImportContacts` hook which sends the file to the backend.
- **Global Search**: A unified search bar in the header allows searching for Contacts (API), Groups (local), and Navigation/Settings (static), organized in tabs (Contacts, Groups, Settings). Implemented in `src/features/search/components/GlobalSearch.tsx`. Displays top 5 results with a "Show all results" option for contacts.
- **User Menu**: Quick access to system utilities (Audit Logs, Settings) and user profile actions via the top-right header menu.
- **Logo Navigation**: Clicking the application logo in the sidebar redirects to the Dashboard/Home page.
- **Form Layout**: Large forms (like Contact Edit) use a `CollapsibleSection` pattern to group fields and reduce visual noise. Sections like Addresses, Biography, Organizations, and Relations are collapsed by default.
- **Layouts**: The application uses two main layouts: `DashboardLayout` (with sidebar) for most pages and `SidebarLessLayout` (no sidebar, simplified) for the Home and Contacts pages.
- **Sidebar**: In `DashboardLayout`, the sidebar provides navigation to secondary features (Audit Logs, Groups, Settings etc). It does not contain Home or Contacts links, nor user/session controls (which are in the header).
- **Header Navigation**: In `SidebarLessLayout`, primary navigation (like Contacts) is exposed directly in the header row next to the logo.
- **Type Autocomplete**: Form fields for "type" (phone type, email type, etc.) use a `TypeAutocomplete` component that provides suggestions from the `/api/autocomplete` endpoint via the `useAutocomplete` hook. Users can also enter custom values, which are cached locally for future use within the session.

## Development Commands

- `npm run dev`: Start development server
- `npm run quality`: Run full suite of quality checks (Lint, Format, Types, Tests)
- `npm run gen:types`: Regenerate API types from backend
