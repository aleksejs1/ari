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
│   ├── contacts/    # Contact management (List, Details, Forms)
│   ├── dashboard/   # Dashboard widgets and layout
│   ├── groups/      # Contact groups management
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
- **Validation**: All forms use Zod schemas defined in `src/types/models.ts` or co-located with forms ensures type safety between API and UI.

## Development Commands

- `npm run dev`: Start development server
- `npm run quality`: Run full suite of quality checks (Lint, Format, Types, Tests)
- `npm run gen:types`: Regenerate API types from backend
