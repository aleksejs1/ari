import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ReloadProvider, useReload } from '@/contexts/ReloadContext'
import { api } from '@/lib/axios'

import { useActivatePlugin, useDeactivatePlugin } from './useUserPlugins'

// Mock api
vi.mock('@/lib/axios', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

describe('useUserPlugins mutations', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Helper component to check context state
  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ReloadProvider>{children}</ReloadProvider>
    </QueryClientProvider>
  )

  it('Sets reloadNeeded to true after successful activation', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({})

    const { result } = renderHook(
      () => {
        const mutation = useActivatePlugin()
        const reloadContext = useReload()
        return { mutation, reloadContext }
      },
      { wrapper: TestWrapper },
    )

    result.current.mutation.mutate('test-plugin')

    await waitFor(() => {
      expect(result.current.mutation.isSuccess).toBe(true)
    })

    expect(api.post).toHaveBeenCalledWith('/user-plugins/activate', { pluginId: 'test-plugin' })
    expect(result.current.reloadContext.reloadNeeded).toBe(true)
  })

  it('Sets reloadNeeded to true after successful deactivation', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({})

    const { result } = renderHook(
      () => {
        const mutation = useDeactivatePlugin()
        const reloadContext = useReload()
        return { mutation, reloadContext }
      },
      { wrapper: TestWrapper },
    )

    result.current.mutation.mutate('test-plugin')

    await waitFor(() => {
      expect(result.current.mutation.isSuccess).toBe(true)
    })

    expect(api.post).toHaveBeenCalledWith('/user-plugins/deactivate', { pluginId: 'test-plugin' })
    expect(result.current.reloadContext.reloadNeeded).toBe(true)
  })
})
