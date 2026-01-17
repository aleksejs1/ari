import { ContactActionsCell } from './cells/ContactActionsCell'
import { ContactDatesCell } from './cells/ContactDatesCell'
import { ContactEmailsCell } from './cells/ContactEmailsCell'
import { ContactFavoriteCell } from './cells/ContactFavoriteCell'
import { ContactGroupsCell } from './cells/ContactGroupsCell'
import { ContactNameCell } from './cells/ContactNameCell'
import { ContactPhonesCell } from './cells/ContactPhonesCell'
import { ContactNameHeader } from './components/ContactNameHeader'
import { LocalizedHeader } from './components/LocalizedHeader'

import { contactColumnRegistry } from '@/lib/contacts/ContactColumnRegistry'

export function registerDefaultColumns() {
  contactColumnRegistry.register({
    id: 'favorite',
    label: 'Favorite',
    definition: () => ({
      id: 'favorite',
      header: '',
      cell: ({ row }) => <ContactFavoriteCell contact={row.original} />,
      size: 40,
      meta: { titleKey: 'contacts.favorite' },
    }),
  })

  contactColumnRegistry.register({
    id: 'contactNames',
    label: 'Name',
    definition: () => ({
      id: 'contactNames.given',
      accessorKey: 'contactNames',
      header: ContactNameHeader,
      cell: ({ row }) => <ContactNameCell contact={row.original} />,
      meta: { titleKey: 'contacts.name' },
    }),
  })

  contactColumnRegistry.register({
    id: 'phoneNumbers',
    label: 'Phone Numbers',
    definition: () => ({
      accessorKey: 'phoneNumbers',
      header: () => <LocalizedHeader name="contacts.phoneNumbers" />,
      cell: ({ row }) => <ContactPhonesCell contact={row.original} />,
      meta: { titleKey: 'contacts.phoneNumbers' },
    }),
  })

  contactColumnRegistry.register({
    id: 'contactEmailAdresses',
    label: 'Email Addresses',
    definition: () => ({
      accessorKey: 'contactEmailAdresses',
      header: () => <LocalizedHeader name="contacts.emailAddresses" />,
      cell: ({ row }) => <ContactEmailsCell contact={row.original} />,
      meta: { titleKey: 'contacts.emailAddresses' },
    }),
  })

  contactColumnRegistry.register({
    id: 'contactGroups',
    label: 'Groups',
    definition: () => ({
      accessorKey: 'contactGroups',
      header: () => <LocalizedHeader name="contacts.groups" />,
      cell: ({ row }) => <ContactGroupsCell contact={row.original} />,
      meta: { titleKey: 'contacts.groups' },
    }),
  })

  contactColumnRegistry.register({
    id: 'contactDates',
    label: 'Dates',
    definition: () => ({
      accessorKey: 'contactDates',
      header: () => <LocalizedHeader name="contacts.dates" />,
      cell: ({ row }) => <ContactDatesCell contact={row.original} />,
      meta: { titleKey: 'contacts.dates' },
    }),
  })

  contactColumnRegistry.register({
    id: 'actions',
    label: 'Actions',
    definition: () => ({
      id: 'actions',
      header: () => <LocalizedHeader name="common.actions" />,
      cell: ({ row, table }) => {
        // @ts-expect-error meta is user-defined
        const onEdit = table.options.meta?.onEdit
        return <ContactActionsCell contact={row.original} onEdit={onEdit} />
      },
      meta: { titleKey: 'common.actions' },
    }),
  })
}
