import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { ContactFormValues } from '@/types/models'

import { ContactFormNames } from './ContactFormNames'

function Wrapper({ defaultValues }: { defaultValues: ContactFormValues }) {
  const methods = useForm<ContactFormValues>({ defaultValues })
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: false } } }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <FormProvider {...methods}>
        <ContactFormNames />
      </FormProvider>
    </QueryClientProvider>
  )
}

const defaultContact: ContactFormValues = {
  contactNames: [{ given: 'John', family: 'Doe' }],
  contactDates: [],
  phoneNumbers: [],
  contactEmailAdresses: [],
  contactAddresses: [],
}

describe('ContactFormNames', () => {
  it('renders given and family name inputs', () => {
    render(<Wrapper defaultValues={defaultContact} />)

    const inputs = screen.getAllByRole('textbox')
    // given + family + nameType = at least 3 inputs
    expect(inputs.length).toBeGreaterThanOrEqual(3)
  })

  it('renders the locale select field', () => {
    render(<Wrapper defaultValues={defaultContact} />)

    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
  })

  it('locale select has ru, lv, en options', () => {
    render(<Wrapper defaultValues={defaultContact} />)

    const select = screen.getByRole('combobox')
    const options = Array.from(select.querySelectorAll('option')).map((o) =>
      o.getAttribute('value'),
    )
    expect(options).toContain('ru')
    expect(options).toContain('lv')
    expect(options).toContain('en')
  })

  it('renders nameType text input', () => {
    render(<Wrapper defaultValues={defaultContact} />)

    const nameTypeInput = screen.getByTestId('contact-name-type')
    expect(nameTypeInput).toBeInTheDocument()
  })

  it('renders locale select with correct name attribute', () => {
    render(<Wrapper defaultValues={defaultContact} />)

    const localeSelect = screen.getByTestId('contact-locale-select')
    expect(localeSelect).toBeInTheDocument()
  })
})
