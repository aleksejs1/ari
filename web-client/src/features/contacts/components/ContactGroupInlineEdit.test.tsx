import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { ContactGroupInlineEdit } from './ContactGroupInlineEdit'

// Mock components that might be problematic in tests
vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('ContactGroupInlineEdit', () => {
  const mockGroups = [
    { '@id': '/api/groups/1', name: 'Group 1' },
    { '@id': '/api/groups/2', name: 'Group 2' },
  ] as { '@id': string; name: string }[]

  const mockContact = {
    '@id': '/api/contacts/1',
    contactGroups: [{ groupResource: '/api/groups/1' }],
  } as Partial<Contact>

  const onUpdate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders group labels correctly', () => {
    render(<ContactGroupInlineEdit contact={mockContact} groups={mockGroups} onUpdate={onUpdate} />)

    expect(screen.getByText('Group 1')).toBeInTheDocument()
    expect(screen.queryByText('Group 2')).not.toBeInTheDocument()
  })

  it('opens popover and shows all groups', async () => {
    const user = userEvent.setup()
    render(<ContactGroupInlineEdit contact={mockContact} groups={mockGroups} onUpdate={onUpdate} />)

    // Hover to show edit button (or just click it if visible/in DOM even if opacity 0)
    // The InlineEditTrigger button has aria-label="Edit Groups" or similar.
    // Let's check the label in InlineEditTrigger: t(isExistent ? 'common.edit' : 'common.add', { item: label })
    // isExistent is true (has groups). label is "Groups".
    // So "Edit Groups".

    // Note: InlineEditTrigger uses standard Radix Popover.
    // Button is opacity 0 but clickable.
    const editButton = screen.getByRole('button', { name: /Edit/i })
    await user.click(editButton)

    expect(screen.getAllByRole('checkbox')).toHaveLength(2)
    expect(screen.getByLabelText('Group 1')).toBeChecked()
    expect(screen.getByLabelText('Group 2')).not.toBeChecked()
  })

  it('allows toggling groups and saving', async () => {
    const user = userEvent.setup()
    render(<ContactGroupInlineEdit contact={mockContact} groups={mockGroups} onUpdate={onUpdate} />)

    await user.click(screen.getByRole('button', { name: /Edit/i }))

    // Toggle Group 2
    await user.click(screen.getByLabelText('Group 2'))
    expect(screen.getByLabelText('Group 2')).toBeChecked()

    // Toggle Group 1 off
    await user.click(screen.getByLabelText('Group 1'))
    expect(screen.getByLabelText('Group 1')).not.toBeChecked()

    // Save
    await user.click(screen.getByRole('button', { name: 'common.save' }))

    expect(onUpdate).toHaveBeenCalledWith(mockContact, ['/api/groups/2'])
  })

  it('resets selection on reopen if not saved', async () => {
    const user = userEvent.setup()
    render(<ContactGroupInlineEdit contact={mockContact} groups={mockGroups} onUpdate={onUpdate} />)

    await user.click(screen.getByRole('button', { name: /Edit/i }))
    await user.click(screen.getByLabelText('Group 2'))

    // Cancel or close (click outside or cancel button)
    await user.click(screen.getByRole('button', { name: 'common.cancel' }))

    expect(onUpdate).not.toHaveBeenCalled()

    // Reopen
    await user.click(screen.getByRole('button', { name: /Edit/i }))
    expect(screen.getByLabelText('Group 1')).toBeChecked()
    expect(screen.getByLabelText('Group 2')).not.toBeChecked()
  })
})
