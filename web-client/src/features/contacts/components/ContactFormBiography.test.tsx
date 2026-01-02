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
    expect(screen.getByDisplayValue('Initial Bio')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Note')).toBeInTheDocument()
  })

  it('adds a new biography', async () => {
    render(<WrapperEmpty />)

    // Check initial state: no textareas
    expect(screen.queryByPlaceholderText('contacts.biographyPlaceholder')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('contacts.addBiography'))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('contacts.biographyPlaceholder')).toBeInTheDocument()
    })
  })

  it('removes a biography', async () => {
    render(<Wrapper />)

    expect(screen.getByDisplayValue('Initial Bio')).toBeInTheDocument()

    // Find the delete button
    // It is a button with a trash icon (lucide-react Trash2)
    // We can assume it's the last button in the DOM (Add is first, then the Remove)
    const buttons = screen.getAllByRole('button')
    const removeBtn = buttons[buttons.length - 1]

    fireEvent.click(removeBtn)

    await waitFor(() => {
      expect(screen.queryByDisplayValue('Initial Bio')).not.toBeInTheDocument()
    })
  })
})
