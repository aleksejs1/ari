import { describe, expect, it } from 'vitest'

import { parseTableSettings } from './useTableSettings'

describe('parseTableSettings', () => {
  it('returns defaults for empty string', () => {
    const result = parseTableSettings('')
    expect(result).toEqual({
      visibility: { lastInteraction: false, cadence: false },
      order: [],
      typedColumns: [],
      viewMode: 'table',
    })
  })

  it('returns defaults for invalid JSON', () => {
    const result = parseTableSettings('not-json')
    expect(result).toEqual({
      visibility: { lastInteraction: false, cadence: false },
      order: [],
      typedColumns: [],
      viewMode: 'table',
    })
  })

  it('parses a full settings object', () => {
    const settings = {
      visibility: { name: true, phone: false },
      order: ['name', 'phone'],
      typedColumns: [
        { baseField: 'phoneNumbers', qualifier: 'mobile', id: 'phone:mobile', label: 'Mobile' },
      ],
      viewMode: 'cards',
    }
    const result = parseTableSettings(JSON.stringify(settings))
    expect(result).toEqual(settings)
  })

  it('migrates legacy format (visibility-only object without visibility key)', () => {
    const legacy = { name: true, phone: false }
    const result = parseTableSettings(JSON.stringify(legacy))
    expect(result.visibility).toEqual(legacy)
    expect(result.order).toEqual([])
    expect(result.typedColumns).toEqual([])
    expect(result.viewMode).toBe('table')
  })

  it('applies defaults for missing fields when visibility key is present', () => {
    // Objects that include a 'visibility' key are treated as the new format
    const partial = { visibility: {}, viewMode: 'cards' }
    const result = parseTableSettings(JSON.stringify(partial))
    expect(result.viewMode).toBe('cards')
    expect(result.visibility).toEqual({})
    expect(result.order).toEqual([])
    expect(result.typedColumns).toEqual([])
  })
})
