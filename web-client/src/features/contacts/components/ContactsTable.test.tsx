import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { useGroups } from '../useContacts'

import { ContactsTable } from './ContactsTable'

import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import type { Contact } from '@/types/models'

// Mock useContacts
vi.mock('../useContacts', () => ({
  useGroups: vi.fn(),
  useUpdateContact: vi.fn().mockReturnValue({ mutate: vi.fn() }),
  useCreateGroup: vi.fn().mockReturnValue({ mutateAsync: vi.fn() }),
  usePatchContact: vi.fn().mockReturnValue({ mutate: vi.fn() }),
}))

// Mock useUserPrefs
vi.mock('@/hooks/useUserPrefs.hook', () => ({
  useUserPrefs: vi.fn(),
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('ContactsTable', () => {
  beforeEach(() => {
    vi.mocked(useGroups).mockReturnValue({ data: [] } as unknown as ReturnType<typeof useGroups>)
    ;(useUserPrefs as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      formatDate: (date: string) => new Date(date).toLocaleDateString('en-US'),
    })
  })

  const mockData: Contact[] = [
    {
      '@id': '/api/contacts/1',
      id: 1,
      '@type': 'Contact',
      contactNames: [
        { '@id': '/api/cn/1', '@type': 'ContactName', given: 'Alice', family: 'Smith' },
      ],
      contactDates: [
        { '@id': '/api/cd/1', '@type': 'ContactDate', date: '2023-01-01', text: 'Birthday' },
      ],
    },
    {
      '@id': '/api/contacts/2',
      id: 2,
      '@type': 'Contact',
      contactNames: [{ '@id': '/api/cn/2', '@type': 'ContactName', given: 'Bob' }], // No family name
      contactDates: [],
    },
  ]

  it('renders empty state', () => {
    render(
      <MemoryRouter>
        <ContactsTable
          data={[]}
          onEdit={vi.fn()}
          onUpdateDate={vi.fn()}
          onDeleteDate={vi.fn()}
          onUpdateGroups={vi.fn()}
          onUpdateEmail={vi.fn()}
          onDeleteEmail={vi.fn()}
          onUpdatePhone={vi.fn()}
          onDeletePhone={vi.fn()}
          onUpdateName={vi.fn()}
          onDeleteName={vi.fn()}
        />
      </MemoryRouter>,
    )
    expect(screen.getByText('contacts.noContacts')).toBeInTheDocument()
  })

  it('renders data correctly', () => {
    render(
      <MemoryRouter>
        <ContactsTable
          data={mockData}
          onEdit={vi.fn()}
          onUpdateDate={vi.fn()}
          onDeleteDate={vi.fn()}
          onUpdateGroups={vi.fn()}
          onUpdateEmail={vi.fn()}
          onDeleteEmail={vi.fn()}
          onUpdatePhone={vi.fn()}
          onDeletePhone={vi.fn()}
          onUpdateName={vi.fn()}
          onDeleteName={vi.fn()}
        />
      </MemoryRouter>,
    )

    expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    // Using substring match or regex for date as formatting might depend on locale
    expect(screen.getByText(/Birthday/)).toBeInTheDocument()
  })

  it('renders only the first item when multiple items exist', () => {
    const multiItemData: Contact[] = [
      {
        '@id': '/api/contacts/4',
        id: 4,
        '@type': 'Contact',
        contactNames: [
          { '@id': '/api/cn/4a', '@type': 'ContactName', given: 'First', family: 'Name' },
          { '@id': '/api/cn/4b', '@type': 'ContactName', given: 'Second', family: 'Name' },
        ],
        contactEmailAdresses: [
          {
            '@id': '/api/ce/4a',
            '@type': 'ContactEmailAdress',
            value: 'first@example.com',
            type: 'work',
          },
          {
            '@id': '/api/ce/4b',
            '@type': 'ContactEmailAdress',
            value: 'second@example.com',
            type: 'home',
          },
        ],
        phoneNumbers: [
          {
            '@id': '/api/pn/4a',
            '@type': 'ContactPhoneNumber',
            value: '111-111',
            type: 'mobile',
          },
          {
            '@id': '/api/pn/4b',
            '@type': 'ContactPhoneNumber',
            value: '222-222',
            type: 'home',
          },
        ],
        contactDates: [
          {
            '@id': '/api/cd/4a',
            '@type': 'ContactDate',
            date: '2023-01-01',
            text: 'First Date',
          },
          {
            '@id': '/api/cd/4b',
            '@type': 'ContactDate',
            date: '2023-02-02',
            text: 'Second Date',
          },
        ],
      },
    ]

    render(
      <MemoryRouter>
        <ContactsTable
          data={multiItemData}
          onEdit={vi.fn()}
          onUpdateDate={vi.fn()}
          onDeleteDate={vi.fn()}
          onUpdateGroups={vi.fn()}
          onUpdateEmail={vi.fn()}
          onDeleteEmail={vi.fn()}
          onUpdatePhone={vi.fn()}
          onDeletePhone={vi.fn()}
          onUpdateName={vi.fn()}
          onDeleteName={vi.fn()}
        />
      </MemoryRouter>,
    )

    // Should show first items
    expect(screen.getByText('First Name')).toBeInTheDocument()
    expect(screen.getByText('first@example.com')).toBeInTheDocument()
    expect(screen.getByText('111-111')).toBeInTheDocument()
    expect(screen.getByText(/First Date/)).toBeInTheDocument()

    // Should NOT show second items
    expect(screen.queryByText('Second Name')).not.toBeInTheDocument()
    expect(screen.queryByText('second@example.com')).not.toBeInTheDocument()
    expect(screen.queryByText('222-222')).not.toBeInTheDocument()
    expect(screen.queryByText(/Second Date/)).not.toBeInTheDocument()
  })

  it('renders group pills', () => {
    vi.mocked(useGroups).mockReturnValue({
      data: [{ '@id': '/api/groups/1', '@type': 'Group', name: 'Work' }],
    } as unknown as ReturnType<typeof useGroups>)

    const mockDataWithGroups: Contact[] = [
      {
        '@id': '/api/contacts/3',
        id: 3,
        '@type': 'Contact',
        contactNames: [{ '@id': '/api/cn/3', '@type': 'ContactName', given: 'Charlie' }],
        contactGroups: [
          { '@id': '/api/cg/1', '@type': 'ContactGroup', groupResource: '/api/groups/1' },
        ],
      },
    ]

    render(
      <MemoryRouter>
        <ContactsTable
          data={mockDataWithGroups}
          onEdit={vi.fn()}
          onUpdateDate={vi.fn()}
          onDeleteDate={vi.fn()}
          onUpdateGroups={vi.fn()}
          onUpdateEmail={vi.fn()}
          onDeleteEmail={vi.fn()}
          onUpdatePhone={vi.fn()}
          onDeletePhone={vi.fn()}
          onUpdateName={vi.fn()}
          onDeleteName={vi.fn()}
        />
      </MemoryRouter>,
    )

    expect(screen.getByText('Work')).toBeInTheDocument()
  })

  it('triggers actions', () => {
    const onEdit = vi.fn()

    render(
      <MemoryRouter>
        <ContactsTable
          data={mockData}
          onEdit={onEdit}
          onUpdateDate={vi.fn()}
          onDeleteDate={vi.fn()}
          onUpdateGroups={vi.fn()}
          onUpdateEmail={vi.fn()}
          onDeleteEmail={vi.fn()}
          onUpdatePhone={vi.fn()}
          onDeletePhone={vi.fn()}
          onUpdateName={vi.fn()}
          onDeleteName={vi.fn()}
        />
      </MemoryRouter>,
    )

    // Get all buttons - we have edit buttons for both inline date editing and actions
    // The date edit buttons are within the dates column, action buttons are in the actions column
    // Since we have 2 contacts and each has an edit button in dates + edit/delete in actions
    // We need to find the right buttons by their position or parent structure

    // Let's get all edit buttons by label and filter them
    const allEditButtons = screen.getAllByLabelText('common.edit')

    // The first contact has:
    // - 1 edit button in the  dates column (inline edit for date)
    // - 1 edit button in the actions column
    // So allEditButtons[0] is the date inline edit, allEditButtons[1] is the first contact's action edit

    // For safety, let's click the last edit button of first two, which should be actions
    // Actually, let's be more specific - find buttons in the actions column
    // by checking if parent has class 'flex justify-end' (the actions container)
    const actionEditButton = allEditButtons.find((button) =>
      button.closest('div')?.className.includes('flex justify-end'),
    )

    expect(actionEditButton).toBeTruthy()

    if (!actionEditButton) {
      throw new Error('Action edit button not found')
    }

    fireEvent.click(actionEditButton)
    expect(onEdit).toHaveBeenCalledWith(mockData[0])
  })

  it('navigates on row click', () => {
    render(
      <MemoryRouter>
        <ContactsTable
          data={mockData}
          onEdit={vi.fn()}
          onUpdateDate={vi.fn()}
          onDeleteDate={vi.fn()}
          onUpdateGroups={vi.fn()}
          onUpdateEmail={vi.fn()}
          onDeleteEmail={vi.fn()}
          onUpdatePhone={vi.fn()}
          onDeletePhone={vi.fn()}
          onUpdateName={vi.fn()}
          onDeleteName={vi.fn()}
        />
      </MemoryRouter>,
    )

    const row = screen.getByText('Alice Smith').closest('tr')
    expect(row).toBeInTheDocument()
    fireEvent.click(row as Element)
    expect(mockNavigate).toHaveBeenCalledWith('/contacts/1')
  })

  it('regression: navigates to correct URL without spaces', () => {
    // This test ensures that the URL does not contain extra spaces, which was a reported bug.
    render(
      <MemoryRouter>
        <ContactsTable
          data={mockData}
          onEdit={vi.fn()}
          onUpdateDate={vi.fn()}
          onDeleteDate={vi.fn()}
          onUpdateGroups={vi.fn()}
          onUpdateEmail={vi.fn()}
          onDeleteEmail={vi.fn()}
          onUpdatePhone={vi.fn()}
          onDeletePhone={vi.fn()}
        />
      </MemoryRouter>,
    )

    const row = screen.getByText('Alice Smith').closest('tr')
    fireEvent.click(row as Element)
    expect(mockNavigate).toHaveBeenCalledWith('/contacts/1')
    expect(mockNavigate).not.toHaveBeenCalledWith('/ contacts / 1 ')
  })
})
