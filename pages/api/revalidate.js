import BLOG from '@/blog.config'
import { clearDataCache } from '@/lib/cache/cache_manager'
import { collectRevalidationPaths, normalizeRevalidationPath, revalidatePaths } from '@/lib/server/revalidation'

export const config = { api: { bodyParser: { sizeLimit: '32kb' } }, maxDuration: 300 }

/** Authenticated maintenance; data invalidation always precedes page regeneration. */
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, message: 'Method Not Allowed. Use POST.' })
  }
  const token = process.env.REVALIDATION_TOKEN || BLOG.REVALIDATION_TOKEN
  if (!token) return res.status(503).json({ ok: false, message: 'Revalidation is disabled: REVALIDATION_TOKEN not set' })
  const authHeader = req.headers.authorization || ''
  const receivedToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : req.body?.token || ''
  if (receivedToken !== token) return res.status(401).json({ ok: false, message: 'Unauthorized' })

  const { path, paths, all } = req.body || {}
  if (all !== undefined && typeof all !== 'boolean') return res.status(400).json({ ok: false, message: 'all must be a boolean' })
  const requested = paths === undefined ? [path === undefined ? '/' : path] : paths
  if (!Array.isArray(requested) || !requested.length || requested.length > 500) {
    return res.status(400).json({ ok: false, message: 'Provide between 1 and 500 local paths' })
  }
  const normalized = requested.map(normalizeRevalidationPath)
  if (normalized.some(value => !value || value.startsWith('/api/'))) {
    return res.status(400).json({ ok: false, message: 'Invalid local page path' })
  }

  try {
    // Keep old slugs in the plan so removed pages are regenerated to a 404.
    const previousPaths = all ? await collectRevalidationPaths() : []
    const stores = await clearDataCache()
    const currentPaths = await collectRevalidationPaths()
    const relatedPaths = currentPaths.filter(value =>
      value === '/' || /^\/[^/]+$/.test(value) || /\/(?:archive|category|tag|search|page)(?:\/|$)/.test(value)
    )
    const targetPaths = [...new Set(all ? [...previousPaths, ...currentPaths] : [...normalized, ...relatedPaths])]
    const results = await revalidatePaths(res, targetPaths)
    const ok = results.every(result => result.revalidated)
    return res.status(ok ? 200 : 500).json({
      ok, stores,
      message: `Revalidated ${results.filter(result => result.revalidated).length}/${results.length} paths`,
      results
    })
  } catch {
    return res.status(503).json({ ok: false, message: 'Cache invalidation or page discovery failed; retry the request' })
  }
}
