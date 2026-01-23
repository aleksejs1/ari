import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { describe, it } from 'vitest'

import { ContactInfoSection } from './ContactInfoSection'

import type { Contact } from '@/types/models'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

describe('ContactInfoSection', () => {
  it('renders without crashing when collections are malformed objects', () => {
    const contact = {
      '@id': '/api/contacts/1',
      id: 1,
      // Malformed collections (objects instead of arrays)
      phoneNumbers: { error: 'true' },
      contactEmailAdresses: { error: 'true' },
      contactAddresses: { error: 'true' },
    } as unknown as Contact

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <ContactInfoSection contact={contact} />
      </QueryClientProvider>,
    )

    expect(container).toBeInTheDocument()
  })
})
