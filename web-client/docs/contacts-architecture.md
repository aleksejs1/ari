# Contacts Architecture

## Overview
We have migrated the Contacts module to a **Plugin-first architecture** to improve maintainability, configurability, and reusability. The core concept is to decouple the `ContactsTable` from the business logic of contact updates and make the columns dynamically registrable.

## Key Concepts

### Smart Cells
Instead of passing mutation handlers (`onUpdateName`, `onUpdatePhone`, etc.) down from the page to the table and then to cells (Prop Drilling), each cell is now a **Smart Component**.
A Smart Cell is responsible for:
1. Rendering the data for a specific field.
2. Handling user interactions (edit, delete).
3. Directly calling the appropriate API mutation hooks (e.g., `useUpdateContactName`).

All Smart Cells are located in: `src/features/contacts/cells/`.

### Column Registry
We introduced a `ContactColumnRegistry` singleton to manage available columns.
- **Path:** `src/lib/contacts/ContactColumnRegistry.ts`
- **Purpose:** Central repository for all table columns.
- **Capabilities:**
    - Register new columns dynamically.
    - Retrieve all available columns.
    - Get a snapshot of columns for UI tools (like Column Visibility picker).

### Data Flow
**Before:**
`ContactsPage` (Holds Logic) -> `ContactsTable` -> `Cell` -> `InlineEdit`

**After:**
`ContactsPage` (Fetches Data & Columns) -> `ContactsTable` -> `Cell` (Holds Logic)

## Benefits
1.  **Decoupling:** `ContactsTable` is now a dumb component that just renders whatever columns it is given.
2.  **Configurability:** Users can toggle column visibility easily.
3.  **Portability:** The registry allows us to render a contacts table (or a subset of it) anywhere in the application by just requesting the columns we need.
