import { render, screen } from '@testing-library/react'
import NotionLink, {
  shouldOpenNotionLinkInNewTab
} from '@/components/NotionLink'

describe('NotionLink', () => {
  it('opens external http links in a new tab', () => {
    render(<NotionLink href='https://example.com'>Example</NotionLink>)

    const link = screen.getByRole('link', { name: 'Example' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('preserves existing rel tokens when forcing a new tab', () => {
    render(
      <NotionLink href='https://example.com' rel='nofollow sponsored'>
        Example
      </NotionLink>
    )

    const link = screen.getByRole('link', { name: 'Example' })
    expect(link).toHaveAttribute('rel', expect.stringContaining('nofollow'))
    expect(link).toHaveAttribute('rel', expect.stringContaining('sponsored'))
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
  })

  it('keeps mailto links in the current tab by default', () => {
    render(<NotionLink href='mailto:test@example.com'>Mail</NotionLink>)

    const link = screen.getByRole('link', { name: 'Mail' })
    expect(link).toHaveAttribute('href', 'mailto:test@example.com')
    expect(link).not.toHaveAttribute('target')
    expect(link).not.toHaveAttribute('rel')
  })

  it('keeps explicit blank targets and adds safe rel tokens', () => {
    render(
      <NotionLink href='mailto:test@example.com' target='_blank'>
        Mail
      </NotionLink>
    )

    const link = screen.getByRole('link', { name: 'Mail' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

describe('shouldOpenNotionLinkInNewTab', () => {
  it('returns true for explicit blank targets and http links', () => {
    expect(
      shouldOpenNotionLinkInNewTab('mailto:test@example.com', '_blank')
    ).toBe(true)
    expect(shouldOpenNotionLinkInNewTab('https://example.com')).toBe(true)
    expect(shouldOpenNotionLinkInNewTab('http://example.com')).toBe(true)
  })

  it('returns false for non-http links without an explicit target', () => {
    expect(shouldOpenNotionLinkInNewTab('/posts/demo')).toBe(false)
    expect(shouldOpenNotionLinkInNewTab('#section-1')).toBe(false)
    expect(shouldOpenNotionLinkInNewTab('mailto:test@example.com')).toBe(false)
  })
})
