import { render, screen, fireEvent } from '@testing-library/react'
import { useForm, FormProvider } from 'react-hook-form'
import { describe, it, expect, vi } from 'vitest'

import { ContactFormOrganization } from './ContactFormOrganization'

import { type ContactFormValues } from '@/types/models'

// Mock translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

const Wrapper = ({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode
  defaultValues?: Partial<ContactFormValues>
}) => {
  const methods = useForm<ContactFormValues>({
    defaultValues: {
      contactOrganizations: [],
      ...defaultValues,
    },
  })
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('ContactFormOrganization', () => {
  it('renders empty state', () => {
    render(
      <Wrapper>
        <ContactFormOrganization />
      </Wrapper>,
    )
    expect(screen.getByText('contacts.organizations')).toBeInTheDocument()
    expect(screen.getByText('contacts.addOrganization')).toBeInTheDocument()
  })

  it('adds a new organization', () => {
    render(
      <Wrapper>
        <ContactFormOrganization />
      </Wrapper>,
    )

    fireEvent.click(screen.getByText('contacts.addOrganization'))

    expect(screen.getByPlaceholderText('contacts.organizationName')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('contacts.organizationTitle')).toBeInTheDocument()
  })

  it('removes an organization', () => {
    const defaultValues = {
      contactOrganizations: [
        {
          name: 'Org 1',
          title: 'Dev',
          type: 'Work',
          department: '',
          jobDescription: '',
          startDate: '',
          endDate: '',
        },
      ],
    }

    render(
      <Wrapper defaultValues={defaultValues}>
        <ContactFormOrganization />
      </Wrapper>,
    )

    expect(screen.getByDisplayValue('Org 1')).toBeInTheDocument()

    // Find remove button (trash icon)
    // Usually buttons inside the form item
    // In the component: <Button onClick={() => removeOrganization(index)} ...>
    // We can find by role button that is not "Add Organization"
    // Or better, look for the Trash2 icon container/button
    // Let's rely on the button rendering. It has `size="icon"` and variant `ghost`.
    // The accessible name might be missing if no aria-label, but we can try finding by role.
    // Or we can find by class if needed, but let's try finding the button in the org card.

    // Since we mocked translations and icons are SVGs, getting by text might be hard for icon buttons.
    // However, we can use container structure.
    const buttons = screen.getAllByRole('button')
    // 0 is Add, 1 is Remove (if 1 item)
    // Actually, Add is rendered first in the header. Remove is rendered inside the field map.
    // Let's find the one that IS NOT the Add button.
    const removeBtn = buttons.find((b) => !b.textContent?.includes('contacts.addOrganization'))

    expect(removeBtn).toBeDefined()
    if (removeBtn) {
      fireEvent.click(removeBtn)
    }

    expect(screen.queryByDisplayValue('Org 1')).not.toBeInTheDocument()
  })

  it('renders existing organizations', () => {
    const defaultValues = {
      contactOrganizations: [
        {
          name: 'Google',
          title: 'Engineer',
          type: 'Work',
          department: '',
          jobDescription: '',
          startDate: '',
          endDate: '',
        },
      ],
    }

    render(
      <Wrapper defaultValues={defaultValues}>
        <ContactFormOrganization />
      </Wrapper>,
    )

    expect(screen.getByDisplayValue('Google')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Engineer')).toBeInTheDocument()
  })
})
