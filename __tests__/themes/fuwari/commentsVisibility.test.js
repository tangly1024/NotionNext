import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { siteConfig } from '@/lib/config'
import { LayoutBase, LayoutSlug } from '@/themes/fuwari'

// Load the real Comment component so the shortcut must have an actual target.
jest.unmock('next/dynamic')
jest.mock('@/lib/config', () => ({ siteConfig: jest.fn() }))
jest.mock('@/lib/global', () => ({
  useGlobal: () => ({ locale: { COMMON: { COMMENTS: 'Comments' } } })
}))
jest.mock('@/lib/utils', () => ({ isBrowser: true, isSearchEngineBot: false }))
jest.mock('@/lib/utils/lang', () => ({
  generateLocaleDict: () => ({ COMMON: { COMMENTS: 'Comments' } })
}))
jest.mock('@/components/AlgoliaSearchModal', () => () => null)
jest.mock('@/components/Artalk', () => () => null)
jest.mock('@/components/NotionPage', () => () => null)
jest.mock('@/components/ShareBar', () => () => null)
jest.mock('@/themes/fuwari/style', () => ({ Style: () => null }))
jest.mock('@/themes/fuwari/components/Header', () => () => null)
jest.mock('@/themes/fuwari/components/Footer', () => () => null)
jest.mock('@/themes/fuwari/components/SidePanel', () => () => null)
jest.mock('@/themes/fuwari/components/Toc', () => () => null)
jest.mock('@/themes/fuwari/components/ArticleHeader', () => () => null)
jest.mock('@/themes/fuwari/components/ArticleCopyright', () => () => null)
jest.mock('@/themes/fuwari/components/ArticleAdjacent', () => () => null)

const post = { id: 'article', type: 'Post', title: 'Article', toc: [] }
const configure = (overrides = {}) => {
  const config = { COMMENT_GISCUS_REPO: 'owner/repo', ...overrides }
  siteConfig.mockImplementation((key, defaultValue) =>
    key in config ? config[key] : defaultValue
  )
}
const Page = props => (
  // _app gives LayoutBase the page data; the slug route owns the live lock state.
  <LayoutBase post={props.post}>
    <LayoutSlug {...props} />
  </LayoutBase>
)
const expectNoComments = container => {
  expect(screen.queryByRole('region', { name: 'Comments' })).toBeNull()
  expect(screen.queryByRole('button', { name: 'Comments' })).toBeNull()
  expect(container.querySelector('#comment')).toBeNull()
}

describe('Fuwari comment section and shortcut visibility', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', {
      value: 200,
      writable: true,
      configurable: true
    })
    configure()
  })

  it.each(['Post', 'Page'])('renders a working comment shortcut for an unlocked %s', async type => {
    const { container } = render(<Page post={{ ...post, type }} lock={false} />)
    expect(container.querySelectorAll('.fuwari-float-wrap')).toHaveLength(1)
    expect(screen.getByRole('region', { name: 'Comments' })).toBeInTheDocument()
    await waitFor(() => expect(container.querySelector('#comment')).not.toBeNull())

    const target = container.querySelector('#comment')
    const scrollIntoView = jest.fn()
    target.scrollIntoView = scrollIntoView
    fireEvent.click(screen.getByRole('button', { name: 'Comments' }))
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('hides the section and shortcut when article comments are disabled', () => {
    configure({ FUWARI_ARTICLE_COMMENT: false })
    const { container } = render(<Page post={post} lock={false} />)
    expectNoComments(container)
  })

  it('hides the section and shortcut for a locked article and restores both after unlock', async () => {
    const { container, rerender } = render(<Page post={post} lock />)
    expect(container.querySelectorAll('.fuwari-float-wrap')).toHaveLength(1)
    expectNoComments(container)

    rerender(<Page post={post} lock={false} />)
    expect(screen.getByRole('region', { name: 'Comments' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Comments' })).toBeInTheDocument()
    expect(container.querySelectorAll('.fuwari-float-wrap')).toHaveLength(1)
    await waitFor(() => expect(container.querySelector('#comment')).not.toBeNull())
  })

  it.each(['Post', 'Page'])('omits the empty comment section for a %s with comment Hide', type => {
    const { container } = render(
      <Page post={{ ...post, type, comment: 'Hide' }} lock={false} />
    )
    expectNoComments(container)
  })

  it.each([undefined, false, 'false'])('hides both when the only provider is %s', provider => {
    configure({ COMMENT_GISCUS_REPO: provider })
    const { container } = render(<Page post={post} lock={false} />)
    expectNoComments(container)
  })

  it('allows Notion comments without a third party provider', async () => {
    configure({ COMMENT_GISCUS_REPO: undefined, COMMENT_NOTION_ENABLE: 'true' })
    const { container } = render(<Page post={post} lock={false} />)
    expect(screen.getByRole('region', { name: 'Comments' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Comments' })).toBeInTheDocument()
    await waitFor(() => expect(container.querySelector('#comment')).not.toBeNull())
  })

  it('keeps comments when only the floating shortcut is disabled', async () => {
    configure({ FUWARI_WIDGET_TO_COMMENT: false })
    const { container } = render(<Page post={post} lock={false} />)
    expect(screen.getByRole('region', { name: 'Comments' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Comments' })).toBeNull()
    await waitFor(() => expect(container.querySelector('#comment')).not.toBeNull())
  })

  it('omits the section and shortcut outside an article or page', () => {
    const { container } = render(<Page />)
    expect(container.querySelectorAll('.fuwari-float-wrap')).toHaveLength(1)
    expectNoComments(container)
  })

  it('retains the base toolbar when the unavailable-unlock page skips LayoutSlug', () => {
    const { container } = render(
      <LayoutBase post={post} postUnlockUnavailable>
        <p>Unlock unavailable</p>
      </LayoutBase>
    )
    expect(container.querySelectorAll('.fuwari-float-wrap')).toHaveLength(1)
    expectNoComments(container)
  })
})
