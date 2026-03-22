import { useTranslation } from 'react-i18next'
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Check, Edit, Trash2 } from 'lucide-react'

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

import { useVerifyNotificationChannel } from '../../hooks/useNotificationChannels'

interface NotificationChannelsTableProps {
  data: NotificationChannel[]
  onEdit: (channel: NotificationChannel) => void
  onDelete: (channel: NotificationChannel) => void
}

function VerifyButton({ id }: { id: number | string }) {
  const { t } = useTranslation()
  const { mutate, isPending, isSuccess } = useVerifyNotificationChannel()

  if (isSuccess) {
    return (
      <span className="text-xs text-green-600">{t('notificationChannels.verificationSent')}</span>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-7 text-xs"
      disabled={isPending}
      onClick={() => mutate(id)}
      data-testid="channel-verify-button"
    >
      {isPending ? t('common.loading') : t('notificationChannels.verify')}
    </Button>
  )
}

const EmailConfig = ({ channel }: { channel: NotificationChannel }) => {
  const { t } = useTranslation()
  const config = channel.config as Record<string, string>

  if (!config?.email) {
    return null
  }

  if (!channel.id) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <span>{config.email}</span>
      {channel.verifiedAt ? (
        <span title={t('notificationChannels.verified')}>
          <Check className="h-5 w-5 text-green-500" data-testid="status-active" />
        </span>
      ) : (
        <VerifyButton id={channel.id} />
      )}
    </div>
  )
}

const TelegramConfig = ({ channel }: { channel: NotificationChannel }) => {
  const { t } = useTranslation()
  const config = channel.config as Record<string, string>

  if (!config) {
    return null
  }

  if (config.chatId) {
    return <Check className="h-5 w-5 text-green-500" data-testid="status-active" />
  }

  if (config.mapping && !config.chatId) {
    return (
      <div className="mt-1">
        <Button variant="outline" size="sm" asChild className="h-7 text-xs">
          <a
            href={`https://t.me/ari_crm_test_notifications_bot?start=${config.mapping}_${channel.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('notificationChannels.activate')}
          </a>
        </Button>
      </div>
    )
  }
  return null
}

const ChannelConfigCell = ({ channel }: { channel: NotificationChannel }) => {
  if (channel.type === 'web') {
    return <Check className="h-5 w-5 text-green-500" data-testid="status-active" />
  }

  if (channel.type === 'email') {
    return <EmailConfig channel={channel} />
  }

  if (channel.type === 'telegram') {
    return <TelegramConfig channel={channel} />
  }

  return null
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
      header: t('notificationChannels.activated'),
      cell: ({ row }) => <ChannelConfigCell channel={row.original} />,
    },

    {
      id: 'actions',
      header: t('common.actions'),
      cell: ({ row }) => {
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(row.original)}
              data-testid="channel-edit-button"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600"
              onClick={() => onDelete(row.original)}
              data-testid="channel-delete-button"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

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
              <TableRow key={row.id} data-testid="channel-row">
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
