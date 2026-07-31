import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal, ConfirmModal } from '../Modal'

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal open={false} onClose={vi.fn()}>
        <p>Content</p>
      </Modal>,
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders content when open', () => {
    render(
      <Modal open={true} onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>,
    )
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(<Modal open={true} onClose={vi.fn()} title="My Title" />)
    expect(screen.getByText('My Title')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<Modal open={true} onClose={vi.fn()} description="A description" />)
    expect(screen.getByText('A description')).toBeInTheDocument()
  })

  it('has correct ARIA attributes', () => {
    render(<Modal open={true} onClose={vi.fn()} title="Dialog" />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    // Title id is generated per instance (useId) and must reference the heading
    const labelledby = dialog.getAttribute('aria-labelledby')
    expect(labelledby).toBeTruthy()
    expect(document.getElementById(labelledby!)).toHaveTextContent('Dialog')
  })

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn()
    render(<Modal open={true} onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    render(<Modal open={true} onClose={onClose} />)
    const backdrop = document.querySelector('[aria-hidden="true"]')
    expect(backdrop).toBeInTheDocument()
    fireEvent.click(backdrop!)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<Modal open={true} onClose={onClose} title="Test" />)
    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders footer when provided', () => {
    render(
      <Modal open={true} onClose={vi.fn()} footer={<button>Save</button>}>
        Content
      </Modal>,
    )
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('applies size class for sm', () => {
    const { container } = render(
      <Modal open={true} onClose={vi.fn()} size="sm">
        Small
      </Modal>,
    )
    const dialog = container.querySelector('[role="dialog"]')!
    expect(dialog.className).toContain('max-w-sm')
  })

  it('applies size class for lg', () => {
    const { container } = render(
      <Modal open={true} onClose={vi.fn()} size="lg">
        Large
      </Modal>,
    )
    const dialog = container.querySelector('[role="dialog"]')!
    expect(dialog.className).toContain('max-w-2xl')
  })

  it('hides close button when showClose is false', () => {
    render(<Modal open={true} onClose={vi.fn()} title="No close" showClose={false} />)
    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument()
  })

  it('locks body scroll when open', () => {
    render(
      <Modal open={true} onClose={vi.fn()}>
        Content
      </Modal>,
    )
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body scroll on unmount', () => {
    const { unmount } = render(
      <Modal open={true} onClose={vi.fn()}>
        Content
      </Modal>,
    )
    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('traps focus and wraps Tab from last to first focusable', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Trap">
        <input data-testid="first-input" />
        <input data-testid="last-input" />
      </Modal>,
    )

    // Focusable order: close button, first-input, last-input
    const lastInput = screen.getByTestId('last-input')
    const closeButton = screen.getByLabelText('Close modal')

    // Focus last input (last focusable), then Tab should wrap to close button (first focusable)
    lastInput.focus()
    expect(document.activeElement).toBe(lastInput)

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: false })
    expect(document.activeElement).toBe(closeButton)
  })

  it('wraps Shift+Tab from first to last focusable', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Wrap">
        <input data-testid="first-input" />
        <input data-testid="last-input" />
      </Modal>,
    )

    // Focusable order: close button, first-input, last-input
    const closeButton = screen.getByLabelText('Close modal')
    const lastInput = screen.getByTestId('last-input')

    // Focus close button (first focusable), then Shift+Tab should wrap to last input
    closeButton.focus()
    expect(document.activeElement).toBe(closeButton)

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(lastInput)
  })
})

describe('ConfirmModal', () => {
  it('renders with title and message', () => {
    render(
      <ConfirmModal
        open={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete?"
        message="Are you sure?"
      />,
    )
    expect(screen.getByText('Delete?')).toBeInTheDocument()
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  })

  it('renders Cancel and Confirm buttons', () => {
    render(
      <ConfirmModal
        open={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Are you sure?"
        message="Proceed?"
      />,
    )
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    // Also has the close X button (aria-label='Close modal')
    expect(screen.getByRole('button', { name: 'Close modal' })).toBeInTheDocument()
  })

  it('calls onConfirm when Confirm is clicked', () => {
    const onConfirm = vi.fn()
    render(
      <ConfirmModal
        open={true}
        onClose={vi.fn()}
        onConfirm={onConfirm}
        title="Are you sure?"
        message="Proceed?"
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Cancel is clicked', () => {
    const onClose = vi.fn()
    render(
      <ConfirmModal
        open={true}
        onClose={onClose}
        onConfirm={vi.fn()}
        title="Delete item?"
        message="Are you sure?"
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('disables buttons when isLoading', () => {
    render(
      <ConfirmModal
        open={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Loading"
        message="Please wait..."
        isLoading={true}
      />,
    )
    const cancelButton = screen.getByText('Cancel').closest('button')
    expect(cancelButton).toBeDisabled()
  })

  it('uses custom confirm label', () => {
    render(
      <ConfirmModal
        open={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Custom"
        message="Custom label"
        confirmLabel="Yes, delete it"
      />,
    )
    expect(screen.getByText('Yes, delete it')).toBeInTheDocument()
  })
})
