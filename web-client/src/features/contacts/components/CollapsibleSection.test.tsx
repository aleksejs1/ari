import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { CollapsibleSection } from './CollapsibleSection'

describe('CollapsibleSection', () => {
  it('renders title and remains open by default', () => {
    render(
      <CollapsibleSection title="Test Section">
        <div>Content</div>
      </CollapsibleSection>,
    )

    expect(screen.getByText('Test Section')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('can be closed by default', () => {
    render(
      <CollapsibleSection title="Test Section" defaultOpen={false}>
        <div>Content</div>
      </CollapsibleSection>,
    )

    expect(screen.getByText('Test Section')).toBeInTheDocument()
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('toggles content visibility when title is clicked', () => {
    render(
      <CollapsibleSection title="Test Section" defaultOpen={false}>
        <div>Content</div>
      </CollapsibleSection>,
    )

    const toggle = screen.getByText('Test Section')
    fireEvent.click(toggle)
    expect(screen.getByText('Content')).toBeInTheDocument()

    fireEvent.click(toggle)
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('renders action element', () => {
    render(
      <CollapsibleSection title="Test Section" action={<button>Action</button>}>
        <div>Content</div>
      </CollapsibleSection>,
    )

    expect(screen.getByText('Action')).toBeInTheDocument()
  })
})
