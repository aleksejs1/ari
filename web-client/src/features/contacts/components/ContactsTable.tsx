import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useGroups } from '../useContacts'

import { ContactsTableActions } from './ContactsTableActions'
import { ContactsTableDates } from './ContactsTableDates'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  type Contact,
  type ContactDate,
  type ContactName,
  type ContactPhoneNumber,
  type ContactEmailAdress,
  type Group,
} from '@/types/models'

interface ContactsTableProps {
  data: Contact[]
  onEdit: (contact: Contact) => void
  onDelete: (contact: Contact) => void
  onUpdateDate: (contact: Contact, date: ContactDate) => void
  onDeleteDate: (contact: Contact, date: ContactDate) => void
}

const ContactsTableGroupCell = ({
  contactGroups,
  groups,
}: {
  contactGroups: Contact['contactGroups']
  groups: Group[]
}) => {
  if (!contactGroups) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-1">
      {contactGroups.map((cg, i) => {
        const groupIri =
          typeof cg.groupResource === 'string'
            ? cg.groupResource
            : (cg.groupResource as { '@id'?: string })?.['@id']

        if (!groupIri) {
          return null
        }

        const group = groups?.find((g) => g['@id'] === groupIri)
        const label = group?.name || '...'

        return (
          <span
            key={i}
            className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
          >
            {label}
          </span>
        )
      })}
    </div>
  )
}

export function ContactsTable({
  data,
  onEdit,
  onDelete,
  onUpdateDate,
  onDeleteDate,
}: ContactsTableProps) {
  'use no memo'
  const onExchangeDate = onUpdateDate
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: groups } = useGroups()

  const columns = useMemo<ColumnDef<Contact>[]>(
    () => [
      {
        accessorKey: 'contactNames',
        header: t('contacts.name'),
        cell: ({ row }) => {
          const names = row.original.contactNames?.length
            ? row.original.contactNames
            : [{ given: '', family: '' } as ContactName]

          return (
            <div className="flex flex-col">
              {names.map((name, i) => (
                <div key={i} className="group flex items-center justify-between">
                  <span className="font-medium text-primary">
                    {name.given} {name.family}
                  </span>
                </div>
              ))}
            </div>
          )
        },
      },
      {
        accessorKey: 'phoneNumbers',
        header: t('contacts.phoneNumbers'),
        cell: ({ row }) => {
          const phones = (row.original.phoneNumbers || []) as ContactPhoneNumber[]
          return (
            <div className="flex flex-col gap-1">
              {phones.map((phone, i) => (
                <div key={i} className="flex flex-col leading-tight">
                  <span className="text-sm font-medium">{phone.value}</span>
                  {!!phone.type && (
                    <span className="text-[10px] text-muted-foreground">{phone.type}</span>
                  )}
                </div>
              ))}
            </div>
          )
        },
      },
      {
        accessorKey: 'contactEmailAdresses',
        header: t('contacts.emailAddresses'),
        cell: ({ row }) => {
          const emails = (row.original.contactEmailAdresses || []) as ContactEmailAdress[]
          return (
            <div className="flex flex-col gap-1">
              {emails.map((email, i) => (
                <div key={i} className="flex flex-col leading-tight">
                  <span className="text-sm font-medium">{email.value}</span>
                  {!!email.type && (
                    <span className="text-[10px] text-muted-foreground">{email.type}</span>
                  )}
                </div>
              ))}
            </div>
          )
        },
      },
      {
        accessorKey: 'contactGroups',
        header: t('contacts.groups'),
        cell: ({ row }) => (
          <ContactsTableGroupCell
            contactGroups={row.original.contactGroups}
            groups={groups || []}
          />
        ),
      },
      {
        accessorKey: 'contactDates',
        header: t('contacts.dates'),
        cell: ({ row }) => {
          const dates = row.original.contactDates?.length
            ? row.original.contactDates
            : [{ date: '', text: '' } as ContactDate]

          return (
            <ContactsTableDates
              contact={row.original}
              dates={dates}
              onUpdateDate={onExchangeDate}
              onDeleteDate={onDeleteDate}
            />
          )
        },
      },
      {
        id: 'actions',
        header: t('common.actions'),
        cell: ({ row }) => {
          return <ContactsTableActions contact={row.original} onEdit={onEdit} onDelete={onDelete} />
        },
      },
    ],
    [t, onExchangeDate, onDeleteDate, onEdit, onDelete, groups],
  )
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <Table className="[&_td:first-child]:pl-6 [&_td:last-child]:pr-6 [&_th:first-child]:pl-6 [&_th:last-child]:pr-6">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="cursor-pointer"
                onClick={() => navigate(`/contacts/${row.original.id}`)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {t('contacts.noContacts')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
