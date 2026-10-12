import BLOG from '@/blog.config'
import { resolvePostProps } from '@/lib/db/SiteDataApi'
import { normalizePostId } from '@/lib/server/postAccess'
import {
  allowPasswordAttempt,
  isSameOriginRequest
} from '@/lib/server/requestSecurity'
import { extractLangPrefix } from '@/lib/utils/pageId'

export const config = { api: { bodyParser: { sizeLimit: '4kb' } } }

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0')
  res.setHeader('CDN-Cache-Control', 'no-store')
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!isSameOriginRequest(req))
    return res.status(403).json({ error: 'Forbidden' })
  const { postId, password, locale = BLOG.LANG } = req.body || {}
  const locales = new Set(
    [
      BLOG.LANG,
      ...String(BLOG.NOTION_PAGE_ID || '')
        .split(',')
        .map(extractLangPrefix)
    ].filter(Boolean)
  )
  if (
    typeof postId !== 'string' ||
    !/^[a-f0-9]{32}$/.test(normalizePostId(postId)) ||
    typeof password !== 'string' ||
    !password ||
    password.length > 1024 ||
    !locales.has(locale)
  ) {
    return res.status(400).json({ error: 'Invalid request' })
  }
  if (!allowPasswordAttempt(req)) {
    res.setHeader('Retry-After', '60')
    return res.status(429).json({ error: 'Too many attempts' })
  }
  try {
    const props = await resolvePostProps({
      prefix: postId,
      locale,
      password,
      from: 'authenticated-article'
    })
    if (!props.post) return res.status(404).json({ error: 'Article not found' })
    if (!props.post.blockMap)
      return res.status(401).json({ error: 'Invalid password' })
    return res.status(200).json({
      post: props.post,
      prev: props.prev ?? null,
      next: props.next ?? null,
      recommendPosts: props.recommendPosts ?? []
    })
  } catch {
    // Never log the request body, credentials or upstream response payload.
    return res.status(503).json({ error: 'Article temporarily unavailable' })
  }
}
