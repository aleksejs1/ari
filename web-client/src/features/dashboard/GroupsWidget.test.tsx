import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import GroupsWidget from './GroupsWidget'

import { api } from '@/lib/axios'

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  function ReactQueryWrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    )
  }
  return ReactQueryWrapper
}

describe('GroupsWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when loading', () => {
    vi.mocked(api.get).mockReturnValue(
      new Promise(() => {
        // Never resolves to simulate loading state
      }),
    )
    const Wrapper = createWrapper()
    const { container } = render(
      <Wrapper>
        <GroupsWidget />
      </Wrapper>,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when no groups', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { member: [] } })
    const Wrapper = createWrapper()
    const { container } = render(
      <Wrapper>
        <GroupsWidget />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  })

  it('renders groups as badges with links', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        member: [
          { '@id': '/api/groups/1', name: 'Family', contactsCount: 5 },
          { '@id': '/api/groups/2', name: 'Work', contactsCount: 3 },
        ],
      },
    })
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <GroupsWidget />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('Family')).toBeInTheDocument()
      expect(screen.getByText('Work')).toBeInTheDocument()
    })

    const familyLink = screen.getByText('Family').closest('a')
    expect(familyLink).toHaveAttribute('href', '/contacts?group=%2Fapi%2Fgroups%2F1')

    const workLink = screen.getByText('Work').closest('a')
    expect(workLink).toHaveAttribute('href', '/contacts?group=%2Fapi%2Fgroups%2F2')
  })

  it('hides groups with no contacts', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        member: [
          { '@id': '/api/groups/1', name: 'Family', contactsCount: 5 },
          { '@id': '/api/groups/2', name: 'Empty Group', contactsCount: 0 },
        ],
      },
    })
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <GroupsWidget />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('Family')).toBeInTheDocument()
    })

    expect(screen.queryByText('Empty Group')).not.toBeInTheDocument()
  })

  it('displays the groups navigation title', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        member: [{ '@id': '/api/groups/1', name: 'Friends', contactsCount: 1 }],
      },
    })
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <GroupsWidget />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('app.navigation.groups')).toBeInTheDocument()
    })
  })
})
