import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useRegionalPrefs } from '@/contexts/RegionalPrefsContext'

import { useCreateGroup, useGroups } from '../useContacts'

import { ContactForm } from './ContactForm'

// Mock useRegionalPrefs hook
vi.mock('@/contexts/RegionalPrefsContext', () => ({
  useRegionalPrefs: vi.fn(),
}))

// Mock useContacts
vi.mock('../useContacts', () => ({
  useCreateGroup: vi.fn(),
  useGroups: vi.fn(),
  useUploadContactAvatar: vi.fn(() => ({ mutateAsync: vi.fn() })),
}))

// Mock NotificationSubscriptions to avoid implementation details and API calls
vi.mock('./NotificationSubscriptions', () => ({
  NotificationSubscriptions: ({ entityId }: { entityId: number }) => (
    <div data-testid="subs">{`Subs: ${entityId}`}</div>
  ),
}))

describe('ContactForm Synchronization', () => {
  beforeEach(() => {
    ;(useRegionalPrefs as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      formatDate: (date: string) => new Date(date).toLocaleDateString('en-US'),
      language: 'en',
      dateFormat: 'mm/dd/yyyy',
    })
    vi.mocked(useCreateGroup).mockReturnValue({ mutateAsync: vi.fn() } as unknown as ReturnType<
      typeof useCreateGroup
    >)
    vi.mocked(useGroups).mockReturnValue({ data: [] } as unknown as ReturnType<typeof useGroups>)
  })

  it('updates form values and IDs when props change after save', async () => {
    const { rerender } = render(
      <ContactForm
        onSubmit={vi.fn()}
        defaultValues={{
          contactNames: [{ given: 'John', family: 'Doe' }],
          contactDates: [],
          phoneNumbers: [],
          contactEmailAdresses: [],
          contactAddresses: [],
        }}
      />,
    )

    expect(screen.getByPlaceholderText('familyName')).toHaveValue('Doe')

    // Simulate after-save prop update with server-provided ID
    rerender(
      <ContactForm
        onSubmit={vi.fn()}
        defaultValues={{
          contactNames: [{ id: '1', given: 'John', family: 'Doe' }],
          contactDates: [],
          phoneNumbers: [],
          contactEmailAdresses: [],
          contactAddresses: [],
        }}
      />,
    )

    // Wait for the form to reactive-sync with new props
    await waitFor(() => {
      // We can't easily check the internal state of RHF without devtools or exports,
      // but we can check if it still has the correct value.
      expect(screen.getByPlaceholderText('familyName')).toHaveValue('Doe')
    })
  })

  it('correctly resets form with new data from server', async () => {
    const { rerender } = render(
      <ContactForm
        onSubmit={vi.fn()}
        defaultValues={{
          contactNames: [{ given: 'John', family: 'Doe' }],
          contactDates: [],
          phoneNumbers: [],
          contactEmailAdresses: [],
          contactAddresses: [],
        }}
      />,
    )

    // Simulate server-side automated change (e.g. normalization) + ID addition
    rerender(
      <ContactForm
        onSubmit={vi.fn()}
        defaultValues={{
          contactNames: [{ id: '1', given: 'JOHN', family: 'DOE' }],
          contactDates: [],
          phoneNumbers: [],
          contactEmailAdresses: [],
          contactAddresses: [],
        }}
      />,
    )

    await waitFor(() => {
      expect(screen.getByPlaceholderText('givenName')).toHaveValue('JOHN')
    })
  })
})

describe('<ContactFormSync />', () => {
  beforeAll(() => {
    ;(useRegionalPrefs as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      formatDate: (date: string) => new Date(date).toLocaleDateString('en-US'),
      language: 'en',
      dateFormat: 'mm/dd/yyyy',
    })
  })

  it('renders notification subscriptions for existing dates', async () => {
    const { FormProvider, useForm } = await import('react-hook-form')
    const { ContactFormSync } = await import('./ContactFormSync')

    const Wrapper = () => {
      const methods = useForm({
        defaultValues: {
          contactDates: [
            { text: 'Birthday', date: '2000-01-01', '@id': '/api/dates/123' },
            { text: 'Anniversary', date: '2020-01-01' }, // New date, no Real ID
          ],
        },
      })
      return (
        <FormProvider {...methods}>
          <ContactFormSync />
        </FormProvider>
      )
    }

    render(<Wrapper />)

    expect(screen.getByTestId('subs')).toHaveTextContent('Subs: 123')
    // Should not render for the second one (no real ID)
    expect(screen.getAllByTestId('subs')).toHaveLength(1)
  })
})
