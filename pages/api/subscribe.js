import {
  buildLeadOwnerEmail,
  buildLeadUserConfirmationEmail,
  hasCloudflareEmailConfig,
  sendCloudflareEmail
} from '@/lib/integrations/cloudflare-email'
import {
  hasLeadDatabaseConfig,
  storeLeadInNotion
} from '@/lib/integrations/notion-leads'

function normalizeLocale(locale) {
  if (!locale) {
    return 'zh-CN'
  }
  return String(locale)
}

function getIpAddress(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (Array.isArray(forwarded)) {
    return forwarded[0]
  }
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim()
  }
  return req.socket?.remoteAddress || ''
}

/**
 * 接受邮件订阅
 * @param {*} req
 * @param {*} res
 */
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      email,
      firstName,
      lastName,
      first_name,
      last_name,
      locale,
      source,
      pageUrl,
      referrer
    } = req.body || {}

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required'
      })
    }

    const lead = {
      email: String(email).trim().toLowerCase(),
      firstName: firstName || first_name || '',
      lastName: lastName || last_name || '',
      locale: normalizeLocale(locale),
      source: source || 'homepage_cta',
      pageUrl: pageUrl || process.env.NEXT_PUBLIC_LINK || 'https://www.charliiai.com',
      referrer: referrer || req.headers.referer || '',
      ip: getIpAddress(req),
      userAgent: req.headers['user-agent'] || '',
      submittedAt: new Date().toISOString()
    }

    try {
      const result = {
        stored_in_notion: false,
        owner_notified: false,
        user_notified: false,
        notion_page_id: null
      }

      if (hasLeadDatabaseConfig()) {
        const notionResult = await storeLeadInNotion(lead)
        result.stored_in_notion = true
        result.notion_page_id = notionResult.id
      }

      if (hasCloudflareEmailConfig()) {
        await sendCloudflareEmail(buildLeadOwnerEmail({ lead }))
        result.owner_notified = true

        await sendCloudflareEmail(buildLeadUserConfirmationEmail({ lead }))
        result.user_notified = true
      }

      if (
        !result.stored_in_notion &&
        !result.owner_notified &&
        !result.user_notified
      ) {
        return res.status(500).json({
          status: 'error',
          message:
            'Lead pipeline is not configured. Add Notion and Cloudflare Email environment variables.',
          ...result
        })
      }

      return res
        .status(200)
        .json({
          status: 'success',
          message: 'Lead captured successfully',
          ...result
        })
    } catch (error) {
      console.error('subscribe handler failed', error)
      return res.status(400).json({
        status: 'error',
        message: error?.message || 'Subscription failed!'
      })
    }
  } else {
    return res.status(405).json({
      status: 'error',
      message: 'Method not allowed'
    })
  }
}
