import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as useSmsBackupImportModule from '../../hooks/useSmsBackupImport'
import { PhoneBackupImportSection } from '../PhoneBackupImportSection'

// ── Module mocks (hoisted by Vitest before static imports at runtime) ─────────

vi.mock('../../hooks/useSmsBackupImport', () => ({
  useSmsBackupImport: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}))

vi.mock('axios', () => ({
  default: { isAxiosError: (e: unknown) => (e as any)?.isAxiosError === true },
  isAxiosError: (e: unknown) => (e as any)?.isAxiosError === true,
}))

// Shared spy re-used across tests that need to verify mutate is called.
const mockMutate = vi.fn()

// ── Helpers ──────────────────────────────────────────────────────────────────

function renderComponent() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <PhoneBackupImportSection />
    </QueryClientProvider>,
  )
}

function makeXmlFile(name = 'sms-backup.xml') {
  return new File(['<smses count="0"></smses>'], name, { type: 'application/xml' })
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('PhoneBackupImportSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSmsBackupImportModule.useSmsBackupImport).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any)
  })

  it('renders the drop zone and helper text in the initial state', () => {
    renderComponent()

    expect(screen.getByText('settings.phoneBackup.title')).toBeInTheDocument()
    expect(screen.getByText('settings.phoneBackup.dropzoneHelper')).toBeInTheDocument()
    expect(screen.getByTestId('phone-backup-file-input')).toBeInTheDocument()
  })

  it('renders option controls before file selection', () => {
    renderComponent()

    expect(screen.getByText('settings.phoneBackup.options.unknownNumbers')).toBeInTheDocument()
    expect(screen.getByText('settings.phoneBackup.options.nameConflict')).toBeInTheDocument()
    expect(screen.getByText('settings.phoneBackup.options.duplicateStrategy')).toBeInTheDocument()
  })

  it('renders option controls after file selection', async () => {
    renderComponent()

    const input = screen.getByTestId('phone-backup-file-input')
    await act(async () => {
      fireEvent.change(input, { target: { files: [makeXmlFile()] } })
    })

    expect(screen.getByText('settings.phoneBackup.options.unknownNumbers')).toBeInTheDocument()
    expect(screen.getByText('settings.phoneBackup.options.nameConflict')).toBeInTheDocument()
    expect(screen.getByText('settings.phoneBackup.options.duplicateStrategy')).toBeInTheDocument()
  })

  it('disables the submit button before a file is selected', () => {
    renderComponent()

    const button = screen.getByTestId('phone-backup-import-button')
    expect(button).toBeDisabled()
  })

  it('enables the submit button after a file is selected', async () => {
    renderComponent()

    const input = screen.getByTestId('phone-backup-file-input')
    await act(async () => {
      fireEvent.change(input, { target: { files: [makeXmlFile()] } })
    })

    const button = screen.getByTestId('phone-backup-import-button')
    expect(button).not.toBeDisabled()
  })

  it('shows a spinner and disables the button in loading state', () => {
    vi.mocked(useSmsBackupImportModule.useSmsBackupImport).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any)

    renderComponent()

    const button = screen.getByTestId('phone-backup-import-button')
    expect(button).toBeDisabled()
    expect(screen.getByText('settings.phoneBackup.processing')).toBeInTheDocument()
  })

  it('shows the success banner after a successful import', async () => {
    vi.mocked(useSmsBackupImportModule.useSmsBackupImport).mockReturnValue({
      mutate: vi.fn((_vars, opts) => opts?.onSuccess?.({ status: 'queued', message: 'ok' })),
      isPending: false,
    } as any)

    renderComponent()

    const input = screen.getByTestId('phone-backup-file-input')
    await act(async () => {
      fireEvent.change(input, { target: { files: [makeXmlFile()] } })
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('phone-backup-import-button'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('phone-backup-import-success')).toBeInTheDocument()
    })

    expect(screen.getByText('settings.phoneBackup.queued')).toBeInTheDocument()
  })

  it('hides the success banner automatically after 10 seconds', async () => {
    vi.useFakeTimers()
    try {
      vi.mocked(useSmsBackupImportModule.useSmsBackupImport).mockReturnValue({
        mutate: vi.fn((_vars, opts) => opts?.onSuccess?.({ status: 'queued', message: 'ok' })),
        isPending: false,
      } as any)

      renderComponent()

      await act(async () => {
        fireEvent.change(screen.getByTestId('phone-backup-file-input'), {
          target: { files: [makeXmlFile()] },
        })
      })
      await act(async () => {
        fireEvent.click(screen.getByTestId('phone-backup-import-button'))
      })

      expect(screen.getByTestId('phone-backup-import-success')).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(10_000)
      })

      expect(screen.queryByTestId('phone-backup-import-success')).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('clears the file selection and resets options after success', async () => {
    vi.mocked(useSmsBackupImportModule.useSmsBackupImport).mockReturnValue({
      mutate: vi.fn((_vars, opts) => opts?.onSuccess?.({ status: 'queued', message: 'ok' })),
      isPending: false,
    } as any)

    renderComponent()

    const input = screen.getByTestId('phone-backup-file-input')
    await act(async () => {
      fireEvent.change(input, { target: { files: [makeXmlFile()] } })
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('phone-backup-import-button'))
    })

    // Button disabled → file list cleared.
    await waitFor(() => {
      expect(screen.getByTestId('phone-backup-import-button')).toBeDisabled()
    })

    // Options reset to defaults: "Skip" radio selected for unknownNumbers.
    const skipRadios = screen.getAllByRole('radio', {
      name: 'settings.phoneBackup.options.unknownNumbers.skip',
    })
    expect(skipRadios[0]).toBeChecked()
  })

  it('shows the error banner with API detail on failure', async () => {
    const axiosError = {
      isAxiosError: true,
      response: { data: { detail: 'File too large.' } },
    }

    vi.mocked(useSmsBackupImportModule.useSmsBackupImport).mockReturnValue({
      mutate: vi.fn((_vars, opts) => opts?.onError?.(axiosError)),
      isPending: false,
    } as any)

    renderComponent()

    const input = screen.getByTestId('phone-backup-file-input')
    await act(async () => {
      fireEvent.change(input, { target: { files: [makeXmlFile()] } })
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('phone-backup-import-button'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('phone-backup-import-error')).toBeInTheDocument()
    })

    expect(screen.getByText('File too large.')).toBeInTheDocument()
  })

  it('hides the success banner when a new file is selected', async () => {
    vi.mocked(useSmsBackupImportModule.useSmsBackupImport).mockReturnValue({
      mutate: vi.fn((_vars, opts) => opts?.onSuccess?.({ status: 'queued', message: 'ok' })),
      isPending: false,
    } as any)

    renderComponent()

    const input = screen.getByTestId('phone-backup-file-input')

    await act(async () => {
      fireEvent.change(input, { target: { files: [makeXmlFile()] } })
    })
    await act(async () => {
      fireEvent.click(screen.getByTestId('phone-backup-import-button'))
    })
    await waitFor(() => {
      expect(screen.getByTestId('phone-backup-import-success')).toBeInTheDocument()
    })

    // Select a new file → success banner disappears
    await act(async () => {
      fireEvent.change(input, { target: { files: [makeXmlFile('calls-backup.xml')] } })
    })

    expect(screen.queryByTestId('phone-backup-import-success')).not.toBeInTheDocument()
  })
})
