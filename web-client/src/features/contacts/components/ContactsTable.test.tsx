import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ContactsTable } from './ContactsTable'

import type { Contact } from '@/types/models'

describe('ContactsTable', () => {
  const mockData: Contact[] = [
    {
      '@id': '/api/contacts/1',
      '@type': 'Contact',
      contactNames: [{ given: 'Alice', family: 'Smith' }],
      contactDates: [{ date: '2023-01-01', text: 'Birthday' }],
    },
    {
      '@id': '/api/contacts/2',
      '@type': 'Contact',
      contactNames: [{ given: 'Bob' }], // No family name
      contactDates: [],
    },
  ]

  it('renders empty state', () => {
    render(<ContactsTable data={[]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('No results.')).toBeInTheDocument()
  })

  it('renders data correctly', () => {
    render(<ContactsTable data={mockData} onEdit={vi.fn()} onDelete={vi.fn()} />)

    expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    // Using substring match or regex for date as formatting might depend on locale
    expect(screen.getByText(/Birthday/)).toBeInTheDocument()
  })

  it('triggers actions', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(<ContactsTable data={mockData} onEdit={onEdit} onDelete={onDelete} />)

    // Select buttons using container query selectors to be specific about icons if needed,
    // or just getAllByRole('button') and know the order: Edit, Delete, Edit, Delete...
    const buttons = screen.getAllByRole('button')

    // 1st row Edit (index 0)
    fireEvent.click(buttons[0])
    expect(onEdit).toHaveBeenCalledWith(mockData[0])

    // 1st row Delete (index 1)
    fireEvent.click(buttons[1])
    expect(onDelete).toHaveBeenCalledWith(mockData[0])
  })
})
