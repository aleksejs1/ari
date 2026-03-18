import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { ContactInteraction } from '@/types/models'

import { InteractionTimeline } from './InteractionTimeline'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}))

vi.mock('./InteractionTypeIcon', () => ({
  InteractionTypeIcon: ({ type }: { type: string }) => <span data-testid="type-icon">{type}</span>,
}))

const INTERACTION: ContactInteraction = {
  '@id': '/api/contact_interactions/1',
  type: 'call',
  timestamp: '2024-01-15T12:00:00+00:00',
  description: 'Talked about the project',
  initiator: 'me',
  tags: ['business', 'follow-up'],
}

describe('InteractionTimeline', () => {
  it('renders empty state when no interactions', () => {
    render(<InteractionTimeline interactions={[]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('interactions.noInteractions')).toBeInTheDocument()
  })

  it('renders interaction type label', () => {
    render(<InteractionTimeline interactions={[INTERACTION]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('interactions.types.call')).toBeInTheDocument()
  })

  it('renders description when present', () => {
    render(<InteractionTimeline interactions={[INTERACTION]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Talked about the project')).toBeInTheDocument()
  })

  it('renders tags when present', () => {
    render(<InteractionTimeline interactions={[INTERACTION]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('business')).toBeInTheDocument()
    expect(screen.getByText('follow-up')).toBeInTheDocument()
  })

  it('renders initiator when present', () => {
    render(<InteractionTimeline interactions={[INTERACTION]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/interactions\.initiators\.me/)).toBeInTheDocument()
  })

  it('does not render description when absent', () => {
    const noDesc: ContactInteraction = { ...INTERACTION, description: undefined }
    render(<InteractionTimeline interactions={[noDesc]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByText('Talked about the project')).not.toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn()
    render(<InteractionTimeline interactions={[INTERACTION]} onEdit={onEdit} onDelete={vi.fn()} />)
    const editButtons = screen.getAllByRole('button')
    fireEvent.click(editButtons[0])
    expect(onEdit).toHaveBeenCalledWith(INTERACTION)
  })

  it('shows confirmation row when trash button is clicked', () => {
    render(<InteractionTimeline interactions={[INTERACTION]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    const trashButton = buttons[1]
    fireEvent.click(trashButton)
    expect(screen.getByText('interactions.deleteConfirm')).toBeInTheDocument()
    expect(screen.getByText('common.delete')).toBeInTheDocument()
    expect(screen.getByText('common.cancel')).toBeInTheDocument()
  })

  it('calls onDelete when confirm delete is clicked', () => {
    const onDelete = vi.fn()
    render(
      <InteractionTimeline interactions={[INTERACTION]} onEdit={vi.fn()} onDelete={onDelete} />,
    )
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[1]) // open confirm
    fireEvent.click(screen.getByText('common.delete'))
    expect(onDelete).toHaveBeenCalledWith(INTERACTION)
  })

  it('hides confirmation row when cancel is clicked', () => {
    render(<InteractionTimeline interactions={[INTERACTION]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[1]) // open confirm
    fireEvent.click(screen.getByText('common.cancel'))
    expect(screen.queryByText('interactions.deleteConfirm')).not.toBeInTheDocument()
  })

  it('disables confirm delete button when isDeleting=true', () => {
    render(
      <InteractionTimeline
        interactions={[INTERACTION]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        isDeleting
      />,
    )
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[1]) // open confirm
    expect(screen.getByText('common.delete')).toBeDisabled()
  })

  it('renders multiple interactions', () => {
    const second: ContactInteraction = {
      '@id': '/api/contact_interactions/2',
      type: 'email',
      timestamp: '2024-02-01T12:00:00+00:00',
    }
    render(
      <InteractionTimeline
        interactions={[INTERACTION, second]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    expect(screen.getByText('interactions.types.call')).toBeInTheDocument()
    expect(screen.getByText('interactions.types.email')).toBeInTheDocument()
  })
})
