import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { ContactsHeader } from './ContactsHeader'

describe('ContactsHeader', () => {
  it('renders correctly', () => {
    render(<ContactsHeader onCreate={vi.fn()} />)
    expect(screen.getByText('Contacts')).toBeInTheDocument()
    expect(screen.getByText('Manage your contacts list.')).toBeInTheDocument()
    expect(screen.getByText('Add Contact')).toBeInTheDocument()
  })

  it('calls onCreate when add button is clicked', () => {
    const onCreate = vi.fn()
    render(<ContactsHeader onCreate={onCreate} />)
    fireEvent.click(screen.getByText('Add Contact'))
    expect(onCreate).toHaveBeenCalled()
  })
})
