import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LogList } from './LogList'

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

describe('LogList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty state when no logs', () => {
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <LogList logs={[]} isPlaceholderData={false} language="en" />
      </Wrapper>,
    )

    expect(screen.getByText('auditLogs.noLogs')).toBeInTheDocument()
  })

  it('renders list of logs', () => {
    const logs: TimelineEvent[] = [
      {
        id: 1,
        action: 'INSERT',
        entityType: 'App\\Entity\\Contact',
        entityId: 100,
        createdAt: '2024-01-15T10:30:00Z',
      },
      {
        id: 2,
        action: 'UPDATE',
        entityType: 'App\\Entity\\ContactName',
        entityId: 200,
        ownerEntityType: 'App\\Entity\\Contact',
        ownerEntityId: 50,
        createdAt: '2024-01-15T11:00:00Z',
      },
    ]

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <LogList logs={logs} isPlaceholderData={false} language="en" />
      </Wrapper>,
    )

    // Fallback format when translation key is returned
    expect(screen.getByText('INSERT Contact')).toBeInTheDocument()
    expect(screen.getByText('UPDATE ContactName')).toBeInTheDocument()
  })

  it('applies opacity class when isPlaceholderData is true', () => {
    const logs: TimelineEvent[] = [
      {
        id: 1,
        action: 'INSERT',
        entityType: 'App\\Entity\\Contact',
        entityId: 100,
        createdAt: '2024-01-15T10:30:00Z',
      },
    ]

    const Wrapper = createWrapper()
    const { container } = render(
      <Wrapper>
        <LogList logs={logs} isPlaceholderData language="en" />
      </Wrapper>,
    )

    expect(container.querySelector('.opacity-50')).toBeInTheDocument()
  })

  it('does not apply opacity class when isPlaceholderData is false', () => {
    const logs: TimelineEvent[] = [
      {
        id: 1,
        action: 'INSERT',
        entityType: 'App\\Entity\\Contact',
        entityId: 100,
        createdAt: '2024-01-15T10:30:00Z',
      },
    ]

    const Wrapper = createWrapper()
    const { container } = render(
      <Wrapper>
        <LogList logs={logs} isPlaceholderData={false} language="en" />
      </Wrapper>,
    )

    expect(container.querySelector('.opacity-50')).not.toBeInTheDocument()
  })
})
