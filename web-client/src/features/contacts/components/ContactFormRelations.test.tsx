import { zodResolver } from '@hookform/resolvers/zod'
import { render, screen, fireEvent } from '@testing-library/react'
import { useForm, FormProvider } from 'react-hook-form'
import { describe, it, expect, vi } from 'vitest'
import { z } from 'zod'

import { ContactFormRelations } from './ContactFormRelations'

import { type ContactFormValues } from '@/types/models'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('./ContactAutocomplete', () => ({
  ContactAutocomplete: ({
    value,
    onChange,
    initialLabel,
  }: {
    value: string | { '@id': string } | null
    onChange: (v: string | { '@id': string } | null) => void
    initialLabel: string
  }) => (
    <div data-testid="autocomplete">
      <input
        data-testid="autocomplete-input"
        value={typeof value === 'string' ? value : value?.['@id'] || ''}
        onChange={(e) => onChange(e.target.value)}
      />
      <span>{initialLabel}</span>
    </div>
  ),
}))

const Wrapper = ({
  children,
  defaultValues,
}: {
  children: React.ReactNode
  defaultValues?: Partial<ContactFormValues>
}) => {
  const methods = useForm<ContactFormValues>({
    defaultValues: defaultValues || {
      contactRelations: [],
    },
    resolver: zodResolver(
      z.object({
        contactRelations: z
          .array(
            z.object({
              relatedContact: z.union([z.string(), z.object({ '@id': z.string() })]),
              type: z.string().min(1),
              displayName: z.string().optional(),
            }),
          )
          .optional(),
      }),
    ),
  })
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('ContactFormRelations', () => {
  it('can add a relation', () => {
    render(
      <Wrapper>
        <ContactFormRelations />
      </Wrapper>,
    )

    // Expand
    fireEvent.click(screen.getByText('contacts.relations'))

    fireEvent.click(screen.getByText('contacts.addRelation'))

    expect(screen.queryByText('contacts.noContacts')).not.toBeInTheDocument()
    expect(screen.getByTestId('autocomplete')).toBeInTheDocument()
  })

  it('can remove a relation', () => {
    const defaultValues = {
      contactRelations: [
        { relatedContact: '/api/contacts/1', type: 'friend', displayName: 'John' },
      ],
    }
    render(
      <Wrapper defaultValues={defaultValues}>
        <ContactFormRelations />
      </Wrapper>,
    )

    // Expand
    fireEvent.click(screen.getByText('contacts.relations'))

    expect(screen.getByTestId('autocomplete')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'common.delete' }))
  })

  it('passes displayName to autocomplete as initialLabel', () => {
    const defaultValues = {
      contactRelations: [
        { relatedContact: '/api/contacts/1', type: 'friend', displayName: 'John Doe' },
      ],
    }
    render(
      <Wrapper defaultValues={defaultValues}>
        <ContactFormRelations />
      </Wrapper>,
    )

    // Expand
    fireEvent.click(screen.getByText('contacts.relations'))

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})
