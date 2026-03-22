// Test the actual provider implementation, not the global mock from setup.tsx
vi.unmock('@/contexts/RegionalPrefsContext')

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type UseMutationResult } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuth } from '@/hooks/useAuth'
import { usePreferencesStorage } from '@/hooks/usePreferencesStorage'
import { api } from '@/lib/axios'

import { RegionalPrefsProvider, useRegionalPrefs } from './RegionalPrefsContext'

vi.mock('@/lib/axios', () => ({ api: { get: vi.fn() } }))
vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('@/hooks/usePreferencesStorage', () => ({ usePreferencesStorage: vi.fn() }))

const mockMutateAsync = vi.fn()

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(RegionalPrefsProvider, null, children),
    )
  }
  return Wrapper
}

describe('RegionalPrefsContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      arePluginsLoaded: true,
      pluginLoadError: null,
      login: vi.fn(),
      logout: vi.fn(),
    })
    vi.mocked(usePreferencesStorage).mockReturnValue({
      mutateAsync: mockMutateAsync,
    } as unknown as UseMutationResult<void, Error, { type: string; value: string }, unknown>)
  })

  it('provides default values when API returns empty prefs', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { member: [] } })

    const { result } = renderHook(() => useRegionalPrefs(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.language).toBe('en')
    expect(result.current.dateFormat).toBe('mm/dd/yyyy')
    expect(result.current.timeFormat).toBe('24h')
  })

  it('reads values from API response', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        member: [
          { type: 'language', value: 'fr' },
          { type: 'dateFormat', value: 'dd/mm/yyyy' },
          { type: 'timeFormat', value: '12h' },
          { type: 'timezone', value: 'Europe/Paris' },
        ],
      },
    })

    const { result } = renderHook(() => useRegionalPrefs(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.language).toBe('fr')
    expect(result.current.dateFormat).toBe('dd/mm/yyyy')
    expect(result.current.timeFormat).toBe('12h')
    expect(result.current.timezone).toBe('Europe/Paris')
  })

  it('setLanguage calls saveMutation.mutateAsync with language type', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { member: [] } })
    mockMutateAsync.mockResolvedValue(undefined)

    const { result } = renderHook(() => useRegionalPrefs(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.setLanguage('de')
    })

    expect(mockMutateAsync).toHaveBeenCalledWith({ type: 'language', value: 'de' })
  })

  it('setDateFormat calls saveMutation.mutateAsync with dateFormat type', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { member: [] } })
    mockMutateAsync.mockResolvedValue(undefined)

    const { result } = renderHook(() => useRegionalPrefs(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.setDateFormat('yyyy-mm-dd')
    })

    expect(mockMutateAsync).toHaveBeenCalledWith({ type: 'dateFormat', value: 'yyyy-mm-dd' })
  })

  it('setTimezone calls saveMutation.mutateAsync with timezone type', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { member: [] } })
    mockMutateAsync.mockResolvedValue(undefined)

    const { result } = renderHook(() => useRegionalPrefs(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.setTimezone('America/New_York')
    })

    expect(mockMutateAsync).toHaveBeenCalledWith({ type: 'timezone', value: 'America/New_York' })
  })

  it('does not fetch prefs when user is not authenticated', async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      arePluginsLoaded: true,
      pluginLoadError: null,
      login: vi.fn(),
      logout: vi.fn(),
    })

    renderHook(() => useRegionalPrefs(), { wrapper: createWrapper() })

    // Query is disabled, so no API call should be made
    expect(api.get).not.toHaveBeenCalled()
  })
})
