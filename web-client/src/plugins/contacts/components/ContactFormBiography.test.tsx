import { FormProvider, useForm } from 'react-hook-form'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

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

// Mock useContacts
vi.mock('../useContacts', () => ({
  useCreateGroup: vi.fn(),
  useGroups: vi.fn(),
  useUploadContactAvatar: vi.fn(),
}))

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
    // Check type field - TypeAutocomplete renders as input
    const inputs = screen.getAllByRole('textbox')
    expect(inputs.some((input) => (input as HTMLInputElement).value === 'Note')).toBe(true)
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

    // Find the trash icon button
    const trashIcon = screen.getByTestId('icon-Trash2')
    const removeBtn = trashIcon?.closest('button')

    expect(removeBtn).toBeTruthy()
    if (removeBtn) {
      fireEvent.click(removeBtn)
    }

    await waitFor(() => {
      expect(screen.queryByDisplayValue('Initial Bio')).not.toBeInTheDocument()
    })
  })
})
