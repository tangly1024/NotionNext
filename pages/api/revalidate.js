import BLOG from '@/blog.config'
import { cleanCache } from '@/lib/cache/local_file_cache'
import {
  extractBearerToken,
  isValidRevalidationPath,
  MAX_REVALIDATION_PATHS,
  normalizeRevalidationPath,
  tokensMatch
} from '@/lib/revalidation'

/**
 * On-Demand Revalidation API
 *
 * 解决 Issue #1020：Notion 内容更新后前端不实时同步
 *
 * 使用方式：
 *   POST /api/revalidate
 *   Authorization: Bearer <REVALIDATION_TOKEN>
 *   Body: { "path": "/article/my-post" }        — 刷新单个页面
 *   Body: { "paths": ["/", "/article/post-1"] }  — 批量刷新
 *   Body: { "all": true }                        — 全站刷新
 *
 * 环境变量：
 *   REVALIDATION_TOKEN — API 鉴权 Token（必须设置）
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      message: 'Method Not Allowed. Use POST.'
    })
  }

  // Token 鉴权
  const token = process.env.REVALIDATION_TOKEN || BLOG.REVALIDATION_TOKEN
  if (!token) {
    return res.status(503).json({
      ok: false,
      message: 'Revalidation is disabled: REVALIDATION_TOKEN not set'
    })
  }

  const authHeader = req.headers.authorization || ''
  const receivedToken = extractBearerToken(authHeader)

  if (!tokensMatch(receivedToken, token)) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' })
  }

  const { path, paths, all } = req.body || {}

  try {
    // 全站刷新：清除本地缓存 + revalidate 首页
    if (all) {
      cleanCache()
      const results = []
      try {
        await res.revalidate('/')
        results.push({ path: '/', revalidated: true })
      } catch (e) {
        results.push({ path: '/', revalidated: false, error: e.message })
      }
      return res.status(200).json({
        ok: true,
        message: 'Full site cache cleared. Homepage revalidated. Other pages will refresh on next visit.',
        results
      })
    }

    // 批量刷新
    const targetPaths = Array.isArray(paths)
      ? paths
      : path
        ? [path]
        : ['/']

    if (
      targetPaths.length === 0 ||
      targetPaths.length > MAX_REVALIDATION_PATHS ||
      targetPaths.some(item => !isValidRevalidationPath(item))
    ) {
      return res.status(400).json({
        ok: false,
        message: `paths must contain 1-${MAX_REVALIDATION_PATHS} site paths`
      })
    }

    const results = []

    for (const p of targetPaths) {
      const normalizedPath = normalizeRevalidationPath(p)
      try {
        await res.revalidate(normalizedPath)
        results.push({ path: normalizedPath, revalidated: true })
      } catch (e) {
        results.push({ path: normalizedPath, revalidated: false, error: e.message })
      }
    }

    return res.status(200).json({
      ok: true,
      message: `Revalidated ${results.filter(r => r.revalidated).length}/${results.length} paths`,
      results
    })
  } catch (error) {
    console.error('[revalidate] Error:', error)
    return res.status(500).json({
      ok: false,
      message: 'Revalidation failed',
      error: error.message
    })
  }
}
