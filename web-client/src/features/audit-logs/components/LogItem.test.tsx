import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LogItem } from './LogItem'

import { type TimelineEvent } from '@/types/models'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}))

const createWrapper = () => {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <BrowserRouter>{children}</BrowserRouter>
  }
}

describe('LogItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders log item with INSERT action', () => {
    const log: TimelineEvent = {
      id: 1,
      action: 'INSERT',
      entityType: 'App\\Entity\\Contact',
      entityId: 123,
      createdAt: '2024-01-15T10:30:00Z',
    }

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <LogItem log={log} language="en" />
      </Wrapper>,
    )

    // Fallback format when translation key is returned
    expect(screen.getByText('INSERT Contact')).toBeInTheDocument()
  })

  it('renders log item with UPDATE action and changes', () => {
    const log: TimelineEvent = {
      id: 2,
      action: 'UPDATE',
      entityType: 'App\\Entity\\ContactName',
      entityId: 456,
      createdAt: '2024-01-15T11:00:00Z',
      changes: {
        given: 'John',
        family: 'Doe',
      },
    }

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <LogItem log={log} language="en" />
      </Wrapper>,
    )

    expect(screen.getByText('given:')).toBeInTheDocument()
    expect(screen.getByText('John')).toBeInTheDocument()
  })

  it('renders log item with REMOVE action and snapshotBefore', () => {
    const log: TimelineEvent = {
      id: 3,
      action: 'REMOVE',
      entityType: 'App\\Entity\\ContactEmail',
      entityId: 100,
      createdAt: '2024-01-15T12:00:00Z',
      snapshotBefore: {
        email: 'test@example.com',
        type: 'work',
      },
    }

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <LogItem log={log} language="en" />
      </Wrapper>,
    )

    expect(screen.getByText('auditLogs.snapshotBeforeRemoval')).toBeInTheDocument()
    expect(screen.getByText('email:')).toBeInTheDocument()
  })

  it('renders log item with INSERT action and snapshotAfter', () => {
    const log: TimelineEvent = {
      id: 4,
      action: 'INSERT',
      entityType: 'App\\Entity\\ContactPhone',
      entityId: 200,
      createdAt: '2024-01-15T13:00:00Z',
      snapshotAfter: {
        phone: '+1234567890',
        type: 'mobile',
      },
    }

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <LogItem log={log} language="en" />
      </Wrapper>,
    )

    expect(screen.getByText('auditLogs.snapshotAfterInsertion')).toBeInTheDocument()
    expect(screen.getByText('phone:')).toBeInTheDocument()
  })

  it('shows contact navigation buttons for contact-related logs', () => {
    const log: TimelineEvent = {
      id: 5,
      action: 'UPDATE',
      entityType: 'App\\Entity\\ContactName',
      entityId: 300,
      ownerEntityType: 'App\\Entity\\Contact',
      ownerEntityId: 999,
      createdAt: '2024-01-15T14:00:00Z',
    }

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <LogItem log={log} language="en" />
      </Wrapper>,
    )

    expect(screen.getByText('common.viewDetails')).toBeInTheDocument()
    expect(screen.getByText('auditLogs.timeline')).toBeInTheDocument()
  })

  it('shows entity ID for non-contact logs', () => {
    const log: TimelineEvent = {
      id: 6,
      action: 'INSERT',
      entityType: 'App\\Entity\\Group',
      entityId: 500,
      createdAt: '2024-01-15T15:00:00Z',
    }

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <LogItem log={log} language="en" />
      </Wrapper>,
    )

    expect(screen.getByText('#500')).toBeInTheDocument()
  })
})
