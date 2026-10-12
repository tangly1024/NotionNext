import { startNotionOAuth } from '@/lib/server/notionOAuth'

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store')
  res.setHeader('Referrer-Policy', 'no-referrer')
  if (req.method !== 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  const result = startNotionOAuth(res)
  if (result.redirect) return res.redirect(302, result.redirect)
  return res.status(result.status).json({ error: result.error })
}
