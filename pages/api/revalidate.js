import BLOG from '@/blog.config'
import { clearDataCache } from '@/lib/cache/cache_manager'
import {
  collectRevalidationPaths,
  normalizeRevalidationPath,
  revalidatePaths
} from '@/lib/server/revalidation'

export const config = {
  api: { bodyParser: { sizeLimit: '32kb' } },
  // Keep compatible with Hobby projects using legacy compute (60s limit).
  maxDuration: 60
}

/** Explicit data invalidation precedes page regeneration when requested. */
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res
      .status(405)
      .json({ ok: false, message: 'Method Not Allowed. Use POST.' })
  }
  const token = process.env.REVALIDATION_TOKEN || BLOG.REVALIDATION_TOKEN
  if (!token)
    return res.status(503).json({
      ok: false,
      message: 'Revalidation is disabled: REVALIDATION_TOKEN not set'
    })
  const authHeader = req.headers.authorization || ''
  const receivedToken = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : req.body?.token || ''
  if (receivedToken !== token)
    return res.status(401).json({ ok: false, message: 'Unauthorized' })

  const { path, paths, all, invalidateData, batchSize = 25 } = req.body || {}
  if (all !== undefined && typeof all !== 'boolean')
    return res.status(400).json({ ok: false, message: 'all must be a boolean' })
  if (invalidateData !== undefined && typeof invalidateData !== 'boolean')
    return res
      .status(400)
      .json({ ok: false, message: 'invalidateData must be a boolean' })
  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 50)
    return res.status(400).json({
      ok: false,
      message: 'batchSize must be an integer between 1 and 50'
    })
  if (all && invalidateData === false)
    return res
      .status(400)
      .json({ ok: false, message: 'all requires data invalidation' })
  const requested =
    paths === undefined
      ? path === undefined
        ? all
          ? []
          : ['/']
        : [path]
      : paths
  if (
    !Array.isArray(requested) ||
    (!requested.length && !all) ||
    requested.length > 500
  ) {
    return res
      .status(400)
      .json({ ok: false, message: 'Provide between 1 and 500 local paths' })
  }
  const normalized = requested.map(normalizeRevalidationPath)
  if (normalized.some(value => !value || value.startsWith('/api/'))) {
    return res
      .status(400)
      .json({ ok: false, message: 'Invalid local page path' })
  }

  try {
    const deadline = Date.now() + 45000
    // Keep old slugs in the plan so removed pages are regenerated to a 404.
    const previousPaths = all ? await collectRevalidationPaths() : []
    const stores = all || invalidateData ? await clearDataCache() : []
    const currentPaths = all ? await collectRevalidationPaths() : []
    const targetPaths = [
      ...new Set(
        all ? [...previousPaths, ...currentPaths, ...normalized] : normalized
      )
    ]
    // A continuation sends remaining paths without all/invalidateData, so data
    // invalidation and discovery occur only once for a full-site refresh.
    const results = await revalidatePaths(
      res,
      targetPaths.slice(0, batchSize),
      3,
      deadline
    )
    const remainingPaths = targetPaths.slice(results.length)
    const complete = remainingPaths.length === 0
    const ok = results.every(result => result.revalidated)
    return res.status(ok ? (complete ? 200 : 202) : 500).json({
      ok,
      stores,
      message: `Revalidated ${results.filter(result => result.revalidated).length}/${results.length} paths`,
      complete,
      total: targetPaths.length,
      remainingPaths,
      results
    })
  } catch (error) {
    console.error(
      '[Revalidation] Cache invalidation or page discovery failed',
      error instanceof Error ? error.name : 'Error'
    )
    return res.status(503).json({
      ok: false,
      message: 'Cache invalidation or page discovery failed; retry the request'
    })
  }
}
