import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { siteConfig } from '@/lib/config'
import FloatingControls from '@/themes/endspace/components/FloatingControls'
import { LayoutBase, LayoutSlug } from '@/themes/endspace'

jest.mock('@/lib/config', () => ({ siteConfig: jest.fn() }))
jest.mock('@/lib/global', () => ({
  useGlobal: () => ({ onLoading: false, fullWidth: false })
}))
jest.mock('next/router', () => ({ useRouter: () => mockRouter }))
jest.mock('@headlessui/react', () => ({
  Transition: ({ children }) => <>{children}</>
}))
jest.mock('@/components/NotionPage', () => () => null)
jest.mock('@/components/ShareBar', () => () => null)
jest.mock('@/components/Comment', () => function MockComment() {
  return <div>Discussion</div>
})
jest.mock('@/themes/endspace/style', () => ({ Style: () => null }))
jest.mock('@/themes/endspace/components/SideNav', () => ({ SideNav: () => null }))
jest.mock('@/themes/endspace/components/Footer', () => ({ Footer: () => null }))
jest.mock('@/themes/endspace/components/PostMeta', () => ({ PostMeta: () => null }))
jest.mock('@/themes/endspace/components/PostLock', () => ({ PostLock: () => <div>Password required</div> }))
jest.mock('@/themes/endspace/components/MobileNav', () => () => null)
jest.mock('@/themes/endspace/components/TitleBar', () => () => null)
jest.mock('@/themes/endspace/components/LoadingCover', () => () => null)
jest.mock('@/themes/endspace/components/ArticleAdjacent', () => () => null)
jest.mock('@/themes/endspace/components/useViewportScale', () => () => null)
jest.mock('notion-utils', () => ({ uuidToId: id => id }))
jest.mock('@/themes/endspace/components/SideBar', () => ({
  SideBar: () => null
}))

const post = { id: 'article' }
const mockRouter = { push: jest.fn().mockResolvedValue(true), asPath: '/article' }
const toc = [{ id: 'chapter', text: 'Chapter' }]
const commentButton = () =>
  screen.queryByRole('button', { name: 'Jump to Comments' })

beforeEach(() => {
  siteConfig.mockImplementation(key =>
    key === 'COMMENT_ARTALK_SERVER' ? 'https://comments.example.com' : false
  )
})

it.each([undefined, false, 'false'])(
  'hides the shortcut when providers are disabled (%s), even with a TOC',
  value => {
    siteConfig.mockReturnValue(value)
    render(<FloatingControls post={post} toc={toc} />)
    expect(commentButton()).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Table of Contents' })
    ).toBeInTheDocument()
  }
)

it('hides the shortcut outside an article, for hidden comments, and while locked', () => {
  const { rerender } = render(<FloatingControls toc={toc} />)
  expect(commentButton()).not.toBeInTheDocument()
  rerender(<FloatingControls post={{ ...post, comment: 'Hide' }} toc={toc} />)
  expect(commentButton()).not.toBeInTheDocument()
  rerender(<FloatingControls post={post} lock toc={toc} />)
  expect(commentButton()).not.toBeInTheDocument()
  rerender(<FloatingControls post={post} lock={false} toc={toc} />)
  expect(commentButton()).toBeInTheDocument()
})

it.each([undefined, []])(
  'scrolls to comments on articles without a TOC (%s)',
  async toc => {
    const user = userEvent.setup()
    render(
      <>
        <FloatingControls post={post} toc={toc} />
        <div id='comments' data-testid='comments'>
          Discussion
        </div>
      </>
    )
    const comments = screen.getByTestId('comments')
    const scrollIntoView = jest.fn()
    comments.scrollIntoView = scrollIntoView
    await user.click(commentButton())
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    expect(
      screen.queryByRole('button', { name: 'Table of Contents' })
    ).not.toBeInTheDocument()
  }
)

it('supports standalone Notion comments and reflects later configuration changes', () => {
  siteConfig.mockImplementation(key =>
    key === 'COMMENT_NOTION_ENABLE' ? 'true' : false
  )
  const { rerender } = render(<FloatingControls post={post} />)
  expect(commentButton()).toBeInTheDocument()
  siteConfig.mockReturnValue('false')
  rerender(<FloatingControls post={post} />)
  expect(commentButton()).not.toBeInTheDocument()
})

// Match _app: the base only receives public page props; the slug owns unlock state.
const ArticlePage = ({ lock }) => (
  <LayoutBase post={{ ...post, password: true }}>
    <LayoutSlug post={post} lock={lock} />
  </LayoutBase>
)

it('uses live article access state for the single toolbar across unlock and relock', () => {
  const { rerender } = render(<ArticlePage lock />)
  expect(commentButton()).not.toBeInTheDocument()
  expect(screen.getAllByRole('button', { name: 'Scroll To Top' })).toHaveLength(1)
  rerender(<ArticlePage lock={false} />)
  expect(commentButton()).toBeInTheDocument()
  expect(screen.getAllByRole('button', { name: 'Scroll To Top' })).toHaveLength(1)
  rerender(<ArticlePage lock />)
  expect(commentButton()).not.toBeInTheDocument()
})

it('retains a toolbar outside articles and when unlocking is unavailable', () => {
  const { rerender } = render(<LayoutBase />)
  expect(commentButton()).not.toBeInTheDocument()
  expect(screen.getAllByRole('button', { name: 'Scroll To Top' })).toHaveLength(1)
  rerender(<LayoutBase><LayoutSlug /></LayoutBase>)
  expect(commentButton()).not.toBeInTheDocument()
  expect(screen.getAllByRole('button', { name: 'Scroll To Top' })).toHaveLength(1)
  rerender(<LayoutBase post={post} postUnlockUnavailable />)
  expect(commentButton()).not.toBeInTheDocument()
  expect(screen.getAllByRole('button', { name: 'Scroll To Top' })).toHaveLength(1)
})

it('does not redirect a reader waiting at the password form to 404', () => {
  jest.useFakeTimers()
  try {
    siteConfig.mockImplementation((key, fallback) => key === 'POST_WAITING_TIME_FOR_404' ? 9 : fallback)
    const { unmount } = render(<ArticlePage lock />)
    act(() => jest.advanceTimersByTime(10000))
    expect(mockRouter.push).not.toHaveBeenCalled()
    unmount()
  } finally {
    jest.useRealTimers()
  }
})

it('still redirects a missing article after the waiting period', () => {
  jest.useFakeTimers()
  try {
    siteConfig.mockImplementation((key, fallback) => key === 'POST_WAITING_TIME_FOR_404' ? 9 : fallback)
    const { unmount } = render(<LayoutSlug />)
    act(() => jest.advanceTimersByTime(10000))
    expect(mockRouter.push).toHaveBeenCalledWith('/404')
    unmount()
  } finally {
    jest.useRealTimers()
  }
})
