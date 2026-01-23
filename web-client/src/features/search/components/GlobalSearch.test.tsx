import { type UseQueryResult } from '@tanstack/react-query'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { useNavigate } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { GlobalSearch } from './GlobalSearch'

import { useContacts } from '@/features/contacts/useContacts'
import { useGroups } from '@/plugins/groups/hooks/useGroups'
import { type Contact, type Group, type HydraCollection } from '@/types/models'

// Mock hooks
vi.mock('@/features/contacts/useContacts', () => ({
  useContacts: vi.fn(),
}))

vi.mock('@/plugins/groups/hooks/useGroups', () => ({
  useGroups: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

describe('GlobalSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    vi.mocked(useNavigate).mockReturnValue(vi.fn())
    vi.mocked(useContacts).mockReturnValue({
      data: { member: [] },
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
        member: [
          {
            '@id': '/api/contacts/1',
            id: '1',
            contactNames: [{ given: 'John', family: 'Doe' }],
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
        member: [
          {
            '@id': '/api/contacts/2',
            id: '2',
            displayName: 'Jane Doe Custom',
            contactNames: [{ given: 'Jane', family: 'Doe' }],
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

  it('shows "Show all results" button when there are more than 5 results', () => {
    const navigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(navigate)

    vi.mocked(useContacts).mockReturnValue({
      data: {
        member: Array.from({ length: 6 }, (_, i) => ({
          '@id': `/api/contacts/${i}`,
          id: String(i),
          contactNames: [{ given: 'John', family: 'Doe' }],
        })),
        totalItems: 6,
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

    const showAllButton = screen.getByText('globalSearch.showAllResults')
    expect(showAllButton).toBeInTheDocument()

    fireEvent.click(showAllButton)
    expect(navigate).toHaveBeenCalledWith('/contacts?page=1&search=John')
  })

  it('does not show "Show all results" button when there are 5 or fewer results', () => {
    vi.mocked(useContacts).mockReturnValue({
      data: {
        member: Array.from({ length: 5 }, (_, i) => ({
          '@id': `/api/contacts/${i}`,
          id: String(i),
          contactNames: [{ given: 'John', family: 'Doe' }],
        })),
        totalItems: 5,
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

    expect(screen.queryByText('globalSearch.showAllResults')).not.toBeInTheDocument()
  })

  it('displays settings results', () => {
    render(<GlobalSearch />)
    const input = screen.getByPlaceholderText('globalSearch.placeholder')
    fireEvent.change(input, { target: { value: 'Audit' } })
    fireEvent.focus(input)

    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Initially in Contacts tab - check that Settings tab has count
    expect(screen.getByText(/globalSearch.sections.settings \(1\)/)).toBeInTheDocument()

    // Switch to Settings tab
    fireEvent.click(screen.getByText(/globalSearch.sections.settings/))

    expect(screen.getByText('app.navigation.sidebar.auditLogs')).toBeInTheDocument()
  })
})
