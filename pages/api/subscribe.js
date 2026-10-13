import subscribeToMailchimpApi from '@/lib/plugins/mailchimp'
import BLOG from '@/blog.config'

const acceptedResponse = {
  status: 'success',
  message: 'Subscription request received. Please check your inbox or contact the site owner if you need help.'
}

// Log diagnostics only, never request headers, credentials or subscriber data.
function safeDiagnostic(value, email) {
  if (typeof value !== 'string') return undefined
  let message = value
  for (const secret of [BLOG.MAILCHIMP_API_KEY, email]) {
    if (secret) message = message.split(secret).join('[redacted]')
  }
  return message
    .replace(/authorization\s*[:=][^\r\n]*/gi, 'Authorization: [redacted]')
    .replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, '[redacted email]')
    .replace(/[\r\n\t]/g, ' ')
    .slice(0, 200)
}

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
      const data = await response.json().catch(() => null)
      if (!response.ok) {
        // An existing member may be unsubscribed: do not upsert or change consent.
        // Use the same public result as a new request to avoid exposing membership.
        if (response.status === 400 && data?.title === 'Member Exists') {
          return res.status(200).json(acceptedResponse)
        }
        console.error('[Newsletter] Mailchimp request failed', {
          status: response.status,
          title: safeDiagnostic(data?.title, email)
        })
        return res.status(response.status === 400 ? 400 : 502).json({ status: 'error', message: 'Subscription failed. Please check your details or try again later.' })
      }
      return res.status(200).json(acceptedResponse)
    } catch (error) {
      console.error('[Newsletter] Subscription unavailable', {
        message: safeDiagnostic(error?.message, email)
      })
      return res.status(503).json({ status: 'error', message: 'Subscription is temporarily unavailable' })
    }
  } else {
    res.status(405).json({ status: 'error', message: 'Method not allowed' })
  }
}
