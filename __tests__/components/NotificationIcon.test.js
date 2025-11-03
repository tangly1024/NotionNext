// __tests__/components/NotionIcon.test.js
import { render, screen } from '@testing-library/react'
import NotionIcon from '@/components/NotionIcon'

describe('NotionIcon Component', () => {
  it('renders nothing when icon is null', () => {
    const { container } = render(<NotionIcon icon={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when icon is undefined', () => {
    const { container } = render(<NotionIcon icon={undefined} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders image for HTTP URL', () => {
    render(<NotionIcon icon="https://example.com/icon.png" />)
    const img = screen.getByRole('img')
    
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/icon.png')
    expect(img).toHaveClass('w-8', 'h-8')
  })

  it('renders image for data URL', () => {
    const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    render(<NotionIcon icon={dataUrl} />)
    const img = screen.getByRole('img')
    
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', dataUrl)
  })

  it('renders emoji as text', () => {
    const { container } = render(<NotionIcon icon="🚀" />)
    const span = container.querySelector('span')
    
    expect(span).toBeInTheDocument()
    expect(span).toHaveTextContent('🚀')
    expect(span).toHaveClass('mr-1')
  })

  it('renders text icon', () => {
    const { container } = render(<NotionIcon icon="A" />)
    const span = container.querySelector('span')
    
    expect(span).toBeInTheDocument()
    expect(span).toHaveTextContent('A')
  })
})