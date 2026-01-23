import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ContactsPagination } from './ContactsPagination'

describe('ContactsPagination', () => {
  it('renders correctly', () => {
    render(
      <ContactsPagination
        onPrevious={vi.fn()}
        onNext={vi.fn()}
        hasPrevious
        hasNext
        currentPage={1}
        totalPages={2}
      />,
    )
    expect(screen.getByText('pagination.previous')).toBeInTheDocument()
    expect(screen.getByText('pagination.next')).toBeInTheDocument()
    expect(screen.getByText('pagination.pageInfo')).toBeInTheDocument()
  })

  it('calls onPrevious when previous button is clicked', () => {
    const onPrevious = vi.fn()
    render(
      <ContactsPagination
        onPrevious={onPrevious}
        onNext={vi.fn()}
        hasPrevious
        hasNext={false}
        currentPage={2}
        totalPages={2}
      />,
    )
    fireEvent.click(screen.getByText('pagination.previous'))
    expect(onPrevious).toHaveBeenCalled()
  })

  it('calls onNext when next button is clicked', () => {
    const onNext = vi.fn()
    render(
      <ContactsPagination
        onPrevious={vi.fn()}
        onNext={onNext}
        hasPrevious={false}
        hasNext
        currentPage={1}
        totalPages={2}
      />,
    )
    fireEvent.click(screen.getByText('pagination.next'))
    expect(onNext).toHaveBeenCalled()
  })

  it('disables previous button when hasPrevious is false', () => {
    render(
      <ContactsPagination
        onPrevious={vi.fn()}
        onNext={vi.fn()}
        hasPrevious={false}
        hasNext
        currentPage={1}
        totalPages={1}
      />,
    )
    expect(screen.getByText('pagination.previous')).toBeDisabled()
  })

  it('disables next button when hasNext is false', () => {
    render(
      <ContactsPagination
        onPrevious={vi.fn()}
        onNext={vi.fn()}
        hasPrevious
        hasNext={false}
        currentPage={1}
        totalPages={1}
      />,
    )
    expect(screen.getByText('pagination.next')).toBeDisabled()
  })
})
