import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { formatChangeValue, getBadgeStyles, getContactId, getLogDescription } from './utils'

import { type TimelineEvent } from '@/types/models'

vi.mock('@/lib/utils', () => ({
  formatLocalizedDate: (date: string) => date,
  cn: (...inputs: unknown[]) => inputs.join(' '),
}))

// Helper for rendering with router
const renderWithRouter = (ui: React.ReactElement | null) => {
  if (!ui) {
    return { container: null }
  }
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('audit-logs/utils', () => {
  describe('getLogDescription', () => {
    it('returns translated string', () => {
      const t = vi.fn().mockReturnValue('Translated Action')
      const log = { action: 'INSERT', entityType: 'App\\Entity\\Contact' } as TimelineEvent
      expect(getLogDescription(log, t)).toBe('Translated Action')
      expect(t).toHaveBeenCalledWith('auditLogs.entities.Contact.INSERT')
    })

    it('returns fallback string if translation missing', () => {
      const t = vi.fn().mockImplementation((key) => key)
      const log = { action: 'UPDATE', entityType: 'App\\Entity\\ContactName' } as TimelineEvent
      expect(getLogDescription(log, t)).toBe('UPDATE ContactName')
    })
  })

  describe('getBadgeStyles', () => {
    it('returns correct styles for actions', () => {
      expect(getBadgeStyles('INSERT')).toContain('green')
      expect(getBadgeStyles('UPDATE')).toContain('blue')
      expect(getBadgeStyles('REMOVE')).toContain('red')
      expect(getBadgeStyles('UNKNOWN')).toContain('gray')
    })
  })

  describe('getContactId', () => {
    it('extracts direct contact ID', () => {
      const log = {
        entityType: 'App\\Entity\\Contact',
        entityId: 123,
      } as TimelineEvent
      expect(getContactId(log)).toBe('123')
    })

    it('extracts owner contact ID', () => {
      const log = {
        entityType: 'App\\Entity\\ContactName',
        ownerEntityType: 'App\\Entity\\Contact',
        ownerEntityId: 456,
      } as TimelineEvent
      expect(getContactId(log)).toBe('456')
    })

    it('finds contact ID in snapshot data (deep search)', () => {
      const log = {
        entityType: 'App\\Entity\\Unknown',
        snapshotAfter: {
          someField: {
            contact: '/api/contacts/789',
          },
        },
      } as TimelineEvent
      expect(getContactId(log)).toBe('789')
    })

    it('returns null if no contact ID found', () => {
      const log = {
        entityType: 'App\\Entity\\Tag',
        snapshotAfter: { name: 'tag' },
      } as TimelineEvent
      expect(getContactId(log)).toBeNull()
    })
  })

  describe('formatChangeValue', () => {
    it('formats null/undefined', () => {
      const { container } = renderWithRouter(formatChangeValue(null, 'en'))
      expect(container).toBeEmptyDOMElement()
    })

    it('formats simple string', () => {
      const { container } = renderWithRouter(formatChangeValue('hello', 'en'))
      expect(container).toHaveTextContent('hello')
    })

    it('formats contact link from URI', () => {
      renderWithRouter(formatChangeValue('/api/contacts/101', 'en'))
      expect(screen.getByText('Contact #101')).toBeInTheDocument()
    })

    it('formats group link from URI', () => {
      const { container } = renderWithRouter(formatChangeValue('/api/groups/202', 'en'))
      expect(container).toHaveTextContent('Group #202')
    })

    it('formats arrays recursively', () => {
      const list = ['A', 'B']
      const { container } = renderWithRouter(formatChangeValue(list, 'en'))
      expect(container).toHaveTextContent('A')
      expect(container).toHaveTextContent('B')
    })

    it('formats object with date', () => {
      // Mock formatLocalizedDate behavior if possible or rely on simple string check if it renders something
      const obj = { date: '2023-01-01' }
      const { container } = renderWithRouter(formatChangeValue(obj, 'en'))
      // Should render date string at least
      expect(container).toHaveTextContent('2023-01-01')
    })

    it('formats object and filters internal fields', () => {
      // Use an object that doesn't look like a Contact (no name/displayName with id)
      const obj = { id: 1, customField: 'Value', '@id': '/foo', someInternal: 'hidden' }
      // We want to test that 'id', '@id' etc are filtered out in the fallback JSON view
      // But we need to make sure isContactReference returns false.
      // isContactReference checks: fieldName 'contact'/'owner' OR @type Contact OR @id startswith /api/contacts/ OR (id AND name).
      // So { id: 1, customField: 'Value' } should NOT be a contact ref.

      const { container } = renderWithRouter(formatChangeValue(obj, 'en'))
      // Should render JSON of remaining fields
      expect(container).toHaveTextContent('customField')
      expect(container).toHaveTextContent('Value')
      expect(container).not.toHaveTextContent('"id"')
      expect(container).not.toHaveTextContent('@id')
    })
  })
})
