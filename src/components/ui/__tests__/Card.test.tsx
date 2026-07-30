import { describe, it, expect } from 'vitest'
import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardContent, CardFooter } from '../Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Hello</Card>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders without hover by default', () => {
    const { container } = render(<Card>No hover</Card>)
    const div = container.firstChild as HTMLElement
    expect(div.className).not.toContain('hover:shadow-md')
  })

  it('applies hover styles when hover prop is true', () => {
    const { container } = render(<Card hover>Hover me</Card>)
    const div = container.firstChild as HTMLElement
    expect(div.className).toContain('hover:shadow-md')
    expect(div.className).toContain('hover:-translate-y-0.5')
  })

  it('applies custom className', () => {
    const { container } = render(<Card className="my-custom-class">Styled</Card>)
    const div = container.firstChild as HTMLElement
    expect(div.className).toContain('my-custom-class')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Card ref={ref}>Ref test</Card>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('renders with additional HTML attributes', () => {
    render(<Card data-testid="card">Test</Card>)
    expect(screen.getByTestId('card')).toBeInTheDocument()
  })
})

describe('CardHeader', () => {
  it('renders children', () => {
    render(<CardHeader>Header</CardHeader>)
    expect(screen.getByText('Header')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<CardHeader className="header-class">H</CardHeader>)
    const div = container.firstChild as HTMLElement
    expect(div.className).toContain('header-class')
    expect(div.className).toContain('px-6')
    expect(div.className).toContain('pt-6')
  })
})

describe('CardContent', () => {
  it('renders children', () => {
    render(<CardContent>Content</CardContent>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<CardContent className="content-class">C</CardContent>)
    const div = container.firstChild as HTMLElement
    expect(div.className).toContain('content-class')
  })
})

describe('CardFooter', () => {
  it('renders children', () => {
    render(<CardFooter>Footer</CardFooter>)
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<CardFooter className="footer-class">F</CardFooter>)
    const div = container.firstChild as HTMLElement
    expect(div.className).toContain('footer-class')
    expect(div.className).toContain('border-t')
  })
})

describe('Card composition', () => {
  it('renders Card with Header, Content, and Footer together', () => {
    render(
      <Card>
        <CardHeader>Title</CardHeader>
        <CardContent>Body text</CardContent>
        <CardFooter>Actions</CardFooter>
      </Card>,
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Body text')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })
})
