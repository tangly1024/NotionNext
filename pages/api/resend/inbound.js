import { Resend } from 'resend'

export const config = {
  api: {
    bodyParser: false
  }
}

const readRawBody = req =>
  new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', chunk => chunks.push(Buffer.from(chunk)))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })

const getHeaderValue = (headersObject, key) => {
  const value = headersObject?.[key]
  if (Array.isArray(value)) {
    return value[0]
  }
  return value
}

const getSvixHeaders = headersObject => {
  const id = getHeaderValue(headersObject, 'svix-id')
  const timestamp = getHeaderValue(headersObject, 'svix-timestamp')
  const signature = getHeaderValue(headersObject, 'svix-signature')

  return { id, timestamp, signature }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET
  const inboundAddress = (process.env.RESEND_INBOUND_ADDRESS || 'hello@charliiai.com').toLowerCase()
  const forwardTo = process.env.RESEND_FORWARD_TO || 'kenchikuliu@outlook.com'

  if (!apiKey || !webhookSecret) {
    return res.status(500).json({ message: 'Missing Resend configuration' })
  }

  try {
    const rawBody = await readRawBody(req)
    const resend = new Resend(apiKey)
    const svixHeaders = getSvixHeaders(req.headers)

    console.log('resend inbound webhook received', {
      hasSvixId: Boolean(svixHeaders.id),
      hasSvixTimestamp: Boolean(svixHeaders.timestamp),
      hasSvixSignature: Boolean(svixHeaders.signature)
    })

    const event = resend.webhooks.verify({
      payload: rawBody,
      headers: svixHeaders,
      webhookSecret
    })

    if (event.type !== 'email.received') {
      return res.status(200).json({ ok: true, ignored: true })
    }

    const recipients = (event.data?.to || []).map(address => address.toLowerCase())
    if (!recipients.includes(inboundAddress)) {
      return res.status(200).json({ ok: true, ignored: true })
    }

    const forwardResult = await resend.emails.receiving.forward({
      emailId: event.data.email_id,
      from: inboundAddress,
      to: forwardTo,
      passthrough: true
    })

    if (forwardResult.error) {
      console.error('resend forward failed', forwardResult.error)
      return res.status(500).json({ message: forwardResult.error.message })
    }

    return res.status(200).json({ ok: true, id: forwardResult.data?.id || null })
  } catch (error) {
    console.error('resend inbound handler failed', error)
    return res.status(400).json({ message: error.message || 'Invalid webhook payload' })
  }
}
