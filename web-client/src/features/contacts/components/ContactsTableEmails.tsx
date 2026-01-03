import { ContactEmailInlineEdit } from './ContactEmailInlineEdit'

import { type Contact, type ContactEmailAdress } from '@/types/models'

interface ContactsTableEmailsProps {
  contact: Contact
  emails: ContactEmailAdress[]
  onUpdateEmail: (contact: Contact, email: ContactEmailAdress) => void
  onDeleteEmail: (contact: Contact, email: ContactEmailAdress) => void
}

export function ContactsTableEmails({
  contact,
  emails,
  onUpdateEmail,
  onDeleteEmail,
}: ContactsTableEmailsProps) {
  // If no emails, show one empty generic item to allow adding
  const displayEmails =
    emails.length > 0 ? emails : ([{ value: '', type: '' }] as ContactEmailAdress[])

  return (
    <div className="flex flex-col gap-1">
      {displayEmails.map((email, i) => (
        <ContactEmailInlineEdit
          key={i}
          email={email}
          onUpdate={(updatedEmail) => onUpdateEmail(contact, updatedEmail)}
          onDelete={() => onDeleteEmail(contact, email)}
        />
      ))}
    </div>
  )
}
