import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import ContactsPage from './ContactsPage'
import { useContacts, useDeleteContact, type HydraCollection } from './useContacts'

vi.mock('./useContacts', () => ({
  useContacts: vi.fn(),
  useDeleteContact: vi.fn(),
}))

import type { Contact } from '@/types/models'

// Mock Sub Components
vi.mock('./components/ContactsHeader', () => ({
  ContactsHeader: ({ onCreate }: { onCreate: () => void }) => (
    <div data-testid="header">
      <button onClick={onCreate}>Create</button>
    </div>
  ),
}))

interface MockTableProps {
  data: Contact[]
  onEdit: (contact: Contact) => void
  onDelete: (contact: Contact) => void
}

vi.mock('./components/ContactsTable', () => ({
  ContactsTable: ({ data, onEdit, onDelete }: MockTableProps) => (
    <div data-testid="table">
      {data.map((c) => (
        <div key={c['@id']}>
          {c.contactNames?.[0]?.given}
          <button onClick={() => onEdit(c)}>Edit</button>
          <button onClick={() => onDelete(c)}>Delete</button>
        </div>
      ))}
    </div>
  ),
}))

interface MockPaginationProps {
  onNext: () => void
  onPrevious: () => void
}

vi.mock('./components/ContactsPagination', () => ({
  ContactsPagination: ({ onNext, onPrevious }: MockPaginationProps) => (
    <div data-testid="pagination">
      <button onClick={onPrevious}>Previous</button>
      <button onClick={() => onNext()}>Next</button>
    </div>
  ),
}))

vi.mock('./components/ContactSheet', () => ({
  ContactSheet: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="sheet">{isOpen ? 'Open' : 'Closed'}</div>
  ),
}))
describe('ContactsPage', () => {
  const mockMutateAsync = vi.fn()

  beforeEach(() => {
    vi.mocked(useDeleteContact).mockReturnValue({
      mutateAsync: mockMutateAsync,
      reset: vi.fn(),
    } as unknown as ReturnType<typeof useDeleteContact>)
  })

  it('renders loading state', () => {
    vi.mocked(useContacts).mockReturnValue({
      isLoading: true,
      data: undefined,
      isError: false,
    } as unknown as ReturnType<typeof useContacts>)

    render(<ContactsPage />)
    expect(screen.getByText('contacts.loading')).toBeInTheDocument()
  })

  it('renders error state', () => {
    vi.mocked(useContacts).mockReturnValue({
      isLoading: false,
      data: undefined,
      isError: true,
    } as unknown as ReturnType<typeof useContacts>)

    render(<ContactsPage />)
    expect(screen.getByText('contacts.error')).toBeInTheDocument()
  })

  it('renders contacts and handles interactions', async () => {
    vi.mocked(useContacts).mockReturnValue({
      isLoading: false,
      data: {
        'hydra:member': [{ '@id': '/api/contacts/1', contactNames: [{ given: 'Alice' }] }],
        'hydra:view': {},
      } as HydraCollection<Contact>,
      isError: false,
    } as unknown as ReturnType<typeof useContacts>)

    render(<ContactsPage />)

    // Check data rendering
    expect(screen.getByText('Alice')).toBeInTheDocument()

    // Open Create
    fireEvent.click(screen.getByText('Create'))
    expect(screen.getByTestId('sheet')).toHaveTextContent('Open')

    // Delete
    // Mock confirm
    vi.stubGlobal('confirm', () => true)
    fireEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith('/api/contacts/1')
    })
  })
})
