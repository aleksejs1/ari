import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { TimelineEvent } from '@/types/models'

import { LogList } from './LogList'

// Mock LogItem to simplify testing
vi.mock('./LogItem', () => ({
  LogItem: ({ log }: { log: TimelineEvent }) => <div data-testid="log-item">Log ID: {log.id}</div>,
}))

describe('LogList', () => {
  it('renders "No logs" message when logs array is empty', () => {
    render(<LogList logs={[]} isPlaceholderData={false} language="en" />)
    expect(screen.getByText('auditLogs.noLogs')).toBeInTheDocument()
  })

  it('renders list of LogItems when logs are provided', () => {
    const mockLogs: TimelineEvent[] = [
      { id: 1, action: 'create', entity: 'contact', timestamp: '2023-01-01' } as any,
      { id: 2, action: 'update', entity: 'contact', timestamp: '2023-01-02' } as any,
    ]

    render(<LogList logs={mockLogs} isPlaceholderData={false} language="en" />)
    expect(screen.getAllByTestId('log-item')).toHaveLength(2)
    expect(screen.getByText('Log ID: 1')).toBeInTheDocument()
    expect(screen.getByText('Log ID: 2')).toBeInTheDocument()
  })

  it('applies opacity class when isPlaceholderData is true', () => {
    const { container } = render(
      <LogList logs={[{ id: 1 } as any]} isPlaceholderData language="en" />,
    )
    // Check for parent div with opacity-50
    expect(container.firstChild).toHaveClass('opacity-50')
  })
})
