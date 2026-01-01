import { type UseMutationResult, type UseQueryResult } from '@tanstack/react-query'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import NotificationChannelsPage from './NotificationChannelsPage'
import {
  useNotificationChannels,
  useCreateNotificationChannel,
  useUpdateNotificationChannel,
  useDeleteNotificationChannel,
} from './useNotificationChannels'

import type { NotificationChannel } from '@/types/models'

// Mock the hook
vi.mock('./useNotificationChannels', () => ({
  useNotificationChannels: vi.fn(),
  useDeleteNotificationChannel: vi.fn(),
  useCreateNotificationChannel: vi.fn(),
  useUpdateNotificationChannel: vi.fn(),
}))

vi.mock('../contacts/components/ContactsTable', () => ({
  ContactsTable: () => <div />,
}))

// Mock Sub Components to avoid deep rendering issues
vi.mock('./components/NotificationChannelsTable', () => ({
  NotificationChannelsTable: ({ data }: { data: NotificationChannel[] }) => (
    <div data-testid="channels-table">
      {data?.map((c) => (
        <div key={c.id}>{c.type}</div>
      ))}
    </div>
  ),
}))

vi.mock('./components/NotificationChannelForm', () => ({
  NotificationChannelForm: ({ onSubmit }: { onSubmit: () => void }) => (
    <button onClick={() => onSubmit()}>Mock Form Submit</button>
  ),
}))

vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="sheet">{children}</div> : null,
  SheetContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-content">{children}</div>
  ),
  SheetHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('NotificationChannelsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCreateNotificationChannel).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as unknown as UseMutationResult<unknown, unknown, unknown, unknown>)
    vi.mocked(useUpdateNotificationChannel).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as unknown as UseMutationResult<unknown, unknown, unknown, unknown>)
    vi.mocked(useDeleteNotificationChannel).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as unknown as UseMutationResult<unknown, unknown, unknown, unknown>)
  })

  it('renders loading state', () => {
    vi.mocked(useNotificationChannels).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as unknown as UseQueryResult<unknown, unknown>)

    render(
      <MemoryRouter>
        <NotificationChannelsPage />
      </MemoryRouter>,
    )

    // Check for spinner
    // In NotificationChannelsPage, it returns a Loader2 if loading.
    // Check for spinner
    // In NotificationChannelsPage, it returns a Loader2 if loading.
    // const spinner = document.querySelector('.animate-spin')
    // Or we can check if table is absent
    expect(screen.queryByTestId('channels-table')).not.toBeInTheDocument()
  })

  it('renders error state', () => {
    vi.mocked(useNotificationChannels).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Error'),
    } as unknown as UseQueryResult<unknown, unknown>)

    render(
      <MemoryRouter>
        <NotificationChannelsPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('notificationChannels.error')).toBeInTheDocument()
  })

  it('renders channels table', () => {
    const mockChannels = [
      { '@id': '/ch/1', '@type': 'NotificationChannel', id: 1, type: 'telegram' },
    ] as NotificationChannel[]

    vi.mocked(useNotificationChannels).mockReturnValue({
      data: { member: mockChannels },
      isLoading: false,
      error: null,
    } as unknown as UseQueryResult<unknown, unknown>)

    render(
      <MemoryRouter>
        <NotificationChannelsPage />
      </MemoryRouter>,
    )

    expect(screen.getByTestId('channels-table')).toBeInTheDocument()
    expect(screen.getByText('telegram')).toBeInTheDocument()
  })

  it('opens and closes dialog', async () => {
    vi.mocked(useNotificationChannels).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as unknown as UseQueryResult<unknown, unknown>)

    render(
      <MemoryRouter>
        <NotificationChannelsPage />
      </MemoryRouter>,
    )

    // Click Add
    fireEvent.click(screen.getByText('notificationChannels.add'))

    // Check dialog content (mocked form)
    expect(screen.getByText('Mock Form Submit')).toBeInTheDocument()

    // Simulate success closes dialog
    fireEvent.click(screen.getByText('Mock Form Submit'))

    // Dialog should be closed (mock form unmounted)
    await waitFor(() => {
      expect(screen.queryByText('Mock Form Submit')).not.toBeInTheDocument()
    })
  })
})
