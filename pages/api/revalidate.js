import BLOG from '@/blog.config'
import { chineseToEnglishCategory } from '@/lib/utils/categoryMapper'

const DEFAULT_REVALIDATE_GROUPS = []
const MAX_REVALIDATE_PATHS = 8

function getLocales() {
  const locales = [BLOG.LANG]
  const siteIds = String(BLOG.NOTION_PAGE_ID || '').split(',')

  for (const siteId of siteIds) {
    const prefix = siteId.includes(':') ? siteId.split(':')[0] : ''
    if (prefix && !locales.includes(prefix)) {
      locales.push(prefix)
    }
  }

  return locales.filter(Boolean)
}

function normalizePath(path) {
  if (!path || path === '/') {
    return '/'
  }

  return `/${String(path).trim().replace(/^\/+|\/+$/g, '')}`
}

function addLocalizedVariants(set, rawPath, locales) {
  const path = normalizePath(rawPath)
  if (!path) {
    return
  }

  set.add(path)

  if (path === '/') {
    for (const locale of locales) {
      if (locale !== BLOG.LANG) {
        set.add(`/${locale}`)
      }
    }
    return
  }

  for (const locale of locales) {
    set.add(`/${locale}${path}`)
  }
}

function buildAffectedPaths(payload) {
  const {
    path,
    paths = [],
    slug,
    slugs = [],
    category,
    categories = [],
    tag,
    tags = [],
    include = DEFAULT_REVALIDATE_GROUPS
  } = payload || {}

  const locales = getLocales()
  const affected = new Set()

  const allPaths = [path, ...paths].filter(Boolean)
  const allSlugs = [slug, ...slugs].filter(Boolean)
  const allCategories = [category, ...categories].filter(Boolean)
  const allTags = [tag, ...tags].filter(Boolean)

  for (const item of allPaths) {
    addLocalizedVariants(affected, item, locales)
  }

  for (const item of allSlugs) {
    addLocalizedVariants(affected, item, locales)
  }

  if (include.includes('home')) {
    addLocalizedVariants(affected, '/', locales)
    addLocalizedVariants(affected, '/page/2', locales)
  }

  if (include.includes('archive')) {
    addLocalizedVariants(affected, '/archive', locales)
  }

  if (include.includes('categoryIndex')) {
    addLocalizedVariants(affected, '/category', locales)
  }

  if (include.includes('tagIndex')) {
    addLocalizedVariants(affected, '/tag', locales)
  }

  for (const rawCategory of allCategories) {
    const categoryPath = `/category/${chineseToEnglishCategory(rawCategory)}`
    addLocalizedVariants(affected, categoryPath, locales)
  }

  for (const rawTag of allTags) {
    const tagPath = `/tag/${encodeURIComponent(rawTag)}`
    addLocalizedVariants(affected, tagPath, locales)
  }

  return Array.from(affected)
}

function normalizeInclude(include) {
  if (!include) {
    return DEFAULT_REVALIDATE_GROUPS
  }

  if (Array.isArray(include)) {
    return include.filter(Boolean)
  }

  if (typeof include === 'string') {
    return include
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
  }

  return DEFAULT_REVALIDATE_GROUPS
}

function getRequestMeta(req) {
  return {
    method: req.method,
    userAgent: req.headers['user-agent'] || '',
    forwardedFor: req.headers['x-forwarded-for'] || '',
    vercelId: req.headers['x-vercel-id'] || ''
  }
}

export default async function handler(req, res) {
  if (!['POST', 'GET'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ revalidated: false, message: 'Method not allowed' })
  }

  const secret =
    req.headers['x-revalidate-secret'] ||
    req.query.secret ||
    req.body?.secret

  if (!process.env.REVALIDATE_SECRET) {
    return res.status(500).json({
      revalidated: false,
      message: 'REVALIDATE_SECRET is not configured'
    })
  }

  if (secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ revalidated: false, message: 'Invalid secret' })
  }

  const payload = req.method === 'GET' ? req.query : req.body || {}
  const include = normalizeInclude(payload.include)
  const dryRun = ['1', 'true', 'yes'].includes(
    String(payload.dryRun || req.query?.dryRun || '').toLowerCase()
  )
  const paths = buildAffectedPaths({ ...payload, include })
  const requestMeta = getRequestMeta(req)

  if (paths.length === 0) {
    return res.status(400).json({
      revalidated: false,
      message: 'No paths resolved for revalidation',
      include,
      requestMeta
    })
  }

  if (paths.length > MAX_REVALIDATE_PATHS) {
    return res.status(400).json({
      revalidated: false,
      message: `Refusing to revalidate ${paths.length} paths in one request`,
      include,
      pathCount: paths.length,
      maxPaths: MAX_REVALIDATE_PATHS,
      paths,
      requestMeta
    })
  }

  const results = []

  console.info('[revalidate] request accepted', {
    include,
    dryRun,
    pathCount: paths.length,
    paths,
    requestMeta
  })

  if (dryRun) {
    return res.status(200).json({
      revalidated: false,
      dryRun: true,
      include,
      pathCount: paths.length,
      paths,
      requestMeta
    })
  }

  for (const path of paths) {
    try {
      await res.revalidate(path)
      results.push({ path, ok: true })
    } catch (error) {
      results.push({
        path,
        ok: false,
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }

  const successCount = results.filter(item => item.ok).length
  const failed = results.filter(item => !item.ok)

  return res.status(failed.length > 0 ? 207 : 200).json({
    revalidated: failed.length === 0,
    successCount,
    failureCount: failed.length,
    paths,
    results
  })
}
