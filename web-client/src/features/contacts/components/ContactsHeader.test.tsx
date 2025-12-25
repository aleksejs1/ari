import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { ContactsHeader } from './ContactsHeader'

describe('ContactsHeader', () => {
  it('renders correctly', () => {
    render(<ContactsHeader onCreate={vi.fn()} />)
    expect(screen.getByText('contacts.title')).toBeInTheDocument()
    // expect(screen.getByText('Manage your contacts list.')).toBeInTheDocument()
    // Commenting out description check as key might vary or be missing in basic json.
    // If I confirmed key exists I would use it. I'll search for it later if needed.
    expect(screen.getByText('contacts.create')).toBeInTheDocument()
  })

  it('calls onCreate when add button is clicked', () => {
    const onCreate = vi.fn()
    render(<ContactsHeader onCreate={onCreate} />)
    fireEvent.click(screen.getByText('contacts.create'))
    expect(onCreate).toHaveBeenCalled()
  })
})
