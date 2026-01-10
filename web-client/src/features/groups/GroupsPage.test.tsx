import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import GroupsPage from './GroupsPage'
import { useGroups, useCreateGroup, useUpdateGroup, useDeleteGroup } from './useGroups'

import type { Group } from '@/types/models'

// Mock the hooks
vi.mock('./useGroups', () => ({
  useGroups: vi.fn(),
  useCreateGroup: vi.fn(),
  useUpdateGroup: vi.fn(),
  useDeleteGroup: vi.fn(),
}))

// Mock components to simplify testing
vi.mock('./components/GroupsTable', () => ({
  GroupsTable: ({ groups, onEdit }: { groups: Group[]; onEdit: (g: Group) => void }) => (
    <div data-testid="groups-table">
      {groups.map((g) => (
        <div key={g.id} data-testid={`group-${g.id}`}>
          {g.name}
          <button onClick={() => onEdit(g)}>Edit</button>
        </div>
      ))}
    </div>
  ),
}))

vi.mock('./components/GroupDialog', () => ({
  GroupDialog: ({ open, group }: { open: boolean; group?: Group }) => (
    <div data-testid="group-dialog">
      Dialog: {open ? 'Open' : 'Closed'}
      {group ? ` - Editing: ${group.name}` : ' - Creating'}
    </div>
  ),
}))

describe('GroupsPage', () => {
  const mockGroups: Group[] = [
    { '@id': '/api/groups/1', '@type': 'Group', id: 1, name: 'Family', color: '#ff0000' },
    { '@id': '/api/groups/2', '@type': 'Group', id: 2, name: 'Work', color: '#0000ff' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCreateGroup).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any)
    vi.mocked(useUpdateGroup).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any)
    vi.mocked(useDeleteGroup).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any)
  })

  it('renders loading state', () => {
    vi.mocked(useGroups).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any)

    render(
      <MemoryRouter>
        <GroupsPage />
      </MemoryRouter>,
    )

    // Check for spinner or loading indicator logic (Loader2 is used in GroupsPage)
    // The implementation uses Loader2 but no text. We can check for the svg or class.
    // However, it's easier to check that the table is NOT present.
    expect(screen.queryByTestId('groups-table')).not.toBeInTheDocument()
  })

  it('renders error state', () => {
    vi.mocked(useGroups).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Error'),
    } as any)

    render(
      <MemoryRouter>
        <GroupsPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('errors.failedToLoadGroups')).toBeInTheDocument()
  })

  it('renders groups list', () => {
    vi.mocked(useGroups).mockReturnValue({
      data: mockGroups,
      isLoading: false,
      error: null,
    } as any)

    render(
      <MemoryRouter>
        <GroupsPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('groups.title')).toBeInTheDocument()
    expect(screen.getByTestId('groups-table')).toBeInTheDocument()
    expect(screen.getByText('Family')).toBeInTheDocument()
    expect(screen.getByText('Work')).toBeInTheDocument()
  })

  it('opens create dialog', () => {
    vi.mocked(useGroups).mockReturnValue({
      data: mockGroups,
      isLoading: false,
      error: null,
    } as any)

    render(
      <MemoryRouter>
        <GroupsPage />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('groups.createGroup'))

    expect(screen.getByTestId('group-dialog')).toHaveTextContent('Dialog: Open - Creating')
  })

  it('opens edit dialog', () => {
    vi.mocked(useGroups).mockReturnValue({
      data: mockGroups,
      isLoading: false,
      error: null,
    } as any)

    render(
      <MemoryRouter>
        <GroupsPage />
      </MemoryRouter>,
    )

    // Click edit on the first group
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    expect(screen.getByTestId('group-dialog')).toHaveTextContent('Dialog: Open - Editing: Family')
  })
})
