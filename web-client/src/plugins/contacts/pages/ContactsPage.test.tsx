import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Contact } from '@/types/models'

import * as useContactsParamsHook from '../hooks/useContactsParams'
import * as useContactsHook from '../useContacts'

import ContactsPage from './ContactsPage'

// Mock hooks
vi.mock('../useContacts', () => ({
  useContacts: vi.fn(),
  getHydraMember: (data: any) => data?.member || [],
  getHydraPagination: (data: any) => ({
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
    ...data?.pagination,
  }),
}))

vi.mock('../hooks/useContactsParams', () => ({
  useContactsParams: vi.fn(),
}))

// Mock components
vi.mock('../components/ContactsHeader', () => ({
  ContactsHeader: ({ onSearchChange, onCreate }: any) => (
    <div>
      <input data-testid="search-input" onChange={(e) => onSearchChange(e.target.value)} />
      <button onClick={onCreate}>New Contact</button>
    </div>
  ),
}))

vi.mock('../components/ContactsTable', () => ({
  ContactsTable: ({ data, onEdit }: any) => (
    <div>
      {data.map((contact: Contact) => (
        <button key={contact.id} data-testid="contact-row" onClick={() => onEdit(contact)}>
          {contact.contactNames?.[0]?.given}
        </button>
      ))}
    </div>
  ),
}))

vi.mock('../components/ContactsPagination', () => ({
  ContactsPagination: ({ onNext, onPrevious }: any) => (
    <div>
      <button onClick={onPrevious}>Previous</button>
      <button onClick={onNext}>Next</button>
    </div>
  ),
}))

vi.mock('../components/ContactModal', () => ({
  ContactModal: ({ isOpen }: any) =>
    isOpen ? <div data-testid="contact-modal">Modal Open</div> : null,
}))

describe('ContactsPage', () => {
  const mockParams = {
    page: 1,
    group: undefined,
    search: undefined,
    sorting: undefined,
    handleSearch: vi.fn(),
    handleSort: vi.fn(),
    setPage: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useContactsParamsHook.useContactsParams).mockReturnValue(mockParams as any)
  })

  it('renders loading state', () => {
    vi.mocked(useContactsHook.useContacts).mockReturnValue({
      data: undefined,
      isLoading: true,
      isPlaceholderData: false,
      isError: false,
    } as any)

    render(<ContactsPage />)
    expect(screen.getByText('contacts.loading')).toBeInTheDocument()
  })

  it('renders error state', () => {
    vi.mocked(useContactsHook.useContacts).mockReturnValue({
      data: undefined,
      isLoading: false,
      isPlaceholderData: false,
      isError: true,
    } as any)

    render(<ContactsPage />)
    expect(screen.getByText('contacts.error')).toBeInTheDocument()
  })

  it('renders contacts table', () => {
    const mockData = {
      member: [
        { id: 1, contactNames: [{ given: 'Alice' }] },
        { id: 2, contactNames: [{ given: 'Bob' }] },
      ],
    }

    vi.mocked(useContactsHook.useContacts).mockReturnValue({
      data: mockData,
      isLoading: false,
      isPlaceholderData: false,
      isError: false,
    } as any)

    render(<ContactsPage />)
    expect(screen.getAllByTestId('contact-row')).toHaveLength(2)
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('opens modal on create click', () => {
    vi.mocked(useContactsHook.useContacts).mockReturnValue({
      data: { member: [] },
      isLoading: false,
      isPlaceholderData: false,
      isError: false,
    } as any)

    render(<ContactsPage />)
    fireEvent.click(screen.getByText('New Contact'))
    expect(screen.getByTestId('contact-modal')).toBeInTheDocument()
  })

  it('opens modal on edit click', () => {
    const mockData = {
      member: [{ id: 1, contactNames: [{ given: 'Alice' }] }],
    }

    vi.mocked(useContactsHook.useContacts).mockReturnValue({
      data: mockData,
      isLoading: false,
      isPlaceholderData: false,
      isError: false,
    } as any)

    render(<ContactsPage />)
    fireEvent.click(screen.getByText('Alice'))
    expect(screen.getByTestId('contact-modal')).toBeInTheDocument()
  })
})
