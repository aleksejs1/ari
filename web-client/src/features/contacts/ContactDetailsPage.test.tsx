import { type UseMutationResult, type UseQueryResult } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import ContactDetailsPage from './ContactDetailsPage'
import * as useContactsHook from './useContacts'

import { type Contact, type ContactFormValues } from '@/types/models'

// Mock components to avoid complex rendering in unit test
vi.mock('./components/ContactForm', () => ({
  ContactForm: ({ onSubmit }: { onSubmit: () => void }) => (
    <div data-testid="contact-form">
      Contact Form
      <button onClick={onSubmit} data-testid="submit-form">
        Submit
      </button>
    </div>
  ),
}))
vi.mock('./components/ContactTimeline', () => ({
  ContactTimeline: () => <div data-testid="contact-timeline">Contact Timeline</div>,
}))
vi.mock('./components/ContactView', () => ({
  ContactView: ({ onEdit }: { onEdit: () => void }) => (
    <div data-testid="contact-view">
      Contact View
      <button onClick={onEdit} data-testid="edit-button">
        Edit
      </button>
    </div>
  ),
}))
vi.mock('./components/SimilarContactsWidget', () => ({
  SimilarContactsWidget: () => <div data-testid="similar-contacts">Similar Contacts</div>,
}))

describe('ContactDetailsPage', () => {
  it('renders loading state', () => {
    vi.spyOn(useContactsHook, 'useContact').mockReturnValue({
      isLoading: true,
      data: undefined,
      error: null,
    } as unknown as UseQueryResult<Contact>)

    vi.spyOn(useContactsHook, 'useUpdateContact').mockReturnValue(
      {} as UseMutationResult<unknown, Error, { id: string; data: ContactFormValues }, unknown>,
    )
    vi.spyOn(useContactsHook, 'useDeleteContact').mockReturnValue(
      {} as UseMutationResult<void, Error, string, unknown>,
    )
    vi.spyOn(useContactsHook, 'useExportContactVcard').mockReturnValue(
      {} as UseMutationResult<unknown, Error, { id: string; filename: string }, unknown>,
    )

    render(
      <MemoryRouter initialEntries={['/contacts/1']}>
        <Routes>
          <Route path="/contacts/:id" element={<ContactDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.queryByTestId('contact-form')).not.toBeInTheDocument()
    expect(screen.queryByTestId('contact-view')).not.toBeInTheDocument()
  })

  it('renders view mode by default', async () => {
    vi.spyOn(useContactsHook, 'useContact').mockReturnValue({
      isLoading: false,
      data: {
        id: 1,
        '@id': '/api/contacts/1',
        contactNames: [],
        contactDates: [],
      },
      error: null,
    } as unknown as UseQueryResult<Contact>)

    vi.spyOn(useContactsHook, 'useUpdateContact').mockReturnValue({
      isPending: false,
      mutateAsync: vi.fn(),
    } as unknown as UseMutationResult<
      unknown,
      Error,
      { id: string; data: ContactFormValues },
      unknown
    >)

    vi.spyOn(useContactsHook, 'useDeleteContact').mockReturnValue(
      {} as UseMutationResult<void, Error, string, unknown>,
    )
    vi.spyOn(useContactsHook, 'useExportContactVcard').mockReturnValue({
      isPending: false,
    } as UseMutationResult<unknown, Error, { id: string; filename: string }, unknown>)

    render(
      <MemoryRouter initialEntries={['/contacts/1']}>
        <Routes>
          <Route path="/contacts/:id" element={<ContactDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('contacts.details')).toBeInTheDocument()
      expect(screen.getByTestId('contact-view')).toBeInTheDocument()
      expect(screen.queryByTestId('contact-form')).not.toBeInTheDocument()
    })
  })

  it('can toggle to edit mode and back', async () => {
    vi.spyOn(useContactsHook, 'useContact').mockReturnValue({
      isLoading: false,
      data: {
        id: 1,
        '@id': '/api/contacts/1',
        contactNames: [],
        contactDates: [],
      },
      error: null,
    } as unknown as UseQueryResult<Contact>)

    vi.spyOn(useContactsHook, 'useUpdateContact').mockReturnValue({
      isPending: false,
      mutateAsync: vi.fn(),
    } as unknown as UseMutationResult<
      unknown,
      Error,
      { id: string; data: ContactFormValues },
      unknown
    >)

    vi.spyOn(useContactsHook, 'useDeleteContact').mockReturnValue(
      {} as UseMutationResult<void, Error, string, unknown>,
    )
    vi.spyOn(useContactsHook, 'useExportContactVcard').mockReturnValue({
      isPending: false,
    } as UseMutationResult<unknown, Error, { id: string; filename: string }, unknown>)

    render(
      <MemoryRouter initialEntries={['/contacts/1']}>
        <Routes>
          <Route path="/contacts/:id" element={<ContactDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    )

    // Switch to Edit Mode
    fireEvent.click(screen.getByTestId('edit-button'))
    // There are two "Edit Contact" texts: one in header, one in CardTitle
    expect(screen.getAllByText('contacts.editContact')).toHaveLength(2)
    expect(screen.getByTestId('contact-form')).toBeInTheDocument()
    expect(screen.queryByTestId('contact-view')).not.toBeInTheDocument()

    // Switch back via header back button (which now toggles edit mode inside the component)
    // Note: The back button in the header simply has an ArrowLeft icon.
    // In our test, we need to find it. It's the first button in the header.
    // Or we can find by the ArrowLeft icon if we mock it, or just find the button by role.
    const buttons = screen.getAllByRole('button')
    // Button 0 is Back, Button 1 is Delete (in header)
    fireEvent.click(buttons[0])

    expect(screen.getByText('contacts.details')).toBeInTheDocument()
    expect(screen.getByTestId('contact-view')).toBeInTheDocument()
    expect(screen.queryByTestId('contact-form')).not.toBeInTheDocument()
  })

  it('renders error state', () => {
    vi.spyOn(useContactsHook, 'useContact').mockReturnValue({
      isLoading: false,
      data: undefined,
      error: new Error('Failed'),
    } as unknown as UseQueryResult<Contact>)

    vi.spyOn(useContactsHook, 'useUpdateContact').mockReturnValue(
      {} as UseMutationResult<unknown, Error, { id: string; data: ContactFormValues }, unknown>,
    )
    vi.spyOn(useContactsHook, 'useDeleteContact').mockReturnValue(
      {} as UseMutationResult<void, Error, string, unknown>,
    )
    vi.spyOn(useContactsHook, 'useExportContactVcard').mockReturnValue(
      {} as UseMutationResult<unknown, Error, { id: string; filename: string }, unknown>,
    )

    render(
      <MemoryRouter initialEntries={['/contacts/1']}>
        <Routes>
          <Route path="/contacts/:id" element={<ContactDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('errors.failedToLoadContact')).toBeInTheDocument()
  })

  it('handles delete contact', async () => {
    vi.spyOn(useContactsHook, 'useContact').mockReturnValue({
      isLoading: false,
      data: {
        id: 1,
        '@id': '/api/contacts/1',
      },
      error: null,
    } as unknown as UseQueryResult<Contact>)

    vi.spyOn(useContactsHook, 'useUpdateContact').mockReturnValue({
      isPending: false,
      mutateAsync: vi.fn(),
    } as unknown as UseMutationResult<
      unknown,
      Error,
      { id: string; data: ContactFormValues },
      unknown
    >)

    const mockDelete = vi.fn()
    vi.spyOn(useContactsHook, 'useDeleteContact').mockReturnValue({
      isPending: false,
      mutateAsync: mockDelete,
    } as unknown as UseMutationResult<void, Error, string, unknown>)

    vi.spyOn(useContactsHook, 'useExportContactVcard').mockReturnValue({
      isPending: false,
    } as UseMutationResult<unknown, Error, { id: string; filename: string }, unknown>)

    render(
      <MemoryRouter initialEntries={['/contacts/1']}>
        <Routes>
          <Route path="/contacts/:id" element={<ContactDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    )

    // Open dialog
    fireEvent.click(screen.getByText('common.delete'))
    expect(screen.getByText('contacts.deleteConfirmTitle')).toBeInTheDocument()

    // Confirm delete
    const deleteButtons = screen.getAllByText('common.delete')
    if (deleteButtons[1]) {
      fireEvent.click(deleteButtons[1])
    }

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('/api/contacts/1')
    })
  })

  it('triggers vCard export', async () => {
    vi.spyOn(useContactsHook, 'useContact').mockReturnValue({
      isLoading: false,
      data: {
        id: 1,
        '@id': '/api/contacts/1',
        firstName: 'John',
        lastName: 'Doe',
      },
      error: null,
    } as unknown as UseQueryResult<Contact>)

    vi.spyOn(useContactsHook, 'useUpdateContact').mockReturnValue({
      isPending: false,
    } as unknown as UseMutationResult<
      unknown,
      Error,
      { id: string; data: ContactFormValues },
      unknown
    >)

    vi.spyOn(useContactsHook, 'useDeleteContact').mockReturnValue(
      {} as UseMutationResult<void, Error, string, unknown>,
    )

    const mockExport = vi.fn()
    vi.spyOn(useContactsHook, 'useExportContactVcard').mockReturnValue({
      isPending: false,
      mutateAsync: mockExport,
    } as unknown as UseMutationResult<unknown, Error, { id: string; filename: string }, unknown>)

    render(
      <MemoryRouter initialEntries={['/contacts/1']}>
        <Routes>
          <Route path="/contacts/:id" element={<ContactDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    )

    const exportButton = screen.getByText('contacts.exportVcard')
    fireEvent.click(exportButton)

    await waitFor(() => {
      expect(mockExport).toHaveBeenCalledWith({
        id: '/api/contacts/1',
        filename: 'contact_John_Doe',
      })
    })
  })
})
