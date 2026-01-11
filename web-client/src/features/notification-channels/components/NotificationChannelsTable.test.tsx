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
    {
      '@id': '/ch/2',
      id: 2,
      type: 'telegram' as const,
      verifiedAt: '2023-01-01T00:00:00Z',
    },
    {
      '@id': '/ch/2',
      id: 2,
      type: 'telegram' as const,
      config: { chatId: '', mapping: '123' },
      verifiedAt: '2023-01-01T00:00:00Z',
    },
    {
      '@id': '/ch/3',
      id: 3,
      type: 'telegram' as const,
      config: { chatId: '456', mapping: '456' },
      verifiedAt: '2023-01-01T00:00:00Z',
    },
    {
      '@id': '/ch/4',
      id: 4,
      type: 'web' as const,
      config: {},
      verifiedAt: '2023-01-01T00:00:00Z',
    },
  ]
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()

  it('renders channels', () => {
    render(
      <NotificationChannelsTable data={mockData} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    )
    expect(screen.getAllByText(/telegram/i)[0]).toBeInTheDocument()
    expect(screen.queryByText('notificationChannels.verified')).not.toBeInTheDocument()
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

  it('renders activate button only when chatId is empty', () => {
    render(
      <NotificationChannelsTable data={mockData} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    )
    const activateButtons = screen.getAllByText('notificationChannels.activate')
    expect(activateButtons).toHaveLength(1) // Only for ch/2 which has empty chatId

    const activateButton = activateButtons[0].closest('a')
    expect(activateButton).toHaveAttribute(
      'href',
      'https://t.me/ari_crm_test_notifications_bot?start=123_2',
    )
  })

  it('renders checkmark for web channel and configured telegram channel', () => {
    render(
      <NotificationChannelsTable data={mockData} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    )
    // We expect 2 green checkmarks (one for web, one for fully configured telegram)
    // The simplified check is to look for the class or element.
    const checkmarks = document.querySelectorAll('.text-green-500')
    expect(checkmarks).toHaveLength(3)
  })
})
