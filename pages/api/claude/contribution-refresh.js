import { markContributionCacheDirty } from '@/lib/server/claude/contributionStore'

const getTokenFromRequest = req => {
  const queryToken = Array.isArray(req.query?.token)
    ? req.query.token[0]
    : req.query?.token
  const headerToken =
    req.headers['x-contribution-trigger-token'] ||
    req.headers['x-contrib-trigger-token'] ||
    ''
  return String(queryToken || headerToken || '')
}

const ALLOWED_REVALIDATE_PATHS = ['/', '/archive', '/category', '/tag']

const normalizeRevalidatePath = rawPath => {
  const path = String(rawPath || '/').trim() || '/'
  if (ALLOWED_REVALIDATE_PATHS.includes(path)) return path
  return null
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method || '')) {
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' })
  }

  const expectedToken = process.env.CLAUDE_CONTRIBUTION_TRIGGER_TOKEN || ''
  if (!expectedToken) {
    return res.status(503).json({
      ok: false,
      message: 'Contribution refresh is disabled: missing CLAUDE_CONTRIBUTION_TRIGGER_TOKEN'
    })
  }

  const receivedToken = getTokenFromRequest(req)
  if (!receivedToken || receivedToken !== expectedToken) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' })
  }

  const shouldRevalidate = String(req.query?.revalidate || '1') !== '0'
  const requestedPath = (Array.isArray(req.query?.path) ? req.query.path[0] : req.query?.path) || '/'
  const path = normalizeRevalidatePath(requestedPath)
  if (!path) {
    return res.status(400).json({
      ok: false,
      message: `Invalid path. Allowed values: ${ALLOWED_REVALIDATE_PATHS.join(', ')}`
    })
  }

  markContributionCacheDirty()

  let revalidated = false
  let revalidateError = ''
  if (shouldRevalidate && typeof res.revalidate === 'function') {
    try {
      await res.revalidate(path)
      revalidated = true
    } catch (error) {
      revalidateError = String(error?.message || error)
    }
  }

  return res.status(200).json({
    ok: true,
    revalidated,
    path,
    revalidateError,
    message:
      'Contribution local cache marked dirty. Next index regeneration will refresh from database.'
  })
}
