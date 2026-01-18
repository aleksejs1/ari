import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { useCreateGroup, useGroups } from '../useContacts'

import { ContactForm } from './ContactForm'

// Mock useContacts
vi.mock('../useContacts', () => ({
  useCreateGroup: vi.fn(),
  useGroups: vi.fn(),
  useUploadContactAvatar: vi.fn(() => ({ mutateAsync: vi.fn() })),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@/hooks/useUserPrefs.hook', () => ({
  useUserPrefs: () => ({
    dateFormat: 'yyyy-MM-dd',
    formatDate: (date: Date | string) => String(date),
  }),
}))

// Mock Sub-components if needed due to complexity, but integration test is better for validation check.
// We'll rely on actual sub-components to verify schema validation integration.

describe('ContactFormValidation', () => {
  beforeEach(() => {
    vi.mocked(useCreateGroup).mockReturnValue({ mutateAsync: vi.fn() } as unknown as ReturnType<
      typeof useCreateGroup
    >)
    vi.mocked(useGroups).mockReturnValue({ data: [] } as unknown as ReturnType<typeof useGroups>)
  })

  it('submits form with optional types for Phone, Email, Address, and Bio', async () => {
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)

    // 1. Fill Required Name
    const nameInput = screen.getByPlaceholderText('contacts.givenName')
    fireEvent.change(nameInput, { target: { value: 'Test Contact' } })

    // 2. Add Phone (No Type)
    // Click "Add Phone" button - text "contacts.phoneNumbers" might be header, need to find the add button.
    // Usually "Add" buttons have specific text or aria-label.
    // Assuming there is an "Add" button for each section or sections are auto-expanded if empty/default?
    // Let's assume we need to trigger "Add" or just fill the first one if present.
    // Looking at ContactForm.tsx, it renders <ContactFormNames /> etc.
    // Usually lists are empty initiate.
    // We might need to find buttons by text "contacts.addPhoneNumber" or similar if translated.
    // Since we mock t => key, we search for keys.

    // Trigger Add Phone
    const addPhoneBtn = screen.getByText('contacts.addPhoneNumber')
    fireEvent.click(addPhoneBtn)
    // Fill Value
    const phoneInputs = screen.getAllByPlaceholderText('contacts.phoneNumber')
    fireEvent.change(phoneInputs[0], { target: { value: '1234567890' } })

    // Clear default type
    const phoneTypeInputs = screen.getAllByPlaceholderText('contacts.phoneTypePlaceholder')
    fireEvent.change(phoneTypeInputs[0], { target: { value: '' } })

    // 3. Add Email (No Type)
    const addEmailBtn = screen.getByText('contacts.addEmailAddress')
    fireEvent.click(addEmailBtn)
    const emailInputs = screen.getAllByPlaceholderText('contacts.emailAddress')
    fireEvent.change(emailInputs[0], { target: { value: 'test@example.com' } })

    // Clear default type
    const emailTypeInputs = screen.getAllByPlaceholderText('contacts.emailTypePlaceholder')
    fireEvent.change(emailTypeInputs[0], { target: { value: '' } })

    // 4. Add Address (No Type)
    const addAddressBtn = screen.getByText('contacts.addAddress')
    fireEvent.click(addAddressBtn)
    // Address has multiple fields. Let's fill Street.
    // Need to find inputs. Placeholders usually "contacts.street" etc.
    // The address component might be complex. Let's try to query by placeholder.
    // Wait, "contacts.addAddress" might not be visible if section is collapsed.
    // But "Add" button is usually the trigger to open/add.
    // Clear default type
    const addressTypeInputs = screen.getAllByPlaceholderText('contacts.addressTypePlaceholder')
    fireEvent.change(addressTypeInputs[0], { target: { value: '' } })

    // 5. Add Bio (No Type)
    const addBioBtn = screen.getByText('contacts.addBiography')
    fireEvent.click(addBioBtn)
    const bioInputs = screen.getAllByPlaceholderText('contacts.biographyPlaceholder')
    fireEvent.change(bioInputs[0], { target: { value: 'Some bio text' } })

    const bioTypeInputs = screen.getAllByPlaceholderText('contacts.typePlaceholder')
    fireEvent.change(bioTypeInputs[0], { target: { value: '' } })

    // Submit
    const saveBtn = screen.getByText('common.save')
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
      const formData = onSubmit.mock.calls[0][0]

      // Allow empty string or undefined for type, but NOT validation error.
      expect(formData.phoneNumbers[0].value).toBe('1234567890')
      expect(formData.phoneNumbers[0].type).toBe('') // Or undefined/null depending on form lib

      expect(formData.contactEmailAdresses[0].value).toBe('test@example.com')

      expect(formData.contactBiographies[0].value).toBe('Some bio text')
    })
  })
})
