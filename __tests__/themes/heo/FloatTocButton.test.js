import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FloatTocButton from '@/themes/heo/components/FloatTocButton'

jest.mock('@/themes/heo/components/Catalog', () => () => <a href='#chapter'>Chapter</a>)

it('opens the directory from the keyboard and hides its links when closed', async () => {
  const user = userEvent.setup()
  render(<FloatTocButton post={{ toc: [{ id: 'chapter' }] }} />)
  const button = screen.getByRole('button', { name: '文章目录' })
  expect(button).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByRole('link', { name: 'Chapter' })).not.toBeInTheDocument()
  await user.tab()
  expect(button).toHaveFocus()
  await user.keyboard('{Enter}')
  expect(button).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('link', { name: 'Chapter' })).toBeVisible()
  await user.click(button)
  expect(button).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByRole('link', { name: 'Chapter' })).not.toBeInTheDocument()
})
