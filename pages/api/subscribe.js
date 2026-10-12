import subscribeToMailchimpApi from '@/lib/plugins/mailchimp'

/**
 * 接受邮件订阅
 * @param {*} req
 * @param {*} res
 */
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method === 'POST') {
    const { email, firstName, lastName } = req.body || {}
    if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        [firstName, lastName].some(name => name !== undefined && (typeof name !== 'string' || name.length > 100))) {
      return res.status(400).json({ status: 'error', message: 'Please enter valid subscription details' })
    }
    try {
      const response = await subscribeToMailchimpApi({ email, first_name: firstName, last_name: lastName })
      const data = await response.json()
      if (!response.ok) {
        if (data.title === 'Member Exists') return res.status(409).json({ status: 'error', message: 'This address is already registered. Please check its subscription status.' })
        return res.status(response.status === 400 ? 400 : 502).json({ status: 'error', message: 'Subscription failed. Please check your details or try again later.' })
      }
      return res.status(200).json({ status: 'success', message: 'Subscription successful!' })
    } catch (error) {
      return res.status(503).json({ status: 'error', message: 'Subscription is temporarily unavailable' })
    }
  } else {
    res.status(405).json({ status: 'error', message: 'Method not allowed' })
  }
}
