import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Edit, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ContactDateInlineEdit } from './ContactDateInlineEdit'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type Contact, type ContactDate, type ContactName } from '@/types/models'

interface ContactsTableProps {
  data: Contact[]
  onEdit: (contact: Contact) => void
  onDelete: (contact: Contact) => void
  onUpdateDate: (contact: Contact, date: ContactDate) => void
  onDeleteDate: (contact: Contact, date: ContactDate) => void
}

export function ContactsTable({
  data,
  onEdit,
  onDelete,
  onUpdateDate,
  onDeleteDate,
}: ContactsTableProps) {
  // renamed internally for the helper above but let's keep it clean
  const onExchangeDate = onUpdateDate
  const { t } = useTranslation()

  const columns: ColumnDef<Contact>[] = [
    {
      accessorKey: 'contactNames',
      header: t('contacts.name', 'Name'),
      cell: ({ row }) => {
        const names = row.original.contactNames?.length
          ? row.original.contactNames
          : [{ given: '', family: '' } as ContactName]

        return (
          <div className="flex flex-col">
            {names.map((name, i) => (
              <div key={i} className="group flex items-center justify-between">
                <Link
                  to={`/contacts/${row.original.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {name.given} {name.family}
                </Link>
              </div>
            ))}
          </div>
        )
      },
    },
    {
      accessorKey: 'contactDates',
      header: t('contacts.dates', 'Important Dates'),
      cell: ({ row }) => {
        const dates = row.original.contactDates?.length
          ? row.original.contactDates
          : [{ date: '', text: '' } as ContactDate]

        return (
          <div className="flex flex-col gap-1">
            {dates.map((date, i) => (
              <ContactDateInlineEdit
                key={i}
                date={date}
                onUpdate={(updatedDate) => onExchangeDate(row.original, updatedDate)}
                onDelete={() => onDeleteDate(row.original, date)}
              />
            ))}
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: t('common.actions', 'Actions'),
      cell: ({ row }) => {
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(row.original)}
              aria-label="Edit Contact"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600"
              onClick={() => onDelete(row.original)}
              aria-label="Delete Contact"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border">
      <Table>
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
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
