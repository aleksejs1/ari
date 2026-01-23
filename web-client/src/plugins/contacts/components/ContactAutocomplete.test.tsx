import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getHydraMember, useContacts } from '../useContacts'

import { ContactAutocomplete } from './ContactAutocomplete'

// Mock the hooks
vi.mock('../useContacts', () => ({
  useContacts: vi.fn(),
  getHydraMember: vi.fn((data) => data || []),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('ContactAutocomplete', () => {
  const mockOnChange = vi.fn()
  const mockUseContacts = useContacts as unknown as ReturnType<typeof vi.fn>
  const mockGetHydraMember = getHydraMember as unknown as ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search placeholder', () => {
    mockUseContacts.mockReturnValue({ data: undefined, isLoading: false })
    mockGetHydraMember.mockReturnValue([])

    render(<ContactAutocomplete onChange={mockOnChange} />)

    expect(screen.getByText('common.search')).toBeInTheDocument()
  })

  it('renders loading state when searching', async () => {
    mockUseContacts.mockReturnValue({ data: undefined, isLoading: true })
    mockGetHydraMember.mockReturnValue([])

    render(<ContactAutocomplete onChange={mockOnChange} />)

    fireEvent.click(screen.getByRole('combobox'))

    expect(screen.getByText('common.loading')).toBeInTheDocument()
  })

  it('renders no results message', async () => {
    mockUseContacts.mockReturnValue({ data: [], isLoading: false })
    mockGetHydraMember.mockReturnValue([])

    render(<ContactAutocomplete onChange={mockOnChange} />)

    fireEvent.click(screen.getByRole('combobox'))

    expect(screen.getByText('common.noResults')).toBeInTheDocument()
  })

  it('displays search results and allows selection', async () => {
    const mockContacts = [
      { '@id': '/api/contacts/1', displayName: 'John Doe' },
      { '@id': '/api/contacts/2', displayName: 'Jane Smith' },
    ]
    mockUseContacts.mockReturnValue({ data: mockContacts, isLoading: false })
    mockGetHydraMember.mockReturnValue(mockContacts)

    render(<ContactAutocomplete onChange={mockOnChange} />)

    fireEvent.click(screen.getByRole('combobox'))

    const input = screen.getByPlaceholderText('common.search')
    fireEvent.change(input, { target: { value: 'John' } })

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()

    fireEvent.click(screen.getByText('John Doe'))

    expect(mockOnChange).toHaveBeenCalledWith(mockContacts[0])
  })

  it('displays initial label when value is an IRI and not in search results', () => {
    mockUseContacts.mockReturnValue({ data: [], isLoading: false })
    mockGetHydraMember.mockReturnValue([])

    render(
      <ContactAutocomplete
        value="/api/contacts/999"
        initialLabel="Old Friend"
        onChange={mockOnChange}
      />,
    )

    expect(screen.getByText('Old Friend')).toBeInTheDocument()
  })

  it('filters out excluded contact', async () => {
    const mockContacts = [
      { '@id': '/api/contacts/1', displayName: 'Self' },
      { '@id': '/api/contacts/2', displayName: 'Other' },
    ]
    mockUseContacts.mockReturnValue({ data: mockContacts, isLoading: false })
    mockGetHydraMember.mockReturnValue(mockContacts)

    render(<ContactAutocomplete onChange={mockOnChange} excludeContactId="/api/contacts/1" />)

    fireEvent.click(screen.getByRole('combobox'))

    expect(screen.queryByText('Self')).not.toBeInTheDocument()
    expect(screen.getByText('Other')).toBeInTheDocument()
  })

  it('handles Enter key navigation', async () => {
    const mockContacts = [{ '@id': '/api/contacts/1', displayName: 'John Doe' }]
    mockUseContacts.mockReturnValue({ data: mockContacts, isLoading: false })
    mockGetHydraMember.mockReturnValue(mockContacts)

    render(<ContactAutocomplete onChange={mockOnChange} />)

    fireEvent.click(screen.getByRole('combobox'))

    const option = screen.getByText('John Doe')
    fireEvent.keyDown(option, { key: 'Enter' })

    expect(mockOnChange).toHaveBeenCalledWith(mockContacts[0])
  })

  it('handles Space key navigation', async () => {
    const mockContacts = [{ '@id': '/api/contacts/1', displayName: 'John Doe' }]
    mockUseContacts.mockReturnValue({ data: mockContacts, isLoading: false })
    mockGetHydraMember.mockReturnValue(mockContacts)

    render(<ContactAutocomplete onChange={mockOnChange} />)

    fireEvent.click(screen.getByRole('combobox'))

    const option = screen.getByText('John Doe')
    fireEvent.keyDown(option, { key: ' ' })

    expect(mockOnChange).toHaveBeenCalledWith(mockContacts[0])
  })
})
