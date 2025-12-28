import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import ContactDetailsPage from './ContactDetailsPage'
import * as useContactsHook from './useContacts'

// Mock components to avoid complex rendering in unit test
vi.mock('./components/ContactForm', () => ({
  ContactForm: () => <div data-testid="contact-form">Contact Form</div>,
}))
vi.mock('./components/ContactTimeline', () => ({
  ContactTimeline: () => <div data-testid="contact-timeline">Contact Timeline</div>,
}))

describe('ContactDetailsPage', () => {
  it('renders loading state', () => {
    vi.spyOn(useContactsHook, 'useContact').mockReturnValue({
      isLoading: true,
      data: undefined,
      error: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(useContactsHook, 'useUpdateContact').mockReturnValue({} as any)

    render(
      <MemoryRouter initialEntries={['/contacts/1']}>
        <Routes>
          <Route path="/contacts/:id" element={<ContactDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    )

    // Check for spinner or loading text (in our case it's a Loader2 icon which might not have text,
    // but the container is there. Let's check for "contact-form" NOT being there)
    expect(screen.queryByTestId('contact-form')).not.toBeInTheDocument()
  })

  it('renders data correctly', async () => {
    vi.spyOn(useContactsHook, 'useContact').mockReturnValue({
      isLoading: false,
      data: {
        id: 1,
        '@id': '/api/contacts/1',
        contactNames: [],
        contactDates: [],
      },
      error: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    vi.spyOn(useContactsHook, 'useUpdateContact').mockReturnValue({
      isPending: false,
      mutateAsync: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    render(
      <MemoryRouter initialEntries={['/contacts/1']}>
        <Routes>
          <Route path="/contacts/:id" element={<ContactDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('contacts.details')).toBeInTheDocument()
      expect(screen.getByTestId('contact-form')).toBeInTheDocument()
    })
  })

  it('renders error state', () => {
    vi.spyOn(useContactsHook, 'useContact').mockReturnValue({
      isLoading: false,
      data: undefined,
      error: new Error('Failed'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(useContactsHook, 'useUpdateContact').mockReturnValue({} as any)

    render(
      <MemoryRouter initialEntries={['/contacts/1']}>
        <Routes>
          <Route path="/contacts/:id" element={<ContactDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('errors.failedToLoadContact')).toBeInTheDocument()
  })
})
