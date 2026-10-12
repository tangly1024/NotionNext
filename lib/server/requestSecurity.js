import { createHash } from 'node:crypto'

const attempts = new Map()

/** Local fallback; a trusted reverse proxy must overwrite forwarded IP headers. */
export function allowPasswordAttempt(req, now = Date.now()) {
  const forwarded = req.headers?.['x-forwarded-for']
  const trustProxy = process.env.VERCEL || process.env.TRUST_PROXY === 'true'
  const ip =
    trustProxy && forwarded
      ? String(Array.isArray(forwarded) ? forwarded[0] : forwarded)
          .split(',')[0]
          .trim()
      : req.socket?.remoteAddress || 'unknown'
  const key = createHash('sha256').update(ip).digest('hex')
  for (const [id, value] of attempts) {
    if (value.expires <= now) attempts.delete(id)
  }
  const record = attempts.get(key) || { count: 0, expires: now + 60000 }
  if (record.count >= 20 || (!attempts.has(key) && attempts.size >= 10000))
    return false
  record.count++
  attempts.set(key, record)
  return true
}

export function isSameOriginRequest(req) {
  const origin = req.headers?.origin
  if (!origin) return true // Non-browser clients still need the password/token.
  try {
    return new URL(origin).host === req.headers.host
  } catch {
    return false
  }
}
