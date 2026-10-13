import type { NextApiRequest, NextApiResponse } from 'next'
import { completeNotionOAuth } from '@/lib/server/notionOAuth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Cache-Control', 'private, no-store')
  res.setHeader('Referrer-Policy', 'no-referrer')
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const result = await completeNotionOAuth(req, res)
  if (result.redirect) return res.redirect(303, result.redirect)
  return res.status(result.status || 502).json({ error: result.error })
}
