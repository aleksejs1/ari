import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, it, expect, vi } from 'vitest'

import { ContactFormBiography } from './ContactFormBiography'

const Wrapper = () => {
  const methods = useForm({
    defaultValues: {
      contactBiographies: [{ value: 'Initial Bio', type: 'Note' }],
    },
  })
  return (
    <FormProvider {...methods}>
      <form>
        <ContactFormBiography />
      </form>
    </FormProvider>
  )
}

const WrapperEmpty = () => {
  const methods = useForm({
    defaultValues: {
      contactBiographies: [],
    },
  })
  return (
    <FormProvider {...methods}>
      <form>
        <ContactFormBiography />
      </form>
    </FormProvider>
  )
}

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('ContactFormBiography', () => {
  it('renders existing biographies', () => {
    render(<Wrapper />)
    fireEvent.click(screen.getByText('contacts.biography'))
    expect(screen.getByDisplayValue('Initial Bio')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Note')).toBeInTheDocument()
  })

  it('adds a new biography', async () => {
    render(<WrapperEmpty />)

    // Check initial state: no textareas
    expect(screen.queryByPlaceholderText('contacts.biographyPlaceholder')).not.toBeInTheDocument()

    // Expand first
    fireEvent.click(screen.getByText('contacts.biography'))

    fireEvent.click(screen.getByText('contacts.addBiography'))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('contacts.biographyPlaceholder')).toBeInTheDocument()
    })
  })

  it('removes a biography', async () => {
    render(<Wrapper />)

    fireEvent.click(screen.getByText('contacts.biography'))
    expect(screen.getByDisplayValue('Initial Bio')).toBeInTheDocument()

    // The order of buttons:
    // 0: Collapsible toggle
    // 1: Add Biography button
    // 2: Remove button
    const buttons = screen.getAllByRole('button')
    const removeBtn = buttons[2]

    fireEvent.click(removeBtn)

    await waitFor(() => {
      expect(screen.queryByDisplayValue('Initial Bio')).not.toBeInTheDocument()
    })
  })
})
