import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'

import { useDeleteProfile } from '../hooks/useDeleteProfile'

import DeleteAccountPage from './DeleteAccountPage'

vi.mock('../hooks/useDeleteProfile', () => ({
  useDeleteProfile: vi.fn(),
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <DeleteAccountPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('DeleteAccountPage', () => {
  const mockDeleteAccount = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useDeleteProfile as Mock).mockReturnValue({
      mutate: mockDeleteAccount,
      isPending: false,
    })
  })

  it('renders the warning message and delete button', () => {
    renderPage()
    expect(screen.getByText('settings.deleteAccount.title')).toBeInTheDocument()
    expect(screen.getByText('settings.deleteAccount.button')).toBeInTheDocument()
  })

  it('opens the confirmation modal when delete button is clicked', () => {
    renderPage()
    fireEvent.click(screen.getByText('settings.deleteAccount.button'))
    expect(screen.getByText('settings.deleteAccount.modalTitle')).toBeInTheDocument()
  })

  it('calls deleteAccount mutation when confirmed in modal', async () => {
    renderPage()
    fireEvent.click(screen.getByText('settings.deleteAccount.button'))
    fireEvent.click(screen.getByText('settings.deleteAccount.confirmButton'))

    await waitFor(() => {
      expect(mockDeleteAccount).toHaveBeenCalled()
    })
  })

  it('closes the modal when cancel is clicked', async () => {
    renderPage()
    fireEvent.click(screen.getByText('settings.deleteAccount.button'))
    fireEvent.click(screen.getByText('common.cancel'))

    await waitFor(() => {
      expect(screen.queryByText('settings.deleteAccount.modalTitle')).not.toBeInTheDocument()
    })
  })

  it('disables buttons when deletion is in progress', () => {
    ;(useDeleteProfile as Mock).mockReturnValue({
      mutate: mockDeleteAccount,
      isPending: true,
    })

    renderPage()
    fireEvent.click(screen.getByText('settings.deleteAccount.button'))

    expect(screen.getByText('common.saving')).toBeDisabled()
    expect(screen.getByText('common.cancel')).toBeDisabled()
  })
})
