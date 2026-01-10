import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { NotificationChannelsTable } from './NotificationChannelsTable'

import type { NotificationChannel } from '@/types/models'

describe('NotificationChannelsTable', () => {
  const mockData: NotificationChannel[] = [
    {
      '@id': '/ch/1',
      id: 1,
      type: 'telegram' as const,
      config: { chatId: '123' },
      verifiedAt: '2023-01-01T00:00:00Z',
    },
  ]
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()

  it('renders channels', () => {
    render(
      <NotificationChannelsTable data={mockData} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    )
    expect(screen.getByText('telegram')).toBeInTheDocument()
    expect(screen.getByText('notificationChannels.verified')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    render(<NotificationChannelsTable data={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />)
    expect(screen.getByText('notificationChannels.noChannels')).toBeInTheDocument()
  })

  it('calls onEdit', () => {
    render(
      <NotificationChannelsTable data={mockData} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    )
    const buttons = screen.getAllByRole('button')
    // Edit is first
    fireEvent.click(buttons[0])
    expect(mockOnEdit).toHaveBeenCalledWith(mockData[0])
  })

  it('calls onDelete', () => {
    render(
      <NotificationChannelsTable data={mockData} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    )
    const buttons = screen.getAllByRole('button')
    // Delete is second
    fireEvent.click(buttons[1])
    expect(mockOnDelete).toHaveBeenCalledWith(mockData[0])
  })
})
