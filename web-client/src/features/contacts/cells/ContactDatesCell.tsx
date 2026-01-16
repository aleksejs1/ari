import { ContactDateInlineEdit } from '@/features/contacts/components/ContactDateInlineEdit'
import {
  useCreateContactDate,
  useDeleteContactDate,
  useUpdateContactDate,
} from '@/features/contacts/useContacts'
import { type Contact, type ContactDate } from '@/types/models'

interface ContactDatesCellProps {
  contact: Contact
}

export function ContactDatesCell({ contact }: ContactDatesCellProps) {
  const updateDateMutation = useUpdateContactDate()
  const createDateMutation = useCreateContactDate()
  const deleteDateMutation = useDeleteContactDate()

  const onUpdateDate = async (date: ContactDate) => {
    if (date['@id']) {
      await updateDateMutation.mutateAsync({ id: date['@id'], data: date })
    } else if (contact['@id']) {
      await createDateMutation.mutateAsync({
        ...date,
        contact: contact['@id'],
      })
    }
  }

  const onDeleteDate = async (date: ContactDate) => {
    if (!date['@id']) {
      return
    }
    await deleteDateMutation.mutateAsync(date['@id'])
  }

  const dates = contact.contactDates?.length
    ? contact.contactDates
    : [{ date: '', text: '' } as ContactDate]

  return (
    <div className="flex flex-col gap-1">
      {dates.slice(0, 1).map((date, i) => (
        <ContactDateInlineEdit
          key={i}
          date={date}
          onUpdate={onUpdateDate}
          onDelete={() => onDeleteDate(date)}
        />
      ))}
    </div>
  )
}
