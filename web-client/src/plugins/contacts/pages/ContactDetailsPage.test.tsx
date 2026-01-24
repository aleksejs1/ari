import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Contact } from '@/types/models'

import * as useContactsHook from '../useContacts'

import ContactDetailsPage from './ContactDetailsPage'

// Mock hooks
vi.mock('../useContacts', () => ({
  useContact: vi.fn(),
  useDeleteContact: vi.fn(),
  useExportContactVcard: vi.fn(),
  useSimilarContacts: vi.fn(),
}))

// Mock components
vi.mock('../components/DeleteContactDialog', () => ({
  DeleteContactDialog: ({ open, onConfirm }: any) =>
    open ? (
      <div data-testid="delete-dialog">
        <button onClick={onConfirm}>Confirm Delete</button>
      </div>
    ) : null,
}))

vi.mock('../components/SimilarContactsWidget', () => ({
  SimilarContactsWidget: () => <div data-testid="similar-contacts" />,
}))

// Mock ContactDetailsRegistry
vi.mock('@/lib/contacts/details/ContactDetailsRegistry', () => ({
  ContactDetailsRegistry: {
    getInstance: () => ({
      getAll: () => [
        { id: 'section1', component: () => <div>Section 1</div>, layout: 'half' },
        { id: 'section2', component: () => <div>Section 2</div>, layout: 'full' },
      ],
    }),
  },
}))

describe('ContactDetailsPage', () => {
  const mockContact: Contact = {
    '@id': '/api/contacts/1',
    id: 1,
    contactNames: [{ given: 'John', family: 'Doe' }] as any,
  } as Contact

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useContactsHook.useDeleteContact).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any)
    vi.mocked(useContactsHook.useExportContactVcard).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any)
  })

  // Helper to render with router
  const renderWithRouter = (initialEntries = ['/contacts/1']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/contacts/:id" element={<ContactDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    )
  }

  it('renders loading state', () => {
    vi.mocked(useContactsHook.useContact).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any)

    renderWithRouter()
    expect(screen.getByTestId('icon-Loader2')).toBeInTheDocument()
  })

  it('renders error state', () => {
    vi.mocked(useContactsHook.useContact).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed'),
    } as any)

    renderWithRouter()
    expect(screen.getByText('errors.failedToLoadContact')).toBeInTheDocument()
  })

  it('renders contact details', () => {
    vi.mocked(useContactsHook.useContact).mockReturnValue({
      data: mockContact,
      isLoading: false,
      error: null,
    } as any)

    renderWithRouter()
    expect(screen.getByText('details')).toBeInTheDocument()
    expect(screen.getByText('Section 1')).toBeInTheDocument()
    expect(screen.getByText('Section 2')).toBeInTheDocument()
    expect(screen.getByTestId('similar-contacts')).toBeInTheDocument()
  })

  it('opens delete dialog and calls mutation on confirm', async () => {
    const mockDeleteMutation = vi.fn().mockResolvedValue({})
    vi.mocked(useContactsHook.useDeleteContact).mockReturnValue({
      mutateAsync: mockDeleteMutation,
      isPending: false,
    } as any)

    vi.mocked(useContactsHook.useContact).mockReturnValue({
      data: mockContact,
      isLoading: false,
      error: null,
    } as any)

    renderWithRouter()

    fireEvent.click(screen.getByText('common.delete'))
    expect(screen.getByTestId('delete-dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Confirm Delete'))
    await waitFor(() => {
      expect(mockDeleteMutation).toHaveBeenCalledWith('/api/contacts/1')
    })
  })

  it('calls export vcard mutation', async () => {
    const mockExportMutation = vi.fn().mockResolvedValue({})
    vi.mocked(useContactsHook.useExportContactVcard).mockReturnValue({
      mutateAsync: mockExportMutation,
      isPending: false,
    } as any)

    vi.mocked(useContactsHook.useContact).mockReturnValue({
      data: mockContact,
      isLoading: false,
      error: null,
    } as any)

    renderWithRouter()

    fireEvent.click(screen.getByText('exportVcard'))
    await waitFor(() => {
      expect(mockExportMutation).toHaveBeenCalledWith({
        id: '/api/contacts/1',
        filename: 'contact_John_Doe',
      })
    })
  })
})
