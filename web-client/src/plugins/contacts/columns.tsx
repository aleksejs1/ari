import { formatDistanceToNow, parseISO } from 'date-fns'

import { contactColumnRegistry } from '@/lib/contacts/ContactColumnRegistry'

import { ContactActionsCell } from './cells/ContactActionsCell'
import { ContactAvatarCell } from './cells/ContactAvatarCell'
import { ContactDatesCell } from './cells/ContactDatesCell'
import { ContactEmailsCell } from './cells/ContactEmailsCell'
import { ContactFavoriteCell } from './cells/ContactFavoriteCell'
import { ContactGroupsCell } from './cells/ContactGroupsCell'
import { ContactNameCell } from './cells/ContactNameCell'
import { ContactPhonesCell } from './cells/ContactPhonesCell'
import { ContactNameHeader } from './components/ContactNameHeader'
import { LocalizedHeader } from './components/LocalizedHeader'

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
    id: 'avatar',
    label: 'Avatar',
    definition: () => ({
      id: 'avatar',
      header: '',
      cell: ({ row }) => <ContactAvatarCell contact={row.original} />,
      size: 50,
      meta: { titleKey: 'contacts.avatar' },
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
      header: () => <LocalizedHeader name="phoneNumbers" />,
      cell: ({ row }) => <ContactPhonesCell contact={row.original} />,
      meta: { titleKey: 'contacts.phoneNumbers' },
    }),
  })

  contactColumnRegistry.register({
    id: 'contactEmailAdresses',
    label: 'Email Addresses',
    definition: () => ({
      accessorKey: 'contactEmailAdresses',
      header: () => <LocalizedHeader name="emailAddresses" />,
      cell: ({ row }) => <ContactEmailsCell contact={row.original} />,
      meta: { titleKey: 'contacts.emailAddresses' },
    }),
  })

  contactColumnRegistry.register({
    id: 'contactGroups',
    label: 'Groups',
    definition: () => ({
      accessorKey: 'contactGroups',
      header: () => <LocalizedHeader name="groups" />,
      cell: ({ row }) => <ContactGroupsCell contact={row.original} />,
      meta: { titleKey: 'contacts.groups' },
    }),
  })

  contactColumnRegistry.register({
    id: 'contactDates',
    label: 'Dates',
    definition: () => ({
      accessorKey: 'contactDates',
      header: () => <LocalizedHeader name="dates" />,
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

  contactColumnRegistry.register({
    id: 'lastInteraction',
    label: 'Last Interaction',
    definition: () => ({
      id: 'lastInteraction',
      header: () => <LocalizedHeader name="columns.lastInteraction" />,
      cell: ({ row }) => {
        const lastTs = row.original.lastInteractionAt
        if (!lastTs) {
          return <span className="text-sm text-muted-foreground">—</span>
        }
        const cadence = row.original.cadenceDays
        let colorClass = ''
        if (cadence !== null && cadence !== undefined) {
          const daysSince = (Date.now() - parseISO(lastTs).getTime()) / 86_400_000
          const ratio = daysSince / cadence
          if (ratio >= 1) {
            colorClass = 'text-destructive'
          } else if (ratio >= 0.7) {
            colorClass = 'text-yellow-600 dark:text-yellow-400'
          } else {
            colorClass = 'text-green-600 dark:text-green-400'
          }
        }
        return (
          <span className={`text-sm ${colorClass || 'text-muted-foreground'}`}>
            {formatDistanceToNow(parseISO(lastTs), { addSuffix: true })}
          </span>
        )
      },
      meta: { titleKey: 'contacts.columns.lastInteraction' },
    }),
  })

  contactColumnRegistry.register({
    id: 'cadence',
    label: 'Cadence',
    definition: () => ({
      id: 'cadence',
      header: () => <LocalizedHeader name="columns.cadence" />,
      cell: ({ row }) => {
        const cadence = row.original.cadenceDays
        if (cadence === null || cadence === undefined) {
          return <span className="text-sm text-muted-foreground">—</span>
        }
        return <span className="text-sm text-muted-foreground">{cadence}d</span>
      },
      meta: { titleKey: 'contacts.columns.cadence' },
    }),
  })
}
