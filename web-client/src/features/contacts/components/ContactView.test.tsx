import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { ContactView } from './ContactView'

import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import { type Contact } from '@/types/models'

// Mock useUserPrefs hook
vi.mock('@/hooks/useUserPrefs.hook', () => ({
  useUserPrefs: vi.fn(),
}))

// Mock icons to avoid rendering issues
vi.mock('lucide-react', () => ({
  Pencil: () => <span data-testid="icon-pencil">Pencil</span>,
  Phone: () => <span data-testid="icon-phone">Phone</span>,
  Mail: () => <span data-testid="icon-mail">Mail</span>,
  MapPin: () => <span data-testid="icon-mappin">MapPin</span>,
  Briefcase: () => <span data-testid="icon-briefcase">Briefcase</span>,
  Users: () => <span data-testid="icon-users">Users</span>,
  Calendar: () => <span data-testid="icon-calendar">Calendar</span>,
  FileText: () => <span data-testid="icon-filetext">FileText</span>,
  User: () => <span data-testid="icon-user">User</span>,
}))

const mockContact: Contact = {
  id: '123',
  '@id': '/api/contacts/123',
  '@type': 'Contact',
  contactNames: [
    {
      given: 'John',
      family: 'Doe',
      '@id': 'name-1',
      '@type': 'ContactName',
    },
  ],
  phoneNumbers: [
    {
      value: '+1234567890',
      type: 'Mobile',
      '@id': 'phone-1',
      '@type': 'ContactPhoneNumber',
    },
  ],
  contactEmailAdresses: [
    {
      value: 'john@example.com',
      type: 'Work',
      '@id': 'email-1',
      '@type': 'ContactEmailAdress',
    },
  ],
  contactAddresses: [
    {
      street: '123 Main St',
      city: 'Somewhere',
      country: 'US',
      type: 'Home',
      '@id': 'addr-1',
      '@type': 'ContactAddress',
    },
  ],
  contactOrganizations: [
    {
      name: 'Acme Corp',
      title: 'Engineer',
      '@id': 'org-1',
      '@type': 'ContactOrganization',
    },
  ],
  contactGroups: [
    {
      groupResource: { name: 'Friends', '@id': 'group-1' },
      '@id': 'cg-1',
      '@type': 'ContactGroup',
    },
  ],
  contactDates: [
    {
      date: '2000-01-01T00:00:00Z',
      text: 'Birthday',
      yearsPassed: 24,
      nextAnniversaryDate: '2024-01-01',
      yearsAtNextAnniversary: 25,
      '@id': 'date-1',
      '@type': 'ContactDate',
    },
  ],
  contactBiographies: [
    {
      value: 'A short bio',
      type: 'General',
      '@id': 'bio-1',
      '@type': 'ContactBiography',
    },
  ],
}

describe('ContactView', () => {
  beforeEach(() => {
    ;(useUserPrefs as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      formatDate: (date: string) => new Date(date).toLocaleDateString('en-US'),
      language: 'en',
      dateFormat: 'mm/dd/yyyy',
    })
  })

  it('renders contact information correctly', () => {
    const onEdit = vi.fn()
    render(<ContactView contact={mockContact} onEdit={onEdit} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('+1234567890')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText(/123 Main St/)).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Friends')).toBeInTheDocument()
    expect(screen.getByText('A short bio')).toBeInTheDocument()
    expect(screen.getByText(/25/)).toBeInTheDocument() // Check for anniversary year
  })

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn()
    render(<ContactView contact={mockContact} onEdit={onEdit} />)

    fireEvent.click(screen.getByText('common.edit'))
    expect(onEdit).toHaveBeenCalledTimes(1)
  })
})
