import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import GroupsPage from './GroupsPage'
import * as useGroupsHooks from './useGroups'

import { TestWrapper } from '@/test/setup'

// Mock the hooks
vi.mock('./useGroups', () => ({
  useGroups: vi.fn(),
  useCreateGroup: vi.fn(),
  useUpdateGroup: vi.fn(),
  useDeleteGroup: vi.fn(),
}))

describe('GroupsPage', () => {
  const mockGroups = [
    { id: 1, name: 'Family', color: '#ff0000' },
    { id: 2, name: 'Friends', color: '#00ff00' },
  ]

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(useGroupsHooks.useGroups).mockReturnValue({
      data: mockGroups,
      isLoading: false,
      error: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    vi.mocked(useGroupsHooks.useCreateGroup).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    vi.mocked(useGroupsHooks.useUpdateGroup).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    vi.mocked(useGroupsHooks.useDeleteGroup).mockReturnValue({
      mutateAsync: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  })

  it('renders loading state', () => {
    vi.mocked(useGroupsHooks.useGroups).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    render(<GroupsPage />, { wrapper: TestWrapper })
    // Loader is an icon, might not have text, checking generic structure or class could be hard without aria-label.
    // However, GroupsPage returns a div with "animate-spin" class on Loader2.
    // Let's just check if it doesn't crash and doesn't show "failed".
    const loader = document.querySelector('.animate-spin')
    expect(loader).toBeInTheDocument()
  })

  it('renders error state', () => {
    vi.mocked(useGroupsHooks.useGroups).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    render(<GroupsPage />, { wrapper: TestWrapper })
    expect(screen.getByText('errors.failedToLoadGroups')).toBeInTheDocument()
  })

  it('renders group list', () => {
    render(<GroupsPage />, { wrapper: TestWrapper })
    expect(screen.getByText('groups.title')).toBeInTheDocument()
    expect(screen.getByText('Family')).toBeInTheDocument()
    expect(screen.getByText('Friends')).toBeInTheDocument()
  })

  it('opens create dialog', async () => {
    render(<GroupsPage />, { wrapper: TestWrapper })
    // The query might find multiple if relying on text alone if key is same as content?
    // t('groups.createGroup', 'Create Group')
    // Button has 'groups.createGroup'.
    // `getAllByText` returns array.

    // safe approach:
    const createButton = screen.getAllByText('groups.createGroup')[0]
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('groups.createGroup')).toBeInTheDocument()
  })
})
