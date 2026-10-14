import fs from 'fs'
import path from 'path'
import { act, fireEvent, render, screen } from '@testing-library/react'

jest.mock('@/lib/global', () => ({
  useGlobal: () => ({ locale: { COMMON: {
    ARTICLE_LOCK_TIPS: 'Locked article', PASSWORD_ERROR: 'Incorrect password', SUBMIT: 'Submit'
  } } })
}))

const locks = fs.readdirSync(path.join(process.cwd(), 'themes')).flatMap(theme =>
  ['ArticleLock', 'PostLock'].filter(name => fs.existsSync(path.join(process.cwd(), 'themes', theme, 'components', name + '.js')))
    .map(name => ({ theme, name }))
)

it.each(locks)('$theme waits for an asynchronous password rejection', async ({ theme, name }) => {
  const module = require(`../../themes/${theme}/components/${name}`)
  const Lock = module[name] || module.default
  let finish
  const validPassword = jest.fn(() => new Promise(resolve => { finish = resolve }))
  const { container } = render(<Lock validPassword={validPassword} />)
  const input = container.querySelector('input[type="password"]')
  fireEvent.change(input, { target: { value: 'wrong' } })
  if (input.closest('form')) fireEvent.submit(input.closest('form'))
  else fireEvent.keyDown(input, { key: 'Enter' })
  expect(validPassword).toHaveBeenCalledWith('wrong')
  expect(screen.queryByText(/Incorrect password|INVALID_PASSWORD/)).not.toBeInTheDocument()
  await act(async () => finish(false))
  expect(await screen.findByText(/Incorrect password|INVALID_PASSWORD/)).toBeInTheDocument()
})
