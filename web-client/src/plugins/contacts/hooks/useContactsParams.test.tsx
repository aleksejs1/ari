import { MemoryRouter } from 'react-router-dom'
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useContactsParams } from './useContactsParams'

describe('useContactsParams', () => {
  it('parses initial params from url', () => {
    const { result } = renderHook(() => useContactsParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/?page=2&search=test&group=friends']}>
          {children}
        </MemoryRouter>
      ),
    })

    expect(result.current.page).toBe(2)
    expect(result.current.search).toBe('test')
    expect(result.current.group).toBe('friends')
  })

  it('handleSearch updates search and resets page', () => {
    const { result } = renderHook(() => useContactsParams(), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    })

    act(() => {
      result.current.handleSearch('newsearch')
    })

    // We can't strictly assert the URL update in MemoryRouter without inspecting the router state
    // but we can check if the hook state re-renders correctly if the router updates.
    // However, useSearchParams returns a setter that updates the router context.
    // renderHook will re-render when context changes.

    // Actually, checking result.current immediately might not reflect the update if it's async-ish or pending.
    // In React Router 6 + MemoryRouter, it should work.

    expect(result.current.search).toBe('newsearch')
    expect(result.current.page).toBe(1)
  })

  it('setPage updates page', () => {
    const { result } = renderHook(() => useContactsParams(), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    })

    act(() => {
      result.current.setPage(5)
    })

    expect(result.current.page).toBe(5)
  })
})
