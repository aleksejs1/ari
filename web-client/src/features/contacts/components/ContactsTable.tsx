import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
  type SortingState,
  type ColumnOrderState,
} from '@tanstack/react-table'
import { ChevronDown, Settings2, ArrowUp, ArrowDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import { type Contact } from '@/types/models'

interface ContactsTableProps {
  data: Contact[]
  columns: ColumnDef<Contact>[]
  onEdit: (contact: Contact) => void
  onSort?: (id: string, desc: boolean) => void
  sorting?: { id: string; desc: boolean }
}

interface TableSettings {
  visibility: VisibilityState
  order: ColumnOrderState
}

export function ContactsTable({ data, columns, onEdit, onSort, sorting }: ContactsTableProps) {
  'use no memo'
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { contactTableSettings, setContactTableSettings } = useUserPrefs()

  const [settings, setSettings] = useState<TableSettings>(() => {
    try {
      const parsed = JSON.parse(contactTableSettings)
      // Migration: if it's just a flat object, assume it's the old visibility state
      if (parsed && typeof parsed === 'object' && !('visibility' in parsed)) {
        return { visibility: parsed as VisibilityState, order: [] }
      }
      return (parsed as TableSettings) || { visibility: {}, order: [] }
    } catch {
      return { visibility: {}, order: [] }
    }
  })

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(settings.visibility)
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(settings.order)

  const sortingState: SortingState = useMemo(() => {
    return sorting ? [{ id: sorting.id, desc: sorting.desc }] : []
  }, [sorting])

  // We need to pass onEdit to the table meta so that cells can access it if needed
  // (e.g. ActionCell)
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: sortingState,
      columnVisibility,
      columnOrder,
    },
    manualSorting: true,
    meta: {
      onEdit,
      onSort,
      sorting,
    },
    onSortingChange: (updaterOrValue) => {
      // We only support single column sorting for now
      if (typeof updaterOrValue === 'function') {
        const newSorting = updaterOrValue(sortingState)
        if (newSorting.length > 0 && onSort) {
          onSort(newSorting[0].id, newSorting[0].desc)
        }
      } else if (Array.isArray(updaterOrValue) && updaterOrValue.length > 0 && onSort) {
        onSort(updaterOrValue[0].id, updaterOrValue[0].desc)
      }
    },
    onColumnVisibilityChange: (updaterOrValue) => {
      const next =
        typeof updaterOrValue === 'function' ? updaterOrValue(columnVisibility) : updaterOrValue
      setColumnVisibility(next)
      const newSettings = { ...settings, visibility: next }
      setSettings(newSettings)
      void setContactTableSettings(JSON.stringify(newSettings))
    },
    onColumnOrderChange: (updaterOrValue) => {
      const next =
        typeof updaterOrValue === 'function' ? updaterOrValue(columnOrder) : updaterOrValue
      setColumnOrder(next)
      const newSettings = { ...settings, order: next }
      setSettings(newSettings)
      void setContactTableSettings(JSON.stringify(newSettings))
    },
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Settings2 className="mr-2 h-4 w-4" />
              {t('common.columns') || 'Columns'}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('common.toggleColumns') || 'Toggle Columns'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <div key={column.id} className="flex items-center justify-between pr-2">
                    <DropdownMenuCheckboxItem
                      className="flex-1 capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {/* Try to use the column header as label if it's a string, otherwise ID */}
                      {typeof column.columnDef.header === 'string'
                        ? column.columnDef.header
                        : column.id}
                    </DropdownMenuCheckboxItem>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const allOrder = table.getState().columnOrder.length
                            ? table.getState().columnOrder
                            : table.getAllLeafColumns().map((c) => c.id)
                          const index = allOrder.indexOf(column.id)
                          if (index > 0) {
                            const newOrder = [...allOrder]
                            const temp = newOrder[index]
                            newOrder[index] = newOrder[index - 1]
                            newOrder[index - 1] = temp
                            table.setColumnOrder(newOrder)
                          }
                        }}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const allOrder = table.getState().columnOrder.length
                            ? table.getState().columnOrder
                            : table.getAllLeafColumns().map((c) => c.id)
                          const index = allOrder.indexOf(column.id)
                          if (index < allOrder.length - 1) {
                            const newOrder = [...allOrder]
                            const temp = newOrder[index]
                            newOrder[index] = newOrder[index + 1]
                            newOrder[index + 1] = temp
                            table.setColumnOrder(newOrder)
                          }
                        }}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
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
                  className="group/row cursor-pointer"
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
    </div>
  )
}
