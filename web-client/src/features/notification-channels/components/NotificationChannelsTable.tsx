import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Edit, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type NotificationChannel } from '@/types/models'

interface NotificationChannelsTableProps {
  data: NotificationChannel[]
  onEdit: (channel: NotificationChannel) => void
  onDelete: (channel: NotificationChannel) => void
}

export function NotificationChannelsTable({
  data,
  onEdit,
  onDelete,
}: NotificationChannelsTableProps) {
  const { t } = useTranslation()

  const columns: ColumnDef<NotificationChannel>[] = [
    {
      accessorKey: 'type',
      header: t('notificationChannels.type'),
      cell: ({ row }) => <span className="capitalize">{row.getValue('type')}</span>,
    },
    {
      accessorKey: 'config',
      header: t('notificationChannels.config'),
      cell: ({ row }) => {
        if (row.original.type !== 'telegram') {
          return null
        }
        const config = row.original.config as Record<string, string>
        if (!config) {
          return null
        }
        return (
          <div className="text-sm text-gray-500">
            <div>
              {t('notificationChannels.chatId')}: {config.chatId}
            </div>
            <div className="w-40 truncate" title={config.botToken}>
              {t('notificationChannels.botToken')}: {config.botToken}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'verifiedAt',
      header: t('notificationChannels.verified'),
      cell: ({ row }) => {
        const date = row.original.verifiedAt
        return date ? new Date(date).toLocaleString() : t('notificationChannels.notVerified')
      },
    },
    {
      id: 'actions',
      header: t('common.actions'),
      cell: ({ row }) => {
        return (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(row.original)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600"
              onClick={() => onDelete(row.original)}
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
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                {t('notificationChannels.noChannels', 'No notification channels found.')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
