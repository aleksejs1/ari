import { ContactDateInlineEdit } from './ContactDateInlineEdit'

import { type Contact, type ContactDate } from '@/types/models'

interface ContactsTableDatesProps {
  contact: Contact
  dates: ContactDate[]
  onUpdateDate: (contact: Contact, date: ContactDate) => void
  onDeleteDate: (contact: Contact, date: ContactDate) => void
}

export function ContactsTableDates({
  contact,
  dates,
  onUpdateDate,
  onDeleteDate,
}: ContactsTableDatesProps) {
  return (
    <div className="flex flex-col gap-1">
      {dates.map((date, i) => (
        <ContactDateInlineEdit
          key={i}
          date={date}
          onUpdate={(updatedDate) => onUpdateDate(contact, updatedDate)}
          onDelete={() => onDeleteDate(contact, date)}
        />
      ))}
    </div>
  )
}
