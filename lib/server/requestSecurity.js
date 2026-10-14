import { createHash } from 'node:crypto'

const attempts = new Map()
const trustsProxy = () =>
  process.env.VERCEL === '1' ||
  process.env.VERCEL === 'true' ||
  process.env.TRUST_PROXY === 'true'

/** Local fallback; a trusted reverse proxy must overwrite forwarded IP headers. */
export function allowPasswordAttempt(req, now = Date.now()) {
  const forwarded = req.headers?.['x-forwarded-for']
  const trustProxy = trustsProxy()
  const ip =
    trustProxy && forwarded
      ? String(Array.isArray(forwarded) ? forwarded[0] : forwarded)
          .split(',')[0]
          .trim()
      : req.socket?.remoteAddress || 'unknown'
  const key = createHash('sha256').update(ip).digest('hex')
  for (const [id, value] of attempts) {
    // Fixed windows retain insertion order, so unexpired entries end the scan.
    if (value.expires > now) break
    attempts.delete(id)
  }
  const record = attempts.get(key) || { count: 0, expires: now + 60000 }
  if (record.count >= 20) return false
  // Keep memory bounded without allowing a burst of new addresses to lock out
  // every visitor. Map insertion order tracks the oldest active window.
  if (!attempts.has(key) && attempts.size >= 10000) {
    attempts.delete(attempts.keys().next().value)
  }
  record.count++
  attempts.set(key, record)
  return true
}

export function isSameOriginRequest(req) {
  const origin = req.headers?.origin
  if (!origin) return true // Non-browser clients still need the password/token.
  try {
    const trusted = trustsProxy()
    // Only a configured trusted proxy may supply the external host/protocol.
    // It must overwrite (not append to) headers received from the client.
    const host =
      (trusted && req.headers['x-forwarded-host']) || req.headers.host
    const protocol =
      (trusted && req.headers['x-forwarded-proto']) ||
      (req.socket?.encrypted ? 'https' : 'http')
    if (
      typeof origin !== 'string' ||
      typeof host !== 'string' ||
      !['http', 'https'].includes(protocol)
    )
      return false
    if (!host || /[\s,/@\\?#]/.test(host)) return false
    const parsed = new URL(origin)
    return (
      ['http:', 'https:'].includes(parsed.protocol) &&
      parsed.origin === origin &&
      parsed.origin === new URL(`${protocol}://${host}`).origin
    )
  } catch {
    return false
  }
}
