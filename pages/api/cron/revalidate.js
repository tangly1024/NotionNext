import { cleanCache } from '@/lib/cache/local_file_cache'
import {
  DEFAULT_REVALIDATION_PATHS,
  extractBearerToken,
  tokensMatch
} from '@/lib/revalidation'

/**
 * Vercel Cron entrypoint for automatic Notion content refresh.
 *
 * Vercel sends Authorization: Bearer <CRON_SECRET> for configured cron jobs.
 * This route intentionally accepts GET only because Vercel Cron invokes GET.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' })
  }

  const cronSecret = process.env.CRON_SECRET || ''
  const receivedToken = extractBearerToken(req.headers.authorization)

  if (!cronSecret || !tokensMatch(receivedToken, cronSecret)) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' })
  }

  res.setHeader('Cache-Control', 'no-store, max-age=0')

  try {
    cleanCache()

    const results = []
    for (const path of DEFAULT_REVALIDATION_PATHS) {
      try {
        await res.revalidate(path)
        results.push({ path, revalidated: true })
      } catch (error) {
        results.push({ path, revalidated: false, error: error.message })
      }
    }

    const failed = results.filter(result => !result.revalidated)
    return res.status(failed.length > 0 ? 500 : 200).json({
      ok: failed.length === 0,
      message: `Revalidated ${results.length - failed.length}/${results.length} index paths`,
      results
    })
  } catch (error) {
    console.error('[cron/revalidate] Error:', error)
    return res.status(500).json({
      ok: false,
      message: 'Automatic revalidation failed'
    })
  }
}
