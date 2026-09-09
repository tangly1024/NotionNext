import BLOG from '@/blog.config'

/**
 * Lightweight service health endpoint.
 * It intentionally returns configuration status only, never credentials or IDs.
 */
export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' })
  }

  res.setHeader('Cache-Control', 'no-store, max-age=0')

  return res.status(200).json({
    ok: true,
    service: 'kuoyio-blog',
    notionConfigured: Boolean(BLOG.NOTION_PAGE_ID),
    revalidationConfigured: Boolean(
      process.env.REVALIDATION_TOKEN || BLOG.REVALIDATION_TOKEN
    ),
    cronConfigured: Boolean(process.env.CRON_SECRET),
    theme: BLOG.THEME,
    timestamp: new Date().toISOString()
  })
}
