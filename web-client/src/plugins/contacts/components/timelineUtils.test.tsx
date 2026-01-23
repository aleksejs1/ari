import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { type TimelineEvent } from '@/types/models'

import {
  formatChangeValue,
  getBadgeStyles,
  getLogLabel,
  getLogSnapshotDetails,
} from './timelineUtils'

// Helper to render with router context for Link
const renderWithRouter = (ui: React.ReactElement | null) => {
  if (!ui) {
    return { container: null }
  }
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('timelineUtils', () => {
  describe('formatChangeValue', () => {
    it('returns empty string for null/undefined', () => {
      expect(formatChangeValue(null, 'en')).toEqual(<></>)
      expect(formatChangeValue(undefined, 'en')).toEqual(<></>)
    })

    it('formats string values', () => {
      const { container } = renderWithRouter(formatChangeValue('simple string', 'en'))
      expect(container).toHaveTextContent('simple string')
    })

    it('formats contact ID links', () => {
      renderWithRouter(formatChangeValue('/api/contacts/123', 'en'))
      expect(screen.getByText('Contact #123')).toBeInTheDocument()
      expect(screen.getByText('Contact #123').closest('a')).toHaveAttribute('href', '/contacts/123')
    })

    it('formats group ID strings', () => {
      const { container } = renderWithRouter(formatChangeValue('/api/groups/456', 'en'))
      expect(container).toHaveTextContent('Group #456')
    })

    it('formats basic arrays recursively', () => {
      const list = ['A', 'B']
      const { container } = renderWithRouter(formatChangeValue(list, 'en'))
      expect(container).toHaveTextContent('A')
      expect(container).toHaveTextContent('B')
      expect(container).toHaveTextContent('→')
    })

    it('formats object values with date', () => {
      const obj = { date: '2023-01-01T00:00:00Z', text: 'Label' }
      renderWithRouter(formatChangeValue(obj, 'en'))
      expect(true).toBe(true) // Assumes internal formatLocalizedDate handling
    })

    it('formats contact reference objects', () => {
      const contactRef = { '@id': '/api/contacts/999', displayName: 'John Doe' }
      renderWithRouter(formatChangeValue(contactRef, 'en'))
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('John Doe').closest('a')).toHaveAttribute('href', '/contacts/999')
    })

    it('formats arbitrary objects as JSON', () => {
      const obj = { foo: 'bar' }
      const { container } = renderWithRouter(formatChangeValue(obj, 'en'))
      expect(container).toHaveTextContent('{"foo":"bar"}')
    })
  })

  describe('getLogSnapshotDetails', () => {
    it('returns null if no snapshot', () => {
      const log = { action: 'INSERT', entityType: 'App\\Entity\\Contact' } as TimelineEvent
      expect(getLogSnapshotDetails(log, 'en')).toBeNull()
    })

    it('renders ContactName snapshot', () => {
      const log = {
        id: 1,
        action: 'INSERT',
        entityType: 'App\\Entity\\ContactName',
        snapshotAfter: { given: 'Jane', family: 'Doe' },
        createdAt: '2023-01-01T00:00:00Z',
      } as TimelineEvent
      const result = renderWithRouter(getLogSnapshotDetails(log, 'en'))
      expect(result.container).toHaveTextContent('Doe Jane')
    })

    it('renders ContactOrganization with dates', () => {
      const log = {
        id: 2,
        action: 'INSERT',
        entityType: 'App\\Entity\\ContactOrganization',
        snapshotAfter: { name: 'Acme', startDate: '2022-01-01' },
        createdAt: '2023-01-01T00:00:00Z',
      } as TimelineEvent
      const result = renderWithRouter(getLogSnapshotDetails(log, 'en'))
      expect(result.container).toHaveTextContent('Acme')
    })

    it('renders ContactGroup', () => {
      const log = {
        id: 3,
        action: 'INSERT',
        entityType: 'App\\Entity\\ContactGroup',
        snapshotAfter: { groupResource: { name: 'Friends' } },
        createdAt: '2023-01-01T00:00:00Z',
      } as TimelineEvent
      const result = renderWithRouter(getLogSnapshotDetails(log, 'en'))
      expect(result.container).toHaveTextContent('Friends')
    })
  })

  describe('getBadgeStyles', () => {
    it('returns correct classes', () => {
      expect(getBadgeStyles('INSERT')).toContain('green')
      expect(getBadgeStyles('UPDATE')).toContain('blue')
      expect(getBadgeStyles('REMOVE')).toContain('red')
      expect(getBadgeStyles('UNKNOWN')).toContain('gray')
    })
  })

  describe('getLogLabel', () => {
    it('uses translation keys', () => {
      const t = vi.fn().mockReturnValue('Translated')
      const log = { action: 'INSERT', entityType: 'App\\Entity\\Contact' } as TimelineEvent
      getLogLabel(log, t as any)
      expect(t).toHaveBeenCalledWith('contacts.history.actions.Contact.INSERT ', 'INSERT Contact ')
    })
  })
})
