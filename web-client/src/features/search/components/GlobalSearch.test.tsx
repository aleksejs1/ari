import { type UseQueryResult } from '@tanstack/react-query'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { GlobalSearch } from './GlobalSearch'

import { useContacts } from '@/features/contacts/useContacts'
import { useGroups } from '@/features/groups/useGroups'
import { type Contact, type Group, type HydraCollection } from '@/types/models'

// Mock hooks
vi.mock('@/features/contacts/useContacts', () => ({
  useContacts: vi.fn(),
}))

vi.mock('@/features/groups/useGroups', () => ({
  useGroups: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

describe('GlobalSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    vi.mocked(useContacts).mockReturnValue({
      data: { 'hydra:member': [] },
    } as unknown as UseQueryResult<HydraCollection<Contact>>)
    vi.mocked(useGroups).mockReturnValue({ data: [] } as unknown as UseQueryResult<Group[]>)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders search input', () => {
    render(<GlobalSearch />)
    expect(screen.getByPlaceholderText('globalSearch.placeholder')).toBeInTheDocument()
  })

  it('shows no results message when search yields nothing', () => {
    render(<GlobalSearch />)
    const input = screen.getByPlaceholderText('globalSearch.placeholder')

    // Type in input
    fireEvent.change(input, { target: { value: 'nothing' } })
    fireEvent.focus(input)

    // Advance timer to trigger debounce
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByText('common.noResults')).toBeInTheDocument()
  })

  it('displays contact results', () => {
    vi.mocked(useContacts).mockReturnValue({
      data: {
        'hydra:member': [
          {
            '@id': '/api/contacts/1',
            id: '1',
            names: [{ givenName: 'John', familyName: 'Doe' }],
          },
        ],
      },
      isLoading: false,
    } as unknown as UseQueryResult<HydraCollection<Contact>>)

    render(<GlobalSearch />)
    const input = screen.getByPlaceholderText('globalSearch.placeholder')
    fireEvent.change(input, { target: { value: 'John' } })
    fireEvent.focus(input)

    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Default tab matches, so we should see the result
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    // Check tab has count
    expect(screen.getByText(/globalSearch.sections.contacts \(1\)/)).toBeInTheDocument()
  })

  it('displays contact results preferring displayName', () => {
    vi.mocked(useContacts).mockReturnValue({
      data: {
        'hydra:member': [
          {
            '@id': '/api/contacts/2',
            id: '2',
            displayName: 'Jane Doe Custom',
            names: [{ givenName: 'Jane', familyName: 'Doe' }],
          },
        ],
      },
      isLoading: false,
    } as unknown as UseQueryResult<HydraCollection<Contact>>)

    render(<GlobalSearch />)
    const input = screen.getByPlaceholderText('globalSearch.placeholder')
    fireEvent.change(input, { target: { value: 'Jane' } })
    fireEvent.focus(input)

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByText('Jane Doe Custom')).toBeInTheDocument()
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument()
  })

  it('displays group results', () => {
    vi.mocked(useGroups).mockReturnValue({
      data: [
        {
          '@id': '/api/groups/1',
          name: 'Friends',
        },
      ],
      isLoading: false,
    } as unknown as UseQueryResult<Group[]>)

    render(<GlobalSearch />)
    const input = screen.getByPlaceholderText('globalSearch.placeholder')
    fireEvent.change(input, { target: { value: 'Fri' } })
    fireEvent.focus(input)

    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Initially in Contacts tab - check that Groups tab has count (1)
    expect(screen.getByText(/globalSearch.sections.groups \(1\)/)).toBeInTheDocument()

    // Switch to Groups tab
    fireEvent.click(screen.getByText(/globalSearch.sections.groups/))

    expect(screen.getByText('Friends')).toBeInTheDocument()
  })
})
