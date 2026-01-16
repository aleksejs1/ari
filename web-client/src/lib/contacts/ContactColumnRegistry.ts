import { type ColumnDef } from '@tanstack/react-table'

import { type Contact } from '@/types/models'

export interface ContactColumnDef {
  id: string
  label: string
  definition: () => ColumnDef<Contact>
}

export class ContactColumnRegistry {
  private columns = new Map<string, ContactColumnDef>()
  private order: string[] = []

  /**
   * Register a new column.
   * If a column with the same ID exists, it will be overwritten.
   */
  register(column: ContactColumnDef) {
    if (!this.columns.has(column.id)) {
      this.order.push(column.id)
    }
    this.columns.set(column.id, column)
  }

  /**
   * Get all registered columns in registration order.
   */
  getAll(): ColumnDef<Contact>[] {
    return this.order
      .map((id) => this.columns.get(id))
      .filter((col): col is ContactColumnDef => !!col)
      .map((col) => col.definition())
  }

  /**
   * Get specific columns by IDs.
   */
  getColumns(columnIds: string[]): ColumnDef<Contact>[] {
    return columnIds
      .map((id) => this.columns.get(id))
      .filter((col): col is ContactColumnDef => !!col)
      .map((col) => col.definition())
  }

  /**
   * Get a snapshot of registered column definitions (metadata).
   * Useful for UI selectors.
   */
  getSnapshot(): ContactColumnDef[] {
    return this.order
      .map((id) => this.columns.get(id))
      .filter((col): col is ContactColumnDef => !!col)
  }
}

export const contactColumnRegistry = new ContactColumnRegistry()
