import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ContactTimelinePage from './ContactTimelinePage'

// Mock child component
vi.mock('../components/ContactTimeline', () => ({
  ContactTimeline: ({ contactId }: any) => (
    <div data-testid="timeline">Timeline for {contactId}</div>
  ),
}))

// Mock navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('ContactTimelinePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders timeline with contact id from url', () => {
    render(
      <MemoryRouter initialEntries={['/contacts/123/timeline']}>
        <Routes>
          <Route path="/contacts/:id/timeline" element={<ContactTimelinePage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('auditLogs.timeline')).toBeInTheDocument()
    expect(screen.getByText('Timeline for 123')).toBeInTheDocument()
  })

  it('navigates back on button click', () => {
    render(
      <MemoryRouter initialEntries={['/contacts/123/timeline']}>
        <Routes>
          <Route path="/contacts/:id/timeline" element={<ContactTimelinePage />} />
        </Routes>
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('common.back'))
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })
})
