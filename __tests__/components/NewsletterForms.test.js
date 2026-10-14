import {
  fireEvent,
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import MailChimpForm from '@/themes/fukasawa/components/MailChimpForm'
import Newsletter from '@/themes/landing/components/Newsletter'
import Footer from '@/themes/landing/components/Footer'

jest.mock('@/lib/config', () => ({ siteConfig: () => true }))
jest.mock('@/blog.config', () => ({ __esModule: true, default: {} }))
jest.mock('@/themes/landing/components/Logo', () => () => null)
jest.mock(
  '@/components/SmartLink',
  () =>
    function MockLink({ children, ...props }) {
      return <a {...props}>{children}</a>
    }
)
jest.mock('@/lib/global', () => ({
  useGlobal: () => ({
    locale: {
      MAILCHIMP: { SUBSCRIBE: 'Subscribe', MSG: 'Newsletter', EMAIL: 'Email' }
    }
  })
}))

const received = {
  status: 'success',
  message: 'Subscription request received. Please check your inbox.'
}

beforeEach(() => fetch.mockReset())

describe.each([
  ['Fukasawa', MailChimpForm],
  ['Landing newsletter', Newsletter],
  ['Landing footer', Footer]
])('%s form', (name, Form) => {
  test.each([400, 409, 502, 503])(
    'shows HTTP %s failures and allows retry',
    async status => {
      fetch
        .mockResolvedValueOnce({
          ok: false,
          status,
          json: () =>
            Promise.resolve({
              status: 'error',
              message: 'Please try again later'
            })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(received)
        })
      render(<Form />)
      const input = screen.getByRole('textbox')
      const submit = screen.getByRole('button', { name: 'Subscribe' })
      fireEvent.change(input, { target: { value: 'reader@example.com' } })
      fireEvent.submit(input.closest('form'))
      expect(submit).toBeDisabled()
      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Please try again later'
      )
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
      expect(input).toHaveValue('reader@example.com')
      expect(input).not.toBeDisabled()
      expect(submit).not.toBeDisabled()
      fireEvent.submit(input.closest('form'))
      expect(await screen.findByRole('status')).toHaveTextContent(
        received.message
      )
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(input).toBeDisabled()
      expect(fetch).toHaveBeenLastCalledWith(
        '/api/subscribe',
        expect.objectContaining({
          body: JSON.stringify({ email: 'reader@example.com' })
        })
      )
    }
  )
})

test('each landing form submits its own email when both are mounted', async () => {
  fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(received) })
  const { container } = render(
    <>
      <Newsletter />
      <Footer />
    </>
  )
  const newsletter = within(container.querySelector('section'))
  const footer = within(container.querySelector('footer'))
  const newsletterEmail = newsletter.getByRole('textbox')
  const footerEmail = footer.getByRole('textbox')
  fireEvent.change(newsletterEmail, {
    target: { value: 'newsletter@example.com' }
  })
  fireEvent.change(footerEmail, { target: { value: 'footer@example.com' } })
  fireEvent.submit(newsletterEmail.closest('form'))
  await waitFor(() =>
    expect(newsletter.getByRole('status')).toBeInTheDocument()
  )
  expect(footer.queryByRole('status')).not.toBeInTheDocument()
  expect(JSON.parse(fetch.mock.calls[0][1].body).email).toBe(
    'newsletter@example.com'
  )
  fireEvent.submit(footerEmail.closest('form'))
  await waitFor(() => expect(footer.getByRole('status')).toBeInTheDocument())
  expect(JSON.parse(fetch.mock.calls[1][1].body).email).toBe(
    'footer@example.com'
  )
})
