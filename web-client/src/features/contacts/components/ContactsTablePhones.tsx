import { ContactPhoneInlineEdit } from './ContactPhoneInlineEdit'

import { type Contact, type ContactPhoneNumber } from '@/types/models'

interface ContactsTablePhonesProps {
  contact: Contact
  phones: ContactPhoneNumber[]
  onUpdatePhone: (contact: Contact, phone: ContactPhoneNumber) => void
  onDeletePhone: (contact: Contact, phone: ContactPhoneNumber) => void
}

export function ContactsTablePhones({
  contact,
  phones,
  onUpdatePhone,
  onDeletePhone,
}: ContactsTablePhonesProps) {
  // If no phones, show one empty generic item to allow adding
  const displayPhones =
    phones.length > 0 ? phones : ([{ value: '', type: '' }] as ContactPhoneNumber[])

  return (
    <div className="flex flex-col gap-1">
      {displayPhones.slice(0, 1).map((phone, i) => (
        <ContactPhoneInlineEdit
          key={i}
          phone={phone}
          onUpdate={(updatedPhone) => onUpdatePhone(contact, updatedPhone)}
          onDelete={() => onDeletePhone(contact, phone)}
        />
      ))}
    </div>
  )
}
