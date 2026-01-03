import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Star } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useContactFavorite } from '../hooks/useContactFavorite'
import { useGroups } from '../useContacts'

import { ContactGroupInlineEdit } from './ContactGroupInlineEdit'
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
} from '@/types/models'

interface ContactsTableProps {
  data: Contact[]
  onEdit: (contact: Contact) => void
  onUpdateDate: (contact: Contact, date: ContactDate) => void
  onDeleteDate: (contact: Contact, date: ContactDate) => void
  onUpdateGroups: (contact: Contact, groupIds: string[]) => void
}

export function ContactsTable({
  data,
  onEdit,
  onUpdateDate,
  onDeleteDate,
  onUpdateGroups,
}: ContactsTableProps) {
  'use no memo'
  const onExchangeDate = onUpdateDate
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: groups } = useGroups()
  const { toggleFavorite, isContactFavorite } = useContactFavorite()

  const onToggleFavorite = useCallback(
    async (contact: Contact, e: React.MouseEvent) => {
      e.stopPropagation()
      await toggleFavorite(contact)
    },
    [toggleFavorite],
  )

  const columns = useMemo<ColumnDef<Contact>[]>(
    () => [
      {
        id: 'favorite',
        header: '',
        cell: ({ row }) => {
          const isFavorite = isContactFavorite(row.original)
          return (
            <div className="flex items-center justify-center">
              <Star
                className={`h-4 w-4 cursor-pointer transition-transform hover:scale-110 ${
                  isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                }`}
                onClick={(e) => onToggleFavorite(row.original, e)}
              />
            </div>
          )
        },
        size: 40,
      },
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
          <ContactGroupInlineEdit
            contact={row.original}
            groups={groups || []}
            onUpdate={onUpdateGroups}
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
          return <ContactsTableActions contact={row.original} onEdit={onEdit} />
        },
      },
    ],
    [
      t,
      onExchangeDate,
      onDeleteDate,
      onEdit,
      groups,
      onToggleFavorite,
      isContactFavorite,
      onUpdateGroups,
    ],
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
