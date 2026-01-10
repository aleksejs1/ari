import { type UseQueryResult } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useGroups } from '../useContacts'

import { ContactGroupSelect } from './ContactGroupSelect'

import { type Group } from '@/types/models'

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn().mockReturnValue({ t: (key: string) => key }),
}))

// Mock useGroups
vi.mock('../useContacts', () => ({
  useGroups: vi.fn(),
}))

const mockGroups = [
  { '@id': '/api/groups/1', name: 'Family' },
  { '@id': '/api/groups/2', name: 'Work' },
]

describe('ContactGroupSelect', () => {
  it('renders correctly', () => {
    vi.mocked(useGroups).mockReturnValue({
      data: mockGroups,
    } as unknown as UseQueryResult<Group[], Error>)

    render(<ContactGroupSelect onChange={vi.fn()} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('filters groups based on input', async () => {
    vi.mocked(useGroups).mockReturnValue({
      data: mockGroups,
    } as unknown as UseQueryResult<Group[], Error>)

    render(<ContactGroupSelect onChange={vi.fn()} />)
    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'Fam' } })

    expect(await screen.findByText('Family')).toBeInTheDocument()
  })

  it('selects an existing group', async () => {
    const handleChange = vi.fn()
    vi.mocked(useGroups).mockReturnValue({
      data: mockGroups,
    } as unknown as UseQueryResult<Group[], Error>)

    render(<ContactGroupSelect onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.focus(input)

    const familyOption = await screen.findByText('Family')
    fireEvent.click(familyOption)

    expect(handleChange).toHaveBeenCalledWith([{ groupResource: '/api/groups/1' }])
  })

  it('creates a new group', async () => {
    const handleChange = vi.fn()
    vi.mocked(useGroups).mockReturnValue({
      data: mockGroups,
    } as unknown as UseQueryResult<Group[], Error>)

    render(<ContactGroupSelect onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'New Group' } })

    const createText = await screen.findByText('common.create')
    fireEvent.click(createText)

    expect(handleChange).toHaveBeenCalledWith([{ groupResource: { name: 'New Group' } }])
  })

  it('renders selected values as badges', () => {
    vi.mocked(useGroups).mockReturnValue({
      data: mockGroups,
    } as unknown as UseQueryResult<Group[], Error>)
    const value = [
      {
        '@id': '/api/contact_groups/1',
        '@type': 'ContactGroup',
        groupResource: '/api/groups/1',
      },
      {
        '@id': '/api/contact_groups/2',
        '@type': 'ContactGroup',
        groupResource: { name: 'Custom' },
      },
    ]

    render(<ContactGroupSelect value={value} onChange={vi.fn()} />)
    expect(screen.getByText('Family')).toBeInTheDocument()
    expect(screen.getByText('Custom')).toBeInTheDocument()
  })

  it('removes a selected group', () => {
    const handleChange = vi.fn()
    vi.mocked(useGroups).mockReturnValue({
      data: mockGroups,
    } as unknown as UseQueryResult<Group[], Error>)
    const value = [
      {
        '@id': '/api/contact_groups/1',
        '@type': 'ContactGroup',
        groupResource: '/api/groups/1',
      },
    ]

    render(<ContactGroupSelect value={value} onChange={handleChange} />)
    const removeButtons = screen.getAllByRole('button')
    fireEvent.click(removeButtons[0])

    expect(handleChange).toHaveBeenCalledWith([])
  })
})
