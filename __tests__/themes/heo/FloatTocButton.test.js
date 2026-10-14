import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FloatTocButton from '@/themes/heo/components/FloatTocButton'

jest.mock('@/themes/heo/components/Catalog', () => () => (
  <a href='#chapter'>Chapter</a>
))

it('opens the directory from the keyboard and hides its links when closed', async () => {
  const user = userEvent.setup()
  render(<FloatTocButton post={{ toc: [{ id: 'chapter' }] }} />)
  const button = screen.getByRole('button', { name: '文章目录' })
  expect(button).toHaveAttribute('aria-expanded', 'false')
  expect(
    screen.queryByRole('link', { name: 'Chapter' })
  ).not.toBeInTheDocument()
  await user.tab()
  expect(button).toHaveFocus()
  await user.keyboard('{Enter}')
  expect(button).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('link', { name: 'Chapter' })).toBeVisible()
  await user.click(button)
  expect(button).toHaveAttribute('aria-expanded', 'false')
  expect(
    screen.queryByRole('link', { name: 'Chapter' })
  ).not.toBeInTheDocument()
})

it('closes with Escape from a directory link and returns focus to the trigger', async () => {
  const user = userEvent.setup()
  render(<FloatTocButton post={{ toc: [{ id: 'chapter' }] }} />)
  const button = screen.getByRole('button', { name: '文章目录' })
  await user.click(button)
  await user.tab()
  expect(screen.getByRole('link', { name: 'Chapter' })).toHaveFocus()
  await user.keyboard('{Escape}')
  expect(button).toHaveFocus()
  expect(button).toHaveAttribute('aria-expanded', 'false')
  const panel = document.getElementById('heo-floating-toc')
  expect(panel).toHaveAttribute('inert')
  expect(panel).not.toHaveAttribute('hidden')
  expect(screen.queryByRole('link')).not.toBeInTheDocument()
})

it('returns focus after backdrop dismissal and resets on a different post', async () => {
  const user = userEvent.setup()
  const { rerender } = render(
    <FloatTocButton post={{ id: 'first', toc: [{ id: 'chapter' }] }} />
  )
  const button = screen.getByRole('button', { name: '文章目录' })
  await user.click(button)
  await user.click(document.getElementById('right-drawer-background'))
  expect(button).toHaveFocus()
  expect(button).toHaveAttribute('aria-expanded', 'false')
  await user.click(button)
  rerender(<FloatTocButton post={{ id: 'second', toc: [{ id: 'chapter' }] }} />)
  expect(button).toHaveAttribute('aria-expanded', 'false')
})
