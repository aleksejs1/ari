# Contacts Cookbook

This guide explains how to add a new column to the contacts table using the new Smart Cell architecture.

## How to add a new column from scratch

### 1. Create a Smart Cell
Create a new component in `src/features/contacts/cells/`.
Example: `ContactCustomFieldCell.tsx`

```tsx
import { useUpdateContact } from '@/features/contacts/useContacts'
import { type Contact } from '@/types/models'

interface ContactCustomFieldCellProps {
  contact: Contact
}

export function ContactCustomFieldCell({ contact }: ContactCustomFieldCellProps) {
  const mutation = useUpdateContact()
  
  const handleUpdate = (newValue: string) => {
      // Logic to update contact
  }

  return (
    <div>
      {/* Your display/edit logic here */}
      {contact.someField}
    </div>
  )
}
```

### 2. Register the Column
Register your new cell in `src/lib/contacts/defaults.ts` (or wherever you initialize your app columns).

```typescript
import { contactColumnRegistry } from '@/lib/contacts/ContactColumnRegistry'
import { ContactCustomFieldCell } from '@/features/contacts/cells/ContactCustomFieldCell'

contactColumnRegistry.register({
  id: 'customField',
  label: 'Custom Field', // Visible in the table settings
  definition: () => ({
    accessorKey: 'someField', // Or 'id' if you don't map to a specific key
    header: 'Custom Field Header',
    cell: ({ row }) => <ContactCustomFieldCell contact={row.original} />,
  }),
})
```

That's it! The column will now appear in the table and be togglable via the settings menu.
