import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { ContactsPagination } from './ContactsPagination'

describe('ContactsPagination', () => {
  it('renders correctly', () => {
    render(
      <ContactsPagination
        onPrevious={vi.fn()}
        onNext={vi.fn()}
        hasPrevious={true}
        hasNext={true}
      />,
    )
    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
  })

  it('calls onPrevious when previous button is clicked', () => {
    const onPrevious = vi.fn()
    render(
      <ContactsPagination
        onPrevious={onPrevious}
        onNext={vi.fn()}
        hasPrevious={true}
        hasNext={false}
      />,
    )
    fireEvent.click(screen.getByText('Previous'))
    expect(onPrevious).toHaveBeenCalled()
  })

  it('calls onNext when next button is clicked', () => {
    const onNext = vi.fn()
    render(
      <ContactsPagination
        onPrevious={vi.fn()}
        onNext={onNext}
        hasPrevious={false}
        hasNext={true}
      />,
    )
    fireEvent.click(screen.getByText('Next'))
    expect(onNext).toHaveBeenCalled()
  })

  it('disables previous button when hasPrevious is false', () => {
    render(
      <ContactsPagination
        onPrevious={vi.fn()}
        onNext={vi.fn()}
        hasPrevious={false}
        hasNext={true}
      />,
    )
    expect(screen.getByText('Previous')).toBeDisabled()
  })

  it('disables next button when hasNext is false', () => {
    render(
      <ContactsPagination
        onPrevious={vi.fn()}
        onNext={vi.fn()}
        hasPrevious={true}
        hasNext={false}
      />,
    )
    expect(screen.getByText('Next')).toBeDisabled()
  })
})
