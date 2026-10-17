import { render, screen } from '@testing-library/react'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { LayoutSlug } from '@/themes/heo'

jest.mock('@/lib/config', () => ({ siteConfig: jest.fn() }))
jest.mock('@/lib/global', () => ({ useGlobal: jest.fn() }))
jest.mock('next/router', () => ({ useRouter: () => ({ push: jest.fn() }) }))
jest.mock('@/lib/plugins/wow', () => ({ loadWowJS: jest.fn() }))
jest.mock(
  '@/components/Comment',
  () =>
    function MockComment({ frontMatter }) {
      return <div data-testid='comment-provider'>{frontMatter.id}</div>
    }
)
jest.mock('@/components/GoogleAdsense', () => ({ AdSlot: () => null }))
jest.mock('@/components/LazyImage', () => () => null)
jest.mock('@/components/LoadingCover', () => () => null)
jest.mock('@/components/Mark', () => jest.fn())
jest.mock('@/components/NotionPage', () => () => null)
jest.mock('@/components/ShareBar', () => () => null)
jest.mock('@/components/WWAds', () => () => null)
jest.mock('@/components/AISummary', () => () => null)
jest.mock('@/components/ArticleExpirationNotice', () => () => null)
jest.mock('@/themes/heo/components/BlogPostArchive', () => () => null)
jest.mock('@/themes/heo/components/BlogPostListPage', () => () => null)
jest.mock('@/themes/heo/components/BlogPostListScroll', () => () => null)
jest.mock('@/themes/heo/components/CategoryBar', () => () => null)
jest.mock('@/themes/heo/components/FloatTocButton', () => () => null)
jest.mock('@/themes/heo/components/Footer', () => () => null)
jest.mock('@/themes/heo/components/Header', () => () => null)
jest.mock('@/themes/heo/components/Hero', () => () => null)
jest.mock('@/themes/heo/components/LatestPostsGroup', () => () => null)
jest.mock('@/themes/heo/components/NoticeBar', () => ({
  NoticeBar: () => null
}))
jest.mock('@/themes/heo/components/PostAdjacent', () => () => null)
jest.mock('@/themes/heo/components/PostCopyright', () => () => null)
jest.mock('@/themes/heo/components/PostHeader', () => () => null)
jest.mock('@/themes/heo/components/PostLock', () => ({ PostLock: () => null }))
jest.mock('@/themes/heo/components/PostRecommend', () => () => null)
jest.mock('@/themes/heo/components/SearchNav', () => () => null)
jest.mock('@/themes/heo/components/SideRight', () => () => null)
jest.mock('@/themes/heo/style', () => ({ Style: () => null }))

const post = { id: 'article', type: 'Post' }
const locale = { COMMON: { COMMENTS: 'Comments' } }

beforeEach(() => {
  useGlobal.mockReturnValue({ locale, fullWidth: false })
  siteConfig.mockReturnValue(false)
})

it.each([
  ['COMMENT_ARTALK_SERVER', 'https://comments.example.com'],
  ['COMMENT_TWIKOO_ENV_ID', 'twikoo-environment'],
  ['COMMENT_WALINE_SERVER_URL', 'https://comments.example.com'],
  ['COMMENT_VALINE_APP_ID', 'app-id'],
  ['COMMENT_GISCUS_REPO', 'owner/repo'],
  ['COMMENT_CUSDIS_APP_ID', 'app-id'],
  ['COMMENT_UTTERRANCES_REPO', 'owner/repo'],
  ['COMMENT_GITALK_CLIENT_ID', 'client-id'],
  ['COMMENT_WEBMENTION_ENABLE', true],
  ['COMMENT_NOTION_ENABLE', 'true']
])(
  'renders the actual Heo comment region with only %s enabled',
  (key, value) => {
    siteConfig.mockImplementation(name => (name === key ? value : false))
    render(<LayoutSlug post={post} />)
    expect(screen.getByText('Comments')).toBeVisible()
    expect(screen.getByTestId('comment-provider')).toHaveTextContent('article')
  }
)

it.each([undefined, false, 'false'])(
  'omits the comment heading and provider when configuration is disabled (%s)',
  value => {
    siteConfig.mockReturnValue(value)
    render(<LayoutSlug post={post} />)
    expect(screen.queryByText('Comments')).not.toBeInTheDocument()
    expect(screen.queryByTestId('comment-provider')).not.toBeInTheDocument()
  }
)

it('omits comments on hidden or locked posts and in full-width mode', () => {
  siteConfig.mockImplementation(key => key === 'COMMENT_NOTION_ENABLE')
  const { rerender } = render(
    <LayoutSlug post={{ ...post, comment: 'Hide' }} />
  )
  expect(screen.queryByTestId('comment-provider')).not.toBeInTheDocument()
  rerender(<LayoutSlug post={post} lock />)
  expect(screen.queryByTestId('comment-provider')).not.toBeInTheDocument()
  useGlobal.mockReturnValue({ locale, fullWidth: true })
  rerender(<LayoutSlug post={post} lock={false} />)
  expect(screen.queryByTestId('comment-provider')).not.toBeInTheDocument()
  useGlobal.mockReturnValue({ locale, fullWidth: false })
  rerender(<LayoutSlug post={post} lock={false} />)
  expect(screen.getByTestId('comment-provider')).toBeVisible()
})
