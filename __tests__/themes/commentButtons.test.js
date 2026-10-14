import { render, screen } from '@testing-library/react'
import { siteConfig } from '@/lib/config'
import HexoButton from '@/themes/hexo/components/ButtonJumpToComment'
import MateryButton from '@/themes/matery/components/JumpToCommentButton'
import CommerceButton from '@/themes/commerce/components/JumpToCommentButton'
import HeoButton from '@/themes/heo/components/JumpToCommentButton'
import FuwariArea from '@/themes/fuwari/components/RightFloatArea'

jest.mock('@/lib/config', () => ({ siteConfig: jest.fn() }))
jest.mock('@/themes/commerce/config', () => ({ WIDGET_TO_COMMENT: true }))
jest.mock('@/lib/global', () => ({
  useGlobal: () => ({ locale: { COMMON: { COMMENTS: 'Comments' } } })
}))
jest.mock('@/themes/fuwari/components/Toc', () => () => null)

describe.each([
  ['hexo', HexoButton],
  ['matery', MateryButton],
  ['commerce', CommerceButton],
  ['heo', HeoButton]
])('%s comment shortcut', (theme, Button) => {
  it('hides when no comment provider is configured', () => {
    siteConfig.mockImplementation(key => key.includes('WIDGET_TO_COMMENT'))
    const { container } = render(<Button post={{ id: 'post' }} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows for an enabled provider and hides on a post that disables comments', () => {
    siteConfig.mockReturnValue(true)
    const { container, rerender } = render(<Button post={{ id: 'post' }} />)
    expect(container).not.toBeEmptyDOMElement()
    rerender(<Button post={{ id: 'post', comment: 'Hide' }} />)
    expect(container).toBeEmptyDOMElement()
  })
})

it('keeps the fuwari shortcut consistent with disabled providers and post settings', () => {
  const scrollY = window.scrollY
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 200 })
  try {
    siteConfig.mockImplementation(key =>
      key.startsWith('COMMENT_') ? 'false' : true
    )
    const { rerender } = render(<FuwariArea post={{ id: 'post' }} />)
    expect(
      screen.queryByRole('button', { name: 'Comments' })
    ).not.toBeInTheDocument()
    siteConfig.mockReturnValue(true)
    rerender(<FuwariArea post={{ id: 'post' }} />)
    expect(screen.getByRole('button', { name: 'Comments' })).toBeInTheDocument()
    rerender(<FuwariArea post={{ id: 'post', comment: 'Hide' }} />)
    expect(
      screen.queryByRole('button', { name: 'Comments' })
    ).not.toBeInTheDocument()
  } finally {
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: scrollY
    })
  }
})
