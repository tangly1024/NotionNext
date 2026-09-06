/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import SearchInput from '@/themes/fuwari/components/SearchInput'

const push = jest.fn(() => Promise.resolve())

jest.mock('@/lib/global', () => ({
  useGlobal: () => ({ locale: { SEARCH: { ARTICLES: 'Search articles' } } })
}))

jest.mock('next/router', () => ({
  useRouter: () => ({ push })
}))

describe('Fuwari SearchInput', () => {
  it('syncs its value when the keyword changes', () => {
    const { rerender } = render(<SearchInput keyword='foo' />)
    const input = screen.getByRole('searchbox')

    expect(input).toHaveValue('foo')

    rerender(<SearchInput keyword='bar' />)

    expect(input).toHaveValue('bar')
  })
})
