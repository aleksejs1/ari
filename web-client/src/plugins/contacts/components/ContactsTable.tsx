import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  type ColumnDef,
  type ColumnOrderState,
  flexRender,
  getCoreRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronDown, LayoutGrid, Settings2, Table2 } from 'lucide-react'

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
import { cn } from '@/lib/utils'
import { type Contact } from '@/types/models'

import { ContactActionsCell } from '../cells/ContactActionsCell'
import { ContactAvatarCell } from '../cells/ContactAvatarCell'
import { ContactDatesCell } from '../cells/ContactDatesCell'
import { ContactEmailsCell } from '../cells/ContactEmailsCell'
import { ContactFavoriteCell } from '../cells/ContactFavoriteCell'
import { ContactGroupsCell } from '../cells/ContactGroupsCell'
import { ContactNameCell } from '../cells/ContactNameCell'
import { ContactPhonesCell } from '../cells/ContactPhonesCell'

interface ContactsTableProps {
  data: Contact[]
  columns: ColumnDef<Contact>[]
  onEdit: (contact: Contact) => void
  onSort?: (id: string, desc: boolean) => void
  sorting?: { id: string; desc: boolean }
}

export interface TypedColumnSpec {
  baseField: 'contactNames' | 'phoneNumbers' | 'contactEmailAdresses' | 'contactDates'
  qualifier: string // locale for names, type string for phones/emails, text for dates
  id: string // `${baseField}:${qualifier}`
  label: string // human-readable label e.g. "Mobile phone"
}

interface TableSettings {
  visibility: VisibilityState
  order: ColumnOrderState
  typedColumns: TypedColumnSpec[]
  viewMode: 'table' | 'cards'
}

function renderTypedCell(contact: Contact, spec: TypedColumnSpec): string {
  switch (spec.baseField) {
    case 'phoneNumbers': {
      return contact.phoneNumbers?.find((p) => p.type === spec.qualifier)?.value ?? '—'
    }
    case 'contactEmailAdresses': {
      return contact.contactEmailAdresses?.find((e) => e.type === spec.qualifier)?.value ?? '—'
    }
    case 'contactNames': {
      const name = contact.contactNames?.find((n) => n.locale === spec.qualifier)
      if (!name) {
        return '—'
      }
      return [name.given, name.family].filter(Boolean).join(' ') || '—'
    }
    case 'contactDates': {
      return contact.contactDates?.find((d) => d.text === spec.qualifier)?.date ?? '—'
    }
    default: {
      return '—'
    }
  }
}

export function ContactsTable({ data, columns, onEdit, onSort, sorting }: ContactsTableProps) {
  'use no memo'
  const { t } = useTranslation('contacts')
  const navigate = useNavigate()
  const { contactTableSettings, setContactTableSettings } = useUserPrefs()

  const [settings, setSettings] = useState<TableSettings>(() => {
    try {
      const parsed = JSON.parse(contactTableSettings)
      if (parsed && typeof parsed === 'object' && !('visibility' in parsed)) {
        return {
          visibility: parsed as VisibilityState,
          order: [],
          typedColumns: [],
          viewMode: 'table',
        }
      }
      return {
        visibility: {},
        order: [],
        typedColumns: [],
        viewMode: 'table',
        ...(parsed as Partial<TableSettings>),
      }
    } catch {
      return { visibility: {}, order: [], typedColumns: [], viewMode: 'table' }
    }
  })

  const viewMode = settings.viewMode ?? 'table'

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(settings.visibility)
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(settings.order)

  const sortingState: SortingState = useMemo(() => {
    return sorting ? [{ id: sorting.id, desc: sorting.desc }] : []
  }, [sorting])

  const typedColumnDefs = useMemo((): ColumnDef<Contact>[] => {
    return (settings.typedColumns ?? []).map((spec) => ({
      id: spec.id,
      header: spec.label,
      enableSorting: false,
      cell: ({ row }) => renderTypedCell(row.original, spec),
      meta: { titleKey: undefined, isTypedColumn: true },
    }))
  }, [settings.typedColumns])

  const mergedColumns = useMemo((): ColumnDef<Contact>[] => {
    if (typedColumnDefs.length === 0) {
      return columns
    }

    const result: ColumnDef<Contact>[] = []
    for (const col of columns) {
      result.push(col)
      // Insert typed columns that belong after this base column
      const baseId =
        (col as { id?: string; accessorKey?: string }).id ??
        (col as { id?: string; accessorKey?: string }).accessorKey ??
        ''
      const children = typedColumnDefs.filter((tc) => {
        const spec = settings.typedColumns?.find((s) => s.id === (tc as { id?: string }).id)
        return spec?.baseField === baseId
      })
      result.push(...children)
    }
    return result
  }, [columns, typedColumnDefs, settings.typedColumns])

  // We need to pass onEdit to the table meta so that cells can access it if needed
  // (e.g. ActionCell)

  const table = useReactTable({
    data,
    columns: mergedColumns,
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
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const next: TableSettings['viewMode'] = viewMode === 'table' ? 'cards' : 'table'
            const newSettings = { ...settings, viewMode: next }
            setSettings(newSettings)
            void setContactTableSettings(JSON.stringify(newSettings))
          }}
          title={viewMode === 'table' ? t('viewMode.cards') : t('viewMode.table')}
        >
          {viewMode === 'table' ? (
            <LayoutGrid className="h-4 w-4" />
          ) : (
            <Table2 className="h-4 w-4" />
          )}
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
            {useMemo(() => {
              const allColumns = table.getAllColumns()
              const currentOrder = columnOrder
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
                  // @ts-expect-error meta is user-defined
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
                            const prevIdx = order.indexOf(
                              visibleColumnsInOrder[indexInVisible - 1].id,
                            )
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
                            const nextIdx = order.indexOf(
                              visibleColumnsInOrder[indexInVisible + 1].id,
                            )
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
              // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [table, t, columnVisibility, columnOrder])}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={viewMode === 'cards' ? 'hidden' : 'hidden md:block'}>
        <div className="overflow-x-auto rounded-md border">
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
                    data-testid="contact-row"
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

      <div className={cn('space-y-4', viewMode === 'cards' ? 'block' : 'md:hidden')}>
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

function ContactMobileCard({
  row,
  table,
  navigate,
  onEdit,
}: {
  row: any
  table: any
  navigate: ReturnType<typeof useNavigate>
  onEdit: (contact: Contact) => void
}) {
  return (
    <div
      className="flex cursor-pointer items-center gap-4 rounded-lg border bg-card p-4 shadow-sm transition-colors active:bg-muted/50"
      onClick={() => navigate(`/contacts/${row.original.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={async (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          await navigate(`/contacts/${row.original.id}`)
        }
      }}
    >
      <div className="flex-shrink-0">
        {table.getColumn('avatar')?.getIsVisible() ? (
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="presentation"
          >
            <ContactAvatarCell contact={row.original} />
          </div>
        ) : null}
      </div>
      <div className="grid min-w-0 flex-1 gap-1">
        <div className="flex items-center gap-2">
          <div className="truncate text-base font-medium">
            {table.getColumn('contactNames.given')?.getIsVisible() ? (
              <ContactNameCell contact={row.original} />
            ) : null}
          </div>
          {table.getColumn('favorite')?.getIsVisible() ? (
            <ContactFavoriteCell contact={row.original} />
          ) : null}
        </div>
        <ContactMobileCardBody row={row} table={table} />
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        <ContactActionsCell contact={row.original} onEdit={onEdit} />
      </div>
    </div>
  )
}

function ContactMobileCardBody({ row, table }: { row: any; table: any }) {
  const contact = row.original
  return (
    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
      <MobileCardSection table={table} columnId="phoneNumbers" data={contact.phoneNumbers}>
        <ContactPhonesCell contact={contact} />
      </MobileCardSection>
      <MobileCardSection
        table={table}
        columnId="contactEmailAdresses"
        data={contact.contactEmailAdresses}
      >
        <ContactEmailsCell contact={contact} />
      </MobileCardSection>
      <MobileCardSection table={table} columnId="contactGroups" data={contact.contactGroups}>
        <ContactGroupsCell contact={contact} />
      </MobileCardSection>
      <MobileCardSection table={table} columnId="contactDates" data={contact.contactDates}>
        <ContactDatesCell contact={contact} />
      </MobileCardSection>
    </div>
  )
}

function MobileCardSection({
  table,
  columnId,
  data,
  children,
}: {
  table: any
  columnId: string
  data: any[] | undefined
  children: React.ReactNode
}) {
  if (!table.getColumn(columnId)?.getIsVisible() || !data || data.length === 0) {
    return null
  }

  return <div className="flex flex-wrap gap-2 empty:hidden">{children}</div>
}
