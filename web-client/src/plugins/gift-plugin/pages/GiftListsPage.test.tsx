import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import GiftListsPage from './GiftListsPage'

// Mock the hooks
vi.mock('../hooks/useGiftLists', () => ({
  useGiftLists: () => ({
    data: [
      {
        id: 1,
        name: 'Birthday Wishlist',
        description: 'My birthday items',
        eventDate: '2023-12-25',
      },
    ],
    isLoading: false,
  }),
  useCreateGiftList: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateGiftList: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDeleteGiftList: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

// Mock translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}))

describe('GiftListsPage', () => {
  it('renders the page title and add button', () => {
    render(<GiftListsPage />)

    expect(screen.getByText('Gift Lists')).toBeInTheDocument()
    expect(screen.getByText('Add List')).toBeInTheDocument()
  })

  it('renders the gift list items', () => {
    render(<GiftListsPage />)

    expect(screen.getByText('Birthday Wishlist')).toBeInTheDocument()
    expect(screen.getByText('My birthday items')).toBeInTheDocument()
  })
})
