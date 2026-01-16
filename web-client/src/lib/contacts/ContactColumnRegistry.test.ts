import { describe, expect, it } from 'vitest'

import { ContactColumnRegistry, type ContactColumnDef } from './ContactColumnRegistry'

describe('ContactColumnRegistry', () => {
  it('should register and retrieve columns', () => {
    const registry = new ContactColumnRegistry()
    const col1: ContactColumnDef = {
      id: 'col1',
      label: 'Column 1',
      definition: () => ({ id: 'col1' }),
    }
    const col2: ContactColumnDef = {
      id: 'col2',
      label: 'Column 2',
      definition: () => ({ id: 'col2' }),
    }

    registry.register(col1)
    registry.register(col2)

    const all = registry.getAll()
    expect(all).toHaveLength(2)
    expect(all[0].id).toBe('col1')
    expect(all[1].id).toBe('col2')
  })

  it('should overwrite existing column with same id', () => {
    const registry = new ContactColumnRegistry()
    const col1: ContactColumnDef = {
      id: 'col1',
      label: 'Column 1',
      definition: () => ({ id: 'col1' }),
    }
    const col1Modified: ContactColumnDef = {
      id: 'col1',
      label: 'Column 1 Modified',
      definition: () => ({ id: 'col1_mod' }),
    }

    registry.register(col1)
    registry.register(col1Modified)

    const all = registry.getAll()
    expect(all).toHaveLength(1)
    expect(all[0].id).toBe('col1_mod') // The definition result

    const snapshot = registry.getSnapshot()
    expect(snapshot[0].label).toBe('Column 1 Modified')
  })

  it('should retrieve specific columns', () => {
    const registry = new ContactColumnRegistry()
    const col1 = { id: 'col1', label: '1', definition: () => ({ id: '1' }) } as any
    const col2 = { id: 'col2', label: '2', definition: () => ({ id: '2' }) } as any
    const col3 = { id: 'col3', label: '3', definition: () => ({ id: '3' }) } as any

    registry.register(col1)
    registry.register(col2)
    registry.register(col3)

    const selected = registry.getColumns(['col1', 'col3'])
    expect(selected).toHaveLength(2)
    expect(selected[0].id).toBe('1')
    expect(selected[1].id).toBe('3')
  })
})
