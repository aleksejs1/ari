import { ContactNameInlineEdit } from './ContactNameInlineEdit'

import { type Contact, type ContactName } from '@/types/models'

interface ContactsTableNamesProps {
  contact: Contact
  names: ContactName[]
  onUpdateName: (contact: Contact, name: ContactName) => void
  onDeleteName: (contact: Contact, name: ContactName) => void
}

export function ContactsTableNames({
  contact,
  names,
  onUpdateName,
  onDeleteName,
}: ContactsTableNamesProps) {
  // If no names, show one empty generic item to allow adding
  const displayNames = names.length > 0 ? names : ([{ given: '', family: '' }] as ContactName[])

  return (
    <div className="flex flex-col gap-1">
      {displayNames.map((name, i) => (
        <ContactNameInlineEdit
          key={i}
          name={name}
          onUpdate={(updatedName) => onUpdateName(contact, updatedName)}
          onDelete={() => onDeleteName(contact, name)}
        />
      ))}
    </div>
  )
}
