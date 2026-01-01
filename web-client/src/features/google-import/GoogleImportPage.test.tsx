import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import GoogleImportPage from './GoogleImportPage'

import { api } from '@/lib/axios'

// Mock axios
vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

// Mock translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { count?: number }) => {
      if (key === 'googleImport.success') {
        return `Success: ${options?.count}`
      }
      return key
    },
  }),
}))

describe('GoogleImportPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders auth button', () => {
    render(
      <MemoryRouter>
        <GoogleImportPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('googleImport.authorize')).toBeInTheDocument()
  })

  it('handles auth redirect', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: { url: 'https://auth.url' } })

    // Window open mock
    vi.spyOn(window, 'open').mockImplementation(() => null)

    render(
      <MemoryRouter>
        <GoogleImportPage />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('googleImport.authorize'))

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('../connect/google', expect.any(Object))
      expect(window.open).toHaveBeenCalledWith('https://auth.url', '_blank')
    })
  })

  it('handles auth callback code', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: {} })

    render(
      <MemoryRouter initialEntries={['/google-import?code=123']}>
        <GoogleImportPage />
      </MemoryRouter>,
    )

    // It should automatically trigger verify
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        '../connect/google',
        expect.objectContaining({
          params: { code: '123' },
        }),
      )
    })

    expect(screen.getByText('googleImport.authSuccess')).toBeInTheDocument()
  })

  it('handles import action', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: { imported: 42 } })

    render(
      <MemoryRouter>
        <GoogleImportPage />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('googleImport.import'))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/google/import', {}, expect.any(Object))
    })

    expect(screen.getByText('Success: 42')).toBeInTheDocument()
  })

  it('renders error state', async () => {
    vi.mocked(api.post).mockRejectedValueOnce(new Error('Failed'))

    render(
      <MemoryRouter>
        <GoogleImportPage />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('googleImport.import'))

    await waitFor(() => {
      expect(screen.getByText('googleImport.error')).toBeInTheDocument()
    })
  })
})
