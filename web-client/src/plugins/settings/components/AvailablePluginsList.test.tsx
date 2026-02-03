import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useActivatePlugin, useDeactivatePlugin, useUserPlugins } from '@/hooks/useUserPlugins'

import { AvailablePluginsList } from './AvailablePluginsList'

// Mock hooks
vi.mock('@/hooks/useUserPlugins', () => ({
  useUserPlugins: vi.fn(),
  useActivatePlugin: vi.fn(),
  useDeactivatePlugin: vi.fn(),
}))

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('AvailablePluginsList', () => {
  const mockActivate = vi.fn()
  const mockDeactivate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useActivatePlugin as any).mockReturnValue({
      mutate: mockActivate,
      isLoading: false,
    })
    ;(useDeactivatePlugin as any).mockReturnValue({
      mutate: mockDeactivate,
      isLoading: false,
    })
  })

  it('renders loading state', () => {
    ;(useUserPlugins as any).mockReturnValue({
      isLoading: true,
      data: undefined,
    })
    render(<AvailablePluginsList />)
    expect(screen.getByText('plugins.loading')).toBeInTheDocument()
  })

  it('renders error state', () => {
    ;(useUserPlugins as any).mockReturnValue({
      isLoading: false,
      error: new Error('Failed'),
      data: undefined,
    })
    render(<AvailablePluginsList />)
    expect(screen.getByText('plugins.error')).toBeInTheDocument()
  })

  it('renders plugin list', () => {
    const plugins = [
      {
        pluginId: 'plugin-1',
        title: 'Test Plugin',
        description: 'Description',
        version: '1.0.0',
        enabled: false,
      },
      {
        pluginId: 'plugin-2',
        title: 'Active Plugin',
        description: 'Description 2',
        version: '2.0.0',
        enabled: true,
      },
    ]
    ;(useUserPlugins as any).mockReturnValue({
      isLoading: false,
      data: plugins,
    })
    render(<AvailablePluginsList />)

    expect(screen.getByText('Test Plugin')).toBeInTheDocument()
    expect(screen.getByText('Active Plugin')).toBeInTheDocument()
    expect(screen.getAllByText('plugins.activate')).toHaveLength(1)
    expect(screen.getAllByText('plugins.deactivate')).toHaveLength(1)
  })

  it('calls activate mutation', () => {
    const plugins = [
      {
        pluginId: 'plugin-1',
        title: 'Test Plugin',
        enabled: false,
      },
    ]
    ;(useUserPlugins as any).mockReturnValue({
      isLoading: false,
      data: plugins,
    })
    render(<AvailablePluginsList />)

    fireEvent.click(screen.getByText('plugins.activate'))
    expect(mockActivate).toHaveBeenCalledWith('plugin-1')
  })

  it('calls deactivate mutation', () => {
    const plugins = [
      {
        pluginId: 'plugin-1',
        title: 'Test Plugin',
        enabled: true,
      },
    ]
    ;(useUserPlugins as any).mockReturnValue({
      isLoading: false,
      data: plugins,
    })
    render(<AvailablePluginsList />)

    fireEvent.click(screen.getByText('plugins.deactivate'))
    expect(mockDeactivate).toHaveBeenCalledWith('plugin-1')
  })
})
