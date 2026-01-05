import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import ContactsPage from './ContactsPage'
import {
  useContacts,
  useDeleteContact,
  useUpdateContactDate,
  useCreateContactDate,
  useUpdateContactGroups,
  useCreateContactEmail,
  useUpdateContactEmail,
  useDeleteContactEmail,
  useCreateContactPhone,
  useUpdateContactPhone,
  useDeleteContactPhone,
  useCreateContactName,
  useUpdateContactName,
  useDeleteContactName,
  type HydraCollection,
} from './useContacts'

// ... existing code ...

vi.mock('./useContacts', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    useContacts: vi.fn(),
    useDeleteContact: vi.fn(),

    useUpdateContactDate: vi.fn(),
    useCreateContactDate: vi.fn(),
    useUpdateContactGroups: vi.fn(),
    useCreateContactEmail: vi.fn(),
    useUpdateContactEmail: vi.fn(),
    useDeleteContactEmail: vi.fn(),
    useCreateContactPhone: vi.fn(),
    useUpdateContactPhone: vi.fn(),
    useDeleteContactPhone: vi.fn(),
    useCreateContactName: vi.fn(),
    useUpdateContactName: vi.fn(),
    useDeleteContactName: vi.fn(),
  }
})

import type { Contact } from '@/types/models'

// Mock Sub Components
vi.mock('./components/ContactsHeader', () => ({
  ContactsHeader: ({
    onCreate,
    onSearchChange,
  }: {
    onCreate: () => void
    onSearchChange: (val: string) => void
  }) => (
    <div data-testid="header">
      <input data-testid="search-input" onChange={(e) => onSearchChange(e.target.value)} />
      <button onClick={onCreate}>Create</button>
    </div>
  ),
}))

interface MockTableProps {
  data: Contact[]
  onEdit: (contact: Contact) => void
}

vi.mock('./components/ContactsTable', () => ({
  ContactsTable: ({ data, onEdit }: MockTableProps) => (
    <div data-testid="table">
      {data.map((c) => (
        <div key={c['@id']}>
          {c.contactNames?.[0]?.given}
          <button onClick={() => onEdit(c)}>Edit</button>
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

    vi.mocked(useUpdateContactDate).mockReturnValue({
      mutateAsync: vi.fn(),
    } as unknown as ReturnType<typeof useUpdateContactDate>)

    vi.mocked(useCreateContactDate).mockReturnValue({
      mutateAsync: vi.fn(),
    } as unknown as ReturnType<typeof useCreateContactDate>)

    vi.mocked(useUpdateContactGroups).mockReturnValue({
      mutateAsync: vi.fn(),
    } as unknown as ReturnType<typeof useUpdateContactGroups>)

    vi.mocked(useCreateContactEmail).mockReturnValue({
      mutateAsync: vi.fn(),
    } as unknown as ReturnType<typeof useCreateContactEmail>)

    vi.mocked(useUpdateContactEmail).mockReturnValue({
      mutateAsync: vi.fn(),
    } as unknown as ReturnType<typeof useUpdateContactEmail>)

    vi.mocked(useDeleteContactEmail).mockReturnValue({
      mutateAsync: vi.fn(),
    } as unknown as ReturnType<typeof useDeleteContactEmail>)

    vi.mocked(useCreateContactPhone).mockReturnValue({
      mutateAsync: vi.fn(),
    } as unknown as ReturnType<typeof useCreateContactPhone>)

    vi.mocked(useUpdateContactPhone).mockReturnValue({
      mutateAsync: vi.fn(),
    } as unknown as ReturnType<typeof useUpdateContactPhone>)

    vi.mocked(useDeleteContactPhone).mockReturnValue({
      mutateAsync: vi.fn(),
    } as unknown as ReturnType<typeof useDeleteContactPhone>)

    vi.mocked(useCreateContactName).mockReturnValue({
      mutateAsync: vi.fn(),
    } as unknown as ReturnType<typeof useCreateContactName>)

    vi.mocked(useUpdateContactName).mockReturnValue({
      mutateAsync: vi.fn(),
    } as unknown as ReturnType<typeof useUpdateContactName>)

    vi.mocked(useDeleteContactName).mockReturnValue({
      mutateAsync: vi.fn(),
    } as unknown as ReturnType<typeof useDeleteContactName>)
  })

  it('renders loading state', () => {
    vi.mocked(useContacts).mockReturnValue({
      isLoading: true,
      data: undefined,
      isError: false,
    } as unknown as ReturnType<typeof useContacts>)

    render(
      <MemoryRouter>
        <ContactsPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('contacts.loading')).toBeInTheDocument()
  })

  it('renders error state', () => {
    vi.mocked(useContacts).mockReturnValue({
      isLoading: false,
      data: undefined,
      isError: true,
    } as unknown as ReturnType<typeof useContacts>)

    render(
      <MemoryRouter>
        <ContactsPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('contacts.error')).toBeInTheDocument()
  })

  it('renders contacts and handles interactions', async () => {
    vi.mocked(useContacts).mockReturnValue({
      isLoading: false,
      data: {
        member: [{ '@id': '/api/contacts/1', contactNames: [{ given: 'Alice' }] }],
        view: {},
      } as HydraCollection<Contact>,
      isError: false,
    } as unknown as ReturnType<typeof useContacts>)

    render(
      <MemoryRouter>
        <ContactsPage />
      </MemoryRouter>,
    )

    // Check data rendering
    expect(screen.getByText('Alice')).toBeInTheDocument()

    // Open Create
    fireEvent.click(screen.getByText('Create'))
    expect(screen.getByTestId('sheet')).toHaveTextContent('Open')
  })

  it('updates search filter when search input changes', async () => {
    vi.mocked(useContacts).mockReturnValue({
      isLoading: false,
      data: { member: [], view: {} },
      isError: false,
    } as unknown as ReturnType<typeof useContacts>)

    render(
      <MemoryRouter>
        <ContactsPage />
      </MemoryRouter>,
    )

    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'alice' } })

    await waitFor(() => {
      expect(useContacts).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ search: 'alice' }),
      )
    })
  })

  it('handles robust pagination when view is missing', () => {
    vi.mocked(useContacts).mockReturnValue({
      isLoading: false,
      isPlaceholderData: false,
      data: {
        member: [],
        totalItems: 100, // 4 pages
      } as HydraCollection<Contact>,
      isError: false,
    } as unknown as ReturnType<typeof useContacts>)

    render(
      <MemoryRouter>
        <ContactsPage />
      </MemoryRouter>,
    )

    // Pagination should be visible because totalItems > ITEMS_PER_PAGE
    const pagination = screen.getByTestId('pagination')
    expect(pagination).toBeInTheDocument()

    // Next button should be enabled because we are on page 1 and there are 4 pages
    const nextBtn = screen.getByText('Next')
    expect(nextBtn).not.toBeDisabled()
  })
})
