import {
  QueryClient,
  QueryClientProvider,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import ContactDetailsPage from './ContactDetailsPage'
import * as useContactsHook from './useContacts'

import { ContactsPlugin } from '@/plugins/contacts'
import { type Contact } from '@/types/models'

// Mock components
vi.mock('./components/ContactTimeline', () => ({
  ContactTimeline: () => <div data-testid="contact-timeline">Contact Timeline</div>,
}))
vi.mock('./components/SimilarContactsWidget', () => ({
  SimilarContactsWidget: () => <div data-testid="similar-contacts">Similar Contacts</div>,
}))

// Mock Sections
vi.mock('./details/sections/GeneralInfoSection', () => ({
  GeneralInfoSection: () => <div data-testid="section-general-info">General Info Section</div>,
}))
vi.mock('./details/sections/ContactInfoSection', () => ({
  ContactInfoSection: () => <div data-testid="section-contact-info">Contact Info Section</div>,
}))
vi.mock('./details/sections/ProfessionalSection', () => ({
  ProfessionalSection: () => <div data-testid="section-professional">Professional Section</div>,
}))
vi.mock('./details/sections/DatesSection', () => ({
  DatesSection: () => <div data-testid="section-dates">Dates Section</div>,
}))
vi.mock('./details/sections/UpcomingDatesSection', () => ({
  UpcomingDatesSection: () => (
    <div data-testid="section-upcoming-dates">Upcoming Dates Section</div>
  ),
}))
vi.mock('./details/sections/RelationsSection', () => ({
  RelationsSection: () => <div data-testid="section-relations">Relations Section</div>,
}))
vi.mock('./details/sections/BiographySection', () => ({
  BiographySection: () => <div data-testid="section-biography">Biography Section</div>,
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

describe('ContactDetailsPage', () => {
  beforeEach(() => {
    new ContactsPlugin().register()
  })

  it('renders loading state', () => {
    vi.spyOn(useContactsHook, 'useContact').mockReturnValue({
      isLoading: true,
      data: undefined,
      error: null,
    } as unknown as UseQueryResult<Contact>)

    vi.spyOn(useContactsHook, 'useDeleteContact').mockReturnValue(
      {} as UseMutationResult<void, Error, string, unknown>,
    )
    vi.spyOn(useContactsHook, 'useExportContactVcard').mockReturnValue(
      {} as UseMutationResult<unknown, Error, { id: string; filename: string }, unknown>,
    )

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/contacts/1']}>
          <Routes>
            <Route path="/contacts/:id" element={<ContactDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(screen.queryByTestId('section-general-info')).not.toBeInTheDocument()
  })

  it('renders all sections by default', async () => {
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

    vi.spyOn(useContactsHook, 'useDeleteContact').mockReturnValue(
      {} as UseMutationResult<void, Error, string, unknown>,
    )
    vi.spyOn(useContactsHook, 'useExportContactVcard').mockReturnValue({
      isPending: false,
    } as UseMutationResult<unknown, Error, { id: string; filename: string }, unknown>)

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/contacts/1']}>
          <Routes>
            <Route path="/contacts/:id" element={<ContactDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('contacts.details')).toBeInTheDocument()
      expect(screen.getByTestId('section-general-info')).toBeInTheDocument()
      expect(screen.getByTestId('section-contact-info')).toBeInTheDocument()
      expect(screen.getByTestId('section-professional')).toBeInTheDocument()
    })
  })

  it('renders error state', () => {
    vi.spyOn(useContactsHook, 'useContact').mockReturnValue({
      isLoading: false,
      data: undefined,
      error: new Error('Failed'),
    } as unknown as UseQueryResult<Contact>)

    vi.spyOn(useContactsHook, 'useDeleteContact').mockReturnValue(
      {} as UseMutationResult<void, Error, string, unknown>,
    )
    vi.spyOn(useContactsHook, 'useExportContactVcard').mockReturnValue(
      {} as UseMutationResult<unknown, Error, { id: string; filename: string }, unknown>,
    )

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/contacts/1']}>
          <Routes>
            <Route path="/contacts/:id" element={<ContactDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
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

    const mockDelete = vi.fn()
    vi.spyOn(useContactsHook, 'useDeleteContact').mockReturnValue({
      isPending: false,
      mutateAsync: mockDelete,
    } as unknown as UseMutationResult<void, Error, string, unknown>)

    vi.spyOn(useContactsHook, 'useExportContactVcard').mockReturnValue({
      isPending: false,
    } as UseMutationResult<unknown, Error, { id: string; filename: string }, unknown>)

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/contacts/1']}>
          <Routes>
            <Route path="/contacts/:id" element={<ContactDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
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
        contactNames: [{ given: 'John', family: 'Doe' }],
      },
      error: null,
    } as unknown as UseQueryResult<Contact>)

    vi.spyOn(useContactsHook, 'useDeleteContact').mockReturnValue(
      {} as UseMutationResult<void, Error, string, unknown>,
    )

    const mockExport = vi.fn()
    vi.spyOn(useContactsHook, 'useExportContactVcard').mockReturnValue({
      isPending: false,
      mutateAsync: mockExport,
    } as unknown as UseMutationResult<unknown, Error, { id: string; filename: string }, unknown>)

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/contacts/1']}>
          <Routes>
            <Route path="/contacts/:id" element={<ContactDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
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
