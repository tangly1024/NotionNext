import { timingSafeEqual } from 'node:crypto'

export const MAX_REVALIDATION_PATHS = 50

// Public index routes whose data changes when Notion content or site settings change.
export const DEFAULT_REVALIDATION_PATHS = [
  '/',
  '/archive',
  '/category',
  '/tag',
  '/search'
]

export function extractBearerToken(authorization) {
  const header = typeof authorization === 'string' ? authorization : ''
  if (!header.startsWith('Bearer ')) return ''
  return header.slice(7).trim()
}

export function tokensMatch(receivedToken, expectedToken) {
  if (!receivedToken || !expectedToken) return false

  const received = Buffer.from(receivedToken)
  const expected = Buffer.from(expectedToken)

  if (received.length !== expected.length) return false
  return timingSafeEqual(received, expected)
}

export function isValidRevalidationPath(pathname) {
  return (
    typeof pathname === 'string' &&
    pathname.startsWith('/') &&
    !pathname.startsWith('//') &&
    !/[\r\n]/.test(pathname)
  )
}

export function normalizeRevalidationPath(pathname) {
  if (!pathname || typeof pathname !== 'string') return '/'

  let normalized = pathname.trim()
  if (!normalized.startsWith('/')) normalized = '/' + normalized
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
  }
  return normalized
}
