import { describe, it, expect, vi } from 'vitest'
import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../Input'

describe('Input', () => {
  it('renders a basic input', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Input label="Email" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('associates label with input via htmlFor', () => {
    render(<Input label="Username" />)
    const input = screen.getByLabelText('Username')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('id', 'username')
  })

  it('uses custom id when provided', () => {
    render(<Input label="Email" id="custom-email" />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('id', 'custom-email')
  })

  it('renders error message', () => {
    render(<Input label="Email" error="Email is required" />)
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Email is required')
  })

  it('sets aria-invalid when error is present', () => {
    render(<Input label="Email" error="Invalid email" />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not set aria-invalid when no error', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid')
  })

  it('renders hint text when no error', () => {
    render(<Input label="Password" hint="At least 8 characters" />)
    expect(screen.getByText('At least 8 characters')).toBeInTheDocument()
  })

  it('hides hint when error is present', () => {
    render(<Input label="Password" hint="At least 8 characters" error="Too short" />)
    expect(screen.queryByText('At least 8 characters')).not.toBeInTheDocument()
    expect(screen.getByText('Too short')).toBeInTheDocument()
  })

  it('renders with icon', () => {
    const icon = <span data-testid="icon">🔍</span>
    render(<Input icon={icon} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('renders as disabled', () => {
    render(<Input label="Name" disabled />)
    const input = screen.getByLabelText('Name')
    expect(input).toBeDisabled()
    expect(input.className).toContain('opacity-50')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('handles change events', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Input label="Name" onChange={handleChange} />)
    await user.type(screen.getByLabelText('Name'), 'a')
    expect(handleChange).toHaveBeenCalled()
  })

  it('uses default type of text', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'text')
  })

  it('uses custom type', () => {
    render(<Input type="password" label="Password" />)
    const input = screen.getByLabelText('Password')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('generates input id from label with special chars', () => {
    render(<Input label="First Name!" />)
    const input = screen.getByLabelText('First Name!')
    expect(input).toHaveAttribute('id', 'first-name!')
  })
})
