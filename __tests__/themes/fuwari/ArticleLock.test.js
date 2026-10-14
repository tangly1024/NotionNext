import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ArticleLock from '@/themes/fuwari/components/ArticleLock'

jest.mock('@/lib/global', () => ({
  useGlobal: () => ({
    locale: {
      COMMON: {
        ARTICLE_LOCK_TIPS: 'Please Enter the password:',
        PASSWORD_ERROR: 'Password Error!',
        SUBMIT: 'Submit'
      }
    }
  })
}))

describe('Fuwari ArticleLock', () => {
  it('awaits async validation before showing an error and can retry from Enter', async () => {
    const validPassword = jest.fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true)
    render(<ArticleLock validPassword={validPassword} />)
    const input = screen.getByPlaceholderText('Please Enter the password:')

    fireEvent.change(input, { target: { value: 'wrong' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() => expect(screen.getByText('Password Error!')).toBeInTheDocument())
    expect(validPassword).toHaveBeenNthCalledWith(1, 'wrong')

    fireEvent.change(input, { target: { value: 'correct' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() => expect(validPassword).toHaveBeenCalledTimes(2))
    expect(screen.getByText('Password Error!')).toBeInTheDocument()
  })

  it('the submit button supports an asynchronous retry', async () => {
    const validPassword = jest.fn().mockResolvedValue(false)
    render(<ArticleLock validPassword={validPassword} />)
    fireEvent.change(screen.getByPlaceholderText('Please Enter the password:'), {
      target: { value: 'wrong' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() => expect(screen.getByText('Password Error!')).toBeInTheDocument())
    expect(validPassword).toHaveBeenCalledWith('wrong')
  })
})
