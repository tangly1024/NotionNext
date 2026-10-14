import { act, fireEvent, render, screen } from '@testing-library/react'
import ArticleLock from '@/components/ArticleLock'
import useProtectedPost from '@/hooks/useProtectedPost'
import enUS from '@/lib/lang/en-US'
import { LayoutSlug as OpcPost } from '@/themes/opc'
import { LayoutSlug as LandingPost } from '@/themes/landing'
import Slug from '@/pages/[prefix]'
import { DynamicLayout } from '@/themes/theme'

jest.mock('@/lib/global', () => ({
  useGlobal: () => ({ locale: require('@/lib/lang/en-US').default })
}))
jest.mock('@/lib/config', () => ({ siteConfig: () => false }))
jest.mock('@/lib/themeConsoleStyle', () => ({ themeConsoleStyle: () => '' }))
jest.mock('@/components/NotionPage', () => ({
  __esModule: true,
  default: ({ post }) => (
    <p>{post.blockMap ? 'Authorized article body' : 'Empty article'}</p>
  )
}))
jest.mock('@/components/Comment', () => () => <p>Comments</p>)
jest.mock('@/components/ShareBar', () => () => null)
jest.mock('@/components/SmartLink', () => ({
  __esModule: true,
  default: ({ children, ...props }) => <a {...props}>{children}</a>
}))
jest.mock('@/components/LazyImage', () => () => null)
jest.mock('@/components/HeroIcons', () => ({
  Moon: () => null,
  Sun: () => null
}))
jest.mock('@/components/Loading', () => () => null)
jest.mock('@/lib/db/SiteDataApi', () => ({ resolvePostProps: jest.fn() }))
jest.mock('@/lib/build/staticPaths', () => ({ getStaticPathsBase: jest.fn() }))
jest.mock('@/lib/utils/post', () => ({ checkSlugHasNoSlash: jest.fn() }))
jest.mock('@/themes/theme', () => ({
  DynamicLayout: jest.fn(() => <p>Theme article layout</p>)
}))
jest.mock('@/components/Notification', () => () => ({
  showNotification: jest.fn(),
  Notification: () => null
}))
jest.mock('@/components/TechGrow', () => () => null)

const originalFetch = global.fetch
afterEach(() => {
  global.fetch = originalFetch
})

it.each([
  ['opc', OpcPost],
  ['landing', LandingPost]
])('%s unlocks only after server success', async (_, Layout) => {
  const initialPost = {
    id: 'protected',
    title: 'Protected article',
    password: 'protected'
  }
  const router = { locale: 'en-US' }
  const Article = () => {
    const access = useProtectedPost(initialPost, router, enUS)
    return <Layout {...access} />
  }
  let finish
  global.fetch = jest
    .fn()
    .mockImplementationOnce(
      () =>
        new Promise(resolve => {
          finish = resolve
        })
    )
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ post: { ...initialPost, blockMap: { block: {} } } })
    })
  const { container } = render(<Article />)
  const input = container.querySelector('input[type="password"]')
  fireEvent.change(input, { target: { value: 'wrong' } })
  fireEvent.submit(input.closest('form'))
  expect(screen.queryByText('Authorized article body')).not.toBeInTheDocument()
  expect(screen.queryByText('Comments')).not.toBeInTheDocument()
  expect(screen.queryByText(enUS.COMMON.PASSWORD_ERROR)).not.toBeInTheDocument()
  await act(async () => finish({ ok: false, status: 401 }))
  expect(screen.getByText(enUS.COMMON.PASSWORD_ERROR)).toBeInTheDocument()
  fireEvent.change(input, { target: { value: 'correct' } })
  await act(async () => fireEvent.submit(input.closest('form')))
  expect(screen.getByText('Authorized article body')).toBeInTheDocument()
  expect(container.querySelector('input[type="password"]')).toBeNull()
})

it('renders an explicit static-export notice without an unusable password form', () => {
  const validPassword = jest.fn()
  const { container } = render(
    <ArticleLock
      unavailable
      validPassword={validPassword}
      post={{ title: 'Protected title' }}
    />
  )
  expect(screen.getByText(enUS.COMMON.POST_UNLOCK_STATIC)).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: 'Protected title' })
  ).toBeInTheDocument()
  expect(container.querySelector('input')).toBeNull()
  expect(validPassword).not.toHaveBeenCalled()
})

it('uses the static notice across themes without issuing unlock requests', async () => {
  global.fetch = jest.fn()
  const { container } = render(
    <Slug
      post={{ id: 'locked', title: 'Static article', password: 'protected' }}
      postUnlockUnavailable
    />
  )
  await act(async () => {})
  expect(screen.getByText(enUS.COMMON.POST_UNLOCK_STATIC)).toBeInTheDocument()
  expect(container.querySelector('input')).toBeNull()
  expect(DynamicLayout).not.toHaveBeenCalled()
  expect(global.fetch).not.toHaveBeenCalled()
})
