import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useSimilarContacts } from '../useContacts'

import { SimilarContactsWidget } from './SimilarContactsWidget'

// Mock the hook
vi.mock('../useContacts', () => ({
  useSimilarContacts: vi.fn(),
}))

describe('SimilarContactsWidget', () => {
  const mockUseSimilarContacts = useSimilarContacts as unknown as ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state', () => {
    mockUseSimilarContacts.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    })

    render(
      <MemoryRouter>
        <SimilarContactsWidget contactId="1" />
      </MemoryRouter>,
    )

    expect(screen.getByText('contacts.similarContacts')).toBeInTheDocument()
  })

  it('renders nothing if error occurs', () => {
    mockUseSimilarContacts.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed'),
    })

    const { container } = render(
      <MemoryRouter>
        <SimilarContactsWidget contactId="1" />
      </MemoryRouter>,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing if no similar contacts', () => {
    mockUseSimilarContacts.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    })

    const { container } = render(
      <MemoryRouter>
        <SimilarContactsWidget contactId="1" />
      </MemoryRouter>,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders similar contacts list (limited to 5)', () => {
    const mockContacts = Array.from({ length: 7 }, (_, i) => ({
      '@id': `/api/contacts/${i + 1}`,
      displayName: `Contact ${i + 1}`,
    }))

    mockUseSimilarContacts.mockReturnValue({
      data: mockContacts,
      isLoading: false,
      error: null,
    })

    render(
      <MemoryRouter>
        <SimilarContactsWidget contactId="1" />
      </MemoryRouter>,
    )

    expect(screen.getByText('contacts.similarContacts')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
    expect(screen.getByText('Contact 1')).toBeInTheDocument()
    expect(screen.queryByText('Contact 6')).not.toBeInTheDocument()
  })
})
