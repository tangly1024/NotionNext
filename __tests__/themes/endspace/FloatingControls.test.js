import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { siteConfig } from '@/lib/config'
import FloatingControls from '@/themes/endspace/components/FloatingControls'

jest.mock('@/lib/config', () => ({ siteConfig: jest.fn() }))
jest.mock('notion-utils', () => ({ uuidToId: id => id }))
jest.mock('@/themes/endspace/components/SideBar', () => ({
  SideBar: () => null
}))

const post = { id: 'article' }
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
