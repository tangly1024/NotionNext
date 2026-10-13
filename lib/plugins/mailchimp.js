import BLOG from '@/blog.config'

/**
 * 订阅邮件-服务端接口
 * @param {*} email
 * @returns
 */
export default function subscribeToMailchimpApi({
  email,
  first_name = '',
  last_name = ''
}) {
  const listId = BLOG.MAILCHIMP_LIST_ID // 替换为你的邮件列表 ID
  const apiKey = BLOG.MAILCHIMP_API_KEY // 替换为你的 API KEY
  if (!email || !listId || !apiKey) {
    throw new Error('Newsletter is not configured')
  }
  const data = {
    email_address: email,
    // Require mailbox confirmation before subscribing a new or archived contact.
    status: 'pending',
    merge_fields: {
      FNAME: first_name,
      LNAME: last_name
    }
  }
  const dataCenter = apiKey.split('-').pop()
  if (!/^us\d+$/.test(dataCenter)) throw new Error('Invalid newsletter configuration')
  return fetch(`https://${dataCenter}.api.mailchimp.com/3.0/lists/${encodeURIComponent(listId)}/members`, {
    method: 'POST',
    headers: {
      Authorization: `apikey ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(15000)
  })
}

/**
 * 客户端接口
 * @param {*} email
 * @param {*} firstName
 * @param {*} lastName
 * @returns
 */
export async function subscribeToNewsletter(email, firstName, lastName) {
  const unavailableMessage = 'Subscription is temporarily unavailable'
  const response = await fetch('/api/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, firstName, lastName })
  }).catch(() => {
    throw new Error(unavailableMessage)
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || data?.status !== 'success') {
    throw new Error(data?.message || unavailableMessage)
  }
  return data
}
