import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import type { Contact, Group } from '@/types/models'

import { ContactGroupInlineEdit } from './ContactGroupInlineEdit'

// Mock components that might be problematic in tests
vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('ContactGroupInlineEdit', () => {
  const mockGroups = [
    { '@id': '/api/groups/1', name: 'Group 1' },
    { '@id': '/api/groups/2', name: 'Group 2' },
  ] as Group[]

  const mockContact = {
    '@id': '/api/contacts/1',
    contactGroups: [{ groupResource: '/api/groups/1' }],
  } as unknown as Contact // Use unknown first to cast to Partial<Contact> not straightforward with deep types

  const onUpdate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders group labels correctly', () => {
    render(<ContactGroupInlineEdit contact={mockContact} groups={mockGroups} onUpdate={onUpdate} />)

    expect(screen.getByText('Group 1')).toBeInTheDocument()
    expect(screen.queryByText('Group 2')).not.toBeInTheDocument()
  })

  it('renders colored badges when group has color', () => {
    const coloredGroups = [
      { '@id': '/api/groups/3', name: 'Red Group', color: '#ff0000' },
    ] as Group[]

    const coloredContact = {
      '@id': '/api/contacts/2',
      contactGroups: [{ groupResource: '/api/groups/3' }],
    } as unknown as Contact

    render(
      <ContactGroupInlineEdit
        contact={coloredContact}
        groups={coloredGroups}
        onUpdate={onUpdate}
      />,
    )

    const badge = screen.getByText('Red Group')
    // hex colors are often normalized to rgb in styles, but inline styles usually persist.
    // However, we are checking style prop or class.
    expect(badge).toHaveStyle({ backgroundColor: '#ff0000' })
    expect(badge.style.color).toBe('rgb(255, 255, 255)')
  })

  it('renders dark text on light group colors', () => {
    const lightGroups = [
      { '@id': '/api/groups/4', name: 'Light Group', color: '#ffff00' }, // Yellow
    ] as Group[]

    const lightContact = {
      '@id': '/api/contacts/3',
      contactGroups: [{ groupResource: '/api/groups/4' }],
    } as unknown as Contact

    render(
      <ContactGroupInlineEdit contact={lightContact} groups={lightGroups} onUpdate={onUpdate} />,
    )

    const badge = screen.getByText('Light Group')
    // The contrasting color for yellow (#ffff00) should be a dark shade (not white)
    expect(badge).toHaveStyle({ backgroundColor: '#ffff00' })
    expect(badge.style.color).not.toBe('rgb(255, 255, 255)')
    expect(badge.style.color).not.toBe('#ffffff')
    expect(badge).not.toHaveClass('text-white')
  })

  it('opens popover and shows all groups', async () => {
    const user = userEvent.setup()
    render(<ContactGroupInlineEdit contact={mockContact} groups={mockGroups} onUpdate={onUpdate} />)

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
