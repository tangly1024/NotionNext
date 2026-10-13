import axios from 'axios'
import { randomBytes, timingSafeEqual } from 'crypto'

const COOKIE = 'notion_oauth_state'

function configuration() {
  const clientId = process.env.OAUTH_CLIENT_ID
  const clientSecret = process.env.OAUTH_CLIENT_SECRET
  const redirectUri = process.env.OAUTH_REDIRECT_URI
  if (!clientId || !clientSecret || !redirectUri) return null
  try {
    const url = new URL(redirectUri)
    if (
      url.protocol !== 'https:' &&
      !(
        url.protocol === 'http:' &&
        ['localhost', '127.0.0.1'].includes(url.hostname)
      )
    )
      return null
    return {
      clientId,
      clientSecret,
      redirectUri,
      secure: url.protocol === 'https:'
    }
  } catch {
    return null
  }
}

const cookie = (value, maxAge, secure) =>
  `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? '; Secure' : ''}`

export function startNotionOAuth(res) {
  const config = configuration()
  if (!config) return { status: 503, error: 'Notion OAuth is not configured' }
  const state = randomBytes(32).toString('base64url')
  res.setHeader('Set-Cookie', cookie(state, 600, config.secure))
  const url = new URL('https://api.notion.com/v1/oauth/authorize')
  url.search = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    owner: 'user',
    state
  }).toString()
  return { redirect: url.toString() }
}

export async function completeNotionOAuth(req, res) {
  const config = configuration()
  if (!config) return { status: 503, error: 'Notion OAuth is not configured' }
  const { code, state } = req.query || {}
  const expected = req.cookies?.[COOKIE]
  res.setHeader('Set-Cookie', cookie('', 0, config.secure))
  if (
    typeof code !== 'string' ||
    !code ||
    code.length > 2048 ||
    typeof state !== 'string' ||
    typeof expected !== 'string' ||
    state.length !== 43 ||
    expected.length !== 43 ||
    !/^[\w-]+$/.test(state) ||
    !/^[\w-]+$/.test(expected) ||
    !timingSafeEqual(Buffer.from(state), Buffer.from(expected))
  ) {
    return { status: 400, error: 'Invalid or expired OAuth state' }
  }
  try {
    const response = await axios.post(
      'https://api.notion.com/v1/oauth/token',
      {
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri
      },
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`
        }
      }
    )
    if (response.status !== 200 || !response.data?.access_token)
      throw new Error('Invalid token response')
    // This flow only confirms authorization. No feature currently needs token persistence.
    // Never serialize OAuth credentials into page props, redirects, cookies or logs.
    return { redirect: '/auth/result?status=success' }
  } catch {
    return { status: 502, error: 'Unable to complete Notion authorization' }
  }
}
