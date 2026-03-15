import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Columns3,
  LayoutGrid,
  Settings2,
  Table2,
} from 'lucide-react'

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
import { cn } from '@/lib/utils'
import { type Contact } from '@/types/models'

import { useTableSettings } from '../hooks/useTableSettings'
import { renderTypedCell, type TypedColumnSpec } from '../utils'

import { ContactMobileCard } from './ContactMobileCard'
import { DisplaySettingsModal } from './DisplaySettingsModal'

interface ContactsTableProps {
  data: Contact[]
  columns: ColumnDef<Contact>[]
  onEdit: (contact: Contact) => void
  onSort?: (id: string, desc: boolean) => void
  sorting?: { id: string; desc: boolean }
}

function getViewModeTitle(viewMode: 'table' | 'cards', t: (key: string) => string): string {
  return viewMode === 'table' ? t('viewMode.cards') : t('viewMode.table')
}

function getViewModeIcon(viewMode: 'table' | 'cards') {
  if (viewMode === 'table') {
    return <LayoutGrid className="h-4 w-4" />
  }
  return <Table2 className="h-4 w-4" />
}

function getTableWrapperClass(viewMode: 'table' | 'cards'): string {
  return viewMode === 'cards' ? 'hidden' : 'hidden md:block'
}

function getCardsWrapperClass(viewMode: 'table' | 'cards'): string {
  return cn('space-y-4', viewMode === 'cards' ? 'block' : 'md:hidden')
}

export function ContactsTable({ data, columns, onEdit, onSort, sorting }: ContactsTableProps) {
  const { t } = useTranslation('contacts')
  const navigate = useNavigate()
  const { settings, formatDate, updateSettings } = useTableSettings()

  const viewMode = settings.viewMode ?? 'table'

  const [displayModalOpen, setDisplayModalOpen] = useState(false)

  const sortingState: SortingState = useMemo(() => {
    return sorting ? [{ id: sorting.id, desc: sorting.desc }] : []
  }, [sorting])

  const typedColumnDefs = useMemo((): ColumnDef<Contact>[] => {
    return (settings.typedColumns ?? []).map((spec) => ({
      id: spec.id,
      header: spec.label,
      enableSorting: false,
      cell: ({ row }) => renderTypedCell(row.original, spec, formatDate),
      meta: { titleKey: undefined, isTypedColumn: true },
    }))
  }, [settings.typedColumns, formatDate])

  const mergedColumns = useMemo((): ColumnDef<Contact>[] => {
    if (typedColumnDefs.length === 0) {
      return columns
    }

    const result: ColumnDef<Contact>[] = []
    for (const col of columns) {
      result.push(col)
      // Insert typed columns that belong after this base column.
      // Prefer accessorKey over id: the contactNames column has id='contactNames.given'
      // but accessorKey='contactNames', and TypedColumnSpec.baseField matches accessorKey.
      const baseId =
        (col as { id?: string; accessorKey?: string }).accessorKey ??
        (col as { id?: string; accessorKey?: string }).id ??
        ''
      const children = typedColumnDefs.filter((tc) => {
        const spec = settings.typedColumns?.find((s) => s.id === (tc as { id?: string }).id)
        return spec?.baseField === baseId
      })
      result.push(...children)
    }
    return result
  }, [columns, typedColumnDefs, settings.typedColumns])

  const table = useReactTable({
    data,
    columns: mergedColumns,
    state: {
      sorting: sortingState,
      columnVisibility: settings.visibility,
      columnOrder: settings.order,
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
        typeof updaterOrValue === 'function' ? updaterOrValue(settings.visibility) : updaterOrValue
      updateSettings({ visibility: next })
    },
    onColumnOrderChange: (updaterOrValue) => {
      const next =
        typeof updaterOrValue === 'function' ? updaterOrValue(settings.order) : updaterOrValue
      updateSettings({ order: next })
    },
    getCoreRowModel: getCoreRowModel(),
  })

  // C4 fix: useMemo extracted from JSX to a top-level variable so the component
  // can benefit from React Compiler optimizations (removes the need for 'use no memo').
  const columnMenuItems = useMemo(() => {
    const allColumns = table.getAllColumns()
    const currentOrder = settings.order
    const leafColumnIds = table.getAllLeafColumns().map((c) => c.id)

    // If order is empty, use definition order
    let effectiveOrder = currentOrder.length > 0 ? currentOrder : leafColumnIds

    // Ensure all columns are in effectiveOrder (handle additions)
    const missingInOrder = leafColumnIds.filter((id) => !effectiveOrder.includes(id))
    if (missingInOrder.length > 0) {
      // Determine indices from registry order (leafColumnIds)
      const newOrder = [...effectiveOrder]
      missingInOrder.forEach((id) => {
        const originalIdx = leafColumnIds.indexOf(id)
        // Insert at its "natural" position if possible, otherwise at the end
        if (originalIdx < newOrder.length) {
          newOrder.splice(originalIdx, 0, id)
        } else {
          newOrder.push(id)
        }
      })
      effectiveOrder = newOrder
    }

    // Ensure 'actions' is ALWAYS last if it exists
    if (effectiveOrder.includes('actions')) {
      effectiveOrder = effectiveOrder.filter((id) => id !== 'actions')
      effectiveOrder.push('actions')
    }

    // Sort columns based on effectiveOrder
    const sortedColumns = [...allColumns].sort((a, b) => {
      const aIndex = effectiveOrder.indexOf(a.id)
      const bIndex = effectiveOrder.indexOf(b.id)
      return aIndex - bIndex
    })

    return sortedColumns
      .filter((column) => column.getCanHide() && column.id !== 'actions')
      .map((column) => {
        const titleKey = column.columnDef.meta?.titleKey
        let label: string = column.id

        if (titleKey) {
          label = t(titleKey)
        } else if (typeof column.columnDef.header === 'string') {
          label = column.columnDef.header
        }

        const visibleColumnsInOrder = sortedColumns.filter(
          (c) => c.getIsVisible() || c.id === column.id,
        )
        const indexInVisible = visibleColumnsInOrder.findIndex((c) => c.id === column.id)

        return (
          <div key={column.id} className="flex items-center justify-between pr-2">
            <DropdownMenuCheckboxItem
              className="flex-1 capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
              onSelect={(e) => e.preventDefault()}
            >
              {label}
            </DropdownMenuCheckboxItem>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                disabled={indexInVisible === 0}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const order = [...effectiveOrder]
                  const idx = order.indexOf(column.id)
                  const prevIdx = order.indexOf(visibleColumnsInOrder[indexInVisible - 1].id)
                  if (idx !== -1 && prevIdx !== -1) {
                    const temp = order[idx]
                    order[idx] = order[prevIdx]
                    order[prevIdx] = temp
                    table.setColumnOrder(order)
                  }
                }}
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                disabled={indexInVisible === visibleColumnsInOrder.length - 1}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const order = [...effectiveOrder]
                  const idx = order.indexOf(column.id)
                  const nextIdx = order.indexOf(visibleColumnsInOrder[indexInVisible + 1].id)
                  if (idx !== -1 && nextIdx !== -1) {
                    const temp = order[idx]
                    order[idx] = order[nextIdx]
                    order[nextIdx] = temp
                    table.setColumnOrder(order)
                  }
                }}
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )
      })
  }, [table, t, settings.order])

  return (
    <div className="space-y-4">
      <DisplaySettingsModal
        open={displayModalOpen}
        onOpenChange={setDisplayModalOpen}
        typedColumns={settings.typedColumns ?? []}
        onSave={(newTypedColumns: TypedColumnSpec[]) =>
          updateSettings({ typedColumns: newTypedColumns })
        }
      />
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setDisplayModalOpen(true)}
          title={t('displaySettings.title')}
          data-testid="display-settings-button"
        >
          <Columns3 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const next: 'table' | 'cards' = viewMode === 'table' ? 'cards' : 'table'
            updateSettings({ viewMode: next })
          }}
          title={getViewModeTitle(viewMode, t)}
          data-testid="view-mode-toggle"
        >
          {getViewModeIcon(viewMode)}
        </Button>
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
            {columnMenuItems}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={getTableWrapperClass(viewMode)}>
        <div className="overflow-x-auto rounded-md border">
          <Table className="[&_td:first-child]:pl-6 [&_th:first-child]:pl-6">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isPinned = header.column.id === 'actions'
                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          isPinned &&
                            'sticky right-0 bg-background pr-6 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.08)]',
                        )}
                      >
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
                    data-testid="contact-row"
                    onClick={() => navigate(`/contacts/${row.original.id}`)}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isPinned = cell.column.id === 'actions'
                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            isPinned &&
                              'sticky right-0 bg-background pr-6 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.08)]',
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow data-testid="contacts-empty">
                  <TableCell colSpan={mergedColumns.length} className="h-24 text-center">
                    {t('noContacts')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className={getCardsWrapperClass(viewMode)}>
        {table.getRowModel().rows?.length ? (
          table
            .getRowModel()
            .rows.map((row) => (
              <ContactMobileCard
                key={row.id}
                row={row}
                table={table}
                navigate={navigate}
                onEdit={onEdit}
                typedColumns={settings.typedColumns ?? []}
                formatDate={formatDate}
              />
            ))
        ) : (
          <div className="rounded-lg border border-dashed bg-card py-8 text-center text-muted-foreground">
            {t('noContacts')}
          </div>
        )}
      </div>
    </div>
  )
}
