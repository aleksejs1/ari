import { type UseMutationResult } from '@tanstack/react-query'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useCreateGroup, useUpdateGroup } from '../useGroups'

import { GroupDialog } from './GroupDialog'

// Mock hooks
vi.mock('../useGroups', () => ({
  useCreateGroup: vi.fn(),
  useUpdateGroup: vi.fn(),
}))

// Mock translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
  }),
}))

// Mock dialog components (radix-ui implementation can be tricky to test without full setup, so we mock the primitives if needed,
// but since we use our own UI components which wrap radix, we might rely on the existing setup or shallow rendering.
// However, the `Dialog` component uses portals. `render` handles portals fine usually.
// If issues arise, we might need to mock the `Dialog` components or use `userEvent`.
// For now, let's try testing with the real UI components assuming they work in JSDOM.

describe('GroupDialog', () => {
  const mockOnOpenChange = vi.fn()
  const mockCreateMutate = vi.fn()
  const mockUpdateMutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCreateGroup).mockReturnValue({
      mutateAsync: mockCreateMutate,
      isPending: false,
    } as unknown as UseMutationResult<unknown, unknown, unknown, unknown>)
    vi.mocked(useUpdateGroup).mockReturnValue({
      mutateAsync: mockUpdateMutate,
      isPending: false,
    } as unknown as UseMutationResult<unknown, unknown, unknown, unknown>)
  })

  it('renders create mode correctly', () => {
    render(<GroupDialog open onOpenChange={mockOnOpenChange} group={null} />)

    expect(screen.getByText('Create Group')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByText('Create')).toBeInTheDocument()
  })

  it('renders edit mode correctly', () => {
    const group = {
      id: 1,
      name: 'Test Group',
      color: '#ff0000',
      '@id': '/groups/1',
      '@type': 'Group',
    }
    render(<GroupDialog open onOpenChange={mockOnOpenChange} group={group} />)

    expect(screen.getByText('Edit Group')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Group')).toBeInTheDocument()
    // Both color input and text input have the same value
    expect(screen.getAllByDisplayValue('#ff0000')).toHaveLength(2)
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('validates form submission', async () => {
    render(<GroupDialog open onOpenChange={mockOnOpenChange} group={null} />)

    fireEvent.click(screen.getByText('Create'))

    await waitFor(() => {
      // In a real form, this would show a validation error.
      // Our UI Input logic might show HTML5 validation or hook-form errors.
      // Hook form usually shows text.
      // The schema says name is required.
      // We look for error message.
      // Assuming hook form adds text to the DOM.
      expect(screen.getByText('Name is required')).toBeInTheDocument()
    })

    expect(mockCreateMutate).not.toHaveBeenCalled()
  })

  it('submits create form successfully', async () => {
    render(<GroupDialog open onOpenChange={mockOnOpenChange} group={null} />)

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Group' } })
    fireEvent.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(mockCreateMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Group',
        }),
      )
    })

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('submits update form successfully', async () => {
    const group = {
      id: 1,
      name: 'Old Name',
      color: '#ffffff',
      '@id': '/groups/1',
      '@type': 'Group',
    }
    render(<GroupDialog open onOpenChange={mockOnOpenChange} group={group} />)

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Updated Name' } })
    fireEvent.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(mockUpdateMutate).toHaveBeenCalledWith({
        id: 1,
        data: expect.objectContaining({ name: 'Updated Name' }),
      })
    })

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })
})
