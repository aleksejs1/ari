import type { useNavigate } from 'react-router-dom'
import type { Row as TanstackRow, Table as TanstackTable } from '@tanstack/react-table'

import type { Contact } from '@/types/models'

import { ContactActionsCell } from '../cells/ContactActionsCell'
import { ContactAvatarCell } from '../cells/ContactAvatarCell'
import { ContactDatesCell } from '../cells/ContactDatesCell'
import { ContactEmailsCell } from '../cells/ContactEmailsCell'
import { ContactFavoriteCell } from '../cells/ContactFavoriteCell'
import { ContactGroupsCell } from '../cells/ContactGroupsCell'
import { ContactNameCell } from '../cells/ContactNameCell'
import { ContactPhonesCell } from '../cells/ContactPhonesCell'
import { type FormatDate, renderTypedCell, type TypedColumnSpec } from '../utils'

function MobileCardSection({
  table,
  columnId,
  data,
  children,
}: {
  table: TanstackTable<Contact>
  columnId: string
  data: unknown[] | undefined
  children: React.ReactNode
}) {
  if (!table.getColumn(columnId)?.getIsVisible() || !data || data.length === 0) {
    return null
  }

  return <div className="flex flex-wrap gap-2 empty:hidden">{children}</div>
}

function ContactMobileCardBody({
  row,
  table,
  typedColumns,
  formatDate,
}: {
  row: TanstackRow<Contact>
  table: TanstackTable<Contact>
  typedColumns: TypedColumnSpec[]
  formatDate: FormatDate
}) {
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
      {typedColumns.map((spec) => {
        const value = renderTypedCell(contact, spec, formatDate)
        if (value === '—') {
          return null
        }
        return (
          <div key={spec.id} className="flex flex-wrap gap-1">
            <span className="text-muted-foreground/60">{spec.label}:</span>
            <span>{value}</span>
          </div>
        )
      })}
    </div>
  )
}

export function ContactMobileCard({
  row,
  table,
  navigate,
  onEdit,
  typedColumns,
  formatDate,
}: {
  row: TanstackRow<Contact>
  table: TanstackTable<Contact>
  navigate: ReturnType<typeof useNavigate>
  onEdit: (contact: Contact) => void
  typedColumns: TypedColumnSpec[]
  formatDate: FormatDate
}) {
  return (
    <div
      className="flex cursor-pointer items-center gap-4 rounded-lg border bg-card p-4 shadow-sm transition-colors active:bg-muted/50"
      onClick={() => navigate(`/contacts/${row.original.id}`)}
      role="button"
      tabIndex={0}
      data-testid="contact-card"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          void navigate(`/contacts/${row.original.id}`)
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
        <ContactMobileCardBody
          row={row}
          table={table}
          typedColumns={typedColumns}
          formatDate={formatDate}
        />
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
