import { act, render, screen } from '@testing-library/react'
import Comment from '@/components/Comment'
import { siteConfig } from '@/lib/config'

jest.mock('@/lib/config', () => ({ siteConfig: jest.fn() }))
jest.mock('@/lib/utils', () => ({ isBrowser: true, isSearchEngineBot: false }))
jest.mock('@/components/Artalk', () => () => null)
jest.mock('@/components/Tabs', () => ({ children }) => (
  <>
    {children.filter(Boolean).map(child => (
      <span key={child.key}>{child.key}</span>
    ))}
  </>
))

it('does not render string-false providers alongside an enabled service', () => {
  let onIntersection
  const Observer = global.IntersectionObserver
  global.IntersectionObserver = class {
    constructor(callback) {
      onIntersection = callback
    }
    observe() {}
    unobserve() {}
  }
  try {
    siteConfig.mockImplementation(key =>
      key === 'COMMENT_NOTION_ENABLE' ? true : 'false'
    )
    const { unmount } = render(<Comment frontMatter={{ id: 'post' }} />)
    act(() =>
      onIntersection([
        { isIntersecting: true, target: document.getElementById('comment') }
      ])
    )
    expect(screen.getByText('Notion')).toBeInTheDocument()
    expect(screen.queryByText('WebMention')).not.toBeInTheDocument()
    expect(screen.queryByText('Artalk')).not.toBeInTheDocument()
    unmount()
  } finally {
    global.IntersectionObserver = Observer
  }
})
