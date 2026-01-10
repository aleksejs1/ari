import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { useDeleteGroup } from '../useGroups'

import { GroupsTable } from './GroupsTable'

import type { Group } from '@/types/models'

vi.mock('../useGroups', () => ({
  useDeleteGroup: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false } as any)),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
  }),
}))

describe('GroupsTable', () => {
  const mockGroups: Group[] = [
    { '@id': '/groups/1', '@type': 'Group', id: 1, name: 'Family', color: '#ff0000' },
  ]
  const mockOnEdit = vi.fn()
  const mockDeleteMutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
      ; (useDeleteGroup as any).mockReturnValue({
        mutateAsync: mockDeleteMutate,
        isPending: false,
      })
  })

  it('renders groups', () => {
    render(<GroupsTable groups={mockGroups} onEdit={mockOnEdit} />)
    expect(screen.getByText('Family')).toBeInTheDocument()
    // Color circle? Checking style is hard, maybe check if element exists
    // The component renders a div with style backgroundColor.
  })

  it('renders empty state', () => {
    render(<GroupsTable groups={[]} onEdit={mockOnEdit} />)
    expect(screen.getByText('No groups found.')).toBeInTheDocument()
  })

  it('calls onEdit when edit button click', () => {
    render(<GroupsTable groups={mockGroups} onEdit={mockOnEdit} />)
    // Find edit button (lucide Edit icon is rendered, usually wrapped in button)
    // We can find by role button or traverse.
    // The button has `onClick={() => onEdit(group)}`.
    // The row has 2 buttons: Edit and Trash.
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0]) // First button is edit
    expect(mockOnEdit).toHaveBeenCalledWith(mockGroups[0])
  })

  it('calls delete when trash button click and confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<GroupsTable groups={mockGroups} onEdit={mockOnEdit} />)

    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[1]) // Second button is delete

    expect(window.confirm).toHaveBeenCalled()
    expect(mockDeleteMutate).toHaveBeenCalledWith(1)
  })
})
