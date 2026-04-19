import BLOG from '@/blog.config'
import { extractLangPrefix } from '@/lib/utils/pageId'

const normalizeSlugValue = value =>
  typeof value === 'string' ? value.replace(/^\/+|\/+$/g, '') : ''

const isHttpLink = value => /^https?:\/\//i.test(String(value || ''))

const hasSlashCount = (page, expected) => {
  const slug = normalizeSlugValue(page?.slug)
  if (!slug || isHttpLink(slug) || String(page?.type || '').includes('Menu')) {
    return false
  }

  return (slug.match(/\//g) || []).length === expected
}

const hasAtLeastSlashCount = (page, expected) => {
  const slug = normalizeSlugValue(page?.slug)
  if (!slug || isHttpLink(slug) || String(page?.type || '').includes('Menu')) {
    return false
  }

  return (slug.match(/\//g) || []).length >= expected
}

const isPublishedRoutablePage = page =>
  page?.status === 'Published' && typeof page?.slug === 'string' && page.slug.trim()

function buildStaticPathsByMatcher({
  allPages,
  locale,
  matcher,
  mapParams,
  allowList
}) {
  const seen = new Set()
  const normalizedAllowList = allowList
    ? new Set(Array.from(allowList).map(item => normalizeSlugValue(item).toLowerCase()))
    : null

  return (allPages || [])
    .filter(isPublishedRoutablePage)
    .filter(matcher)
    .map(page => normalizeSlugValue(page.slug))
    .filter(Boolean)
    .filter(slug =>
      normalizedAllowList ? normalizedAllowList.has(slug.toLowerCase()) : true
    )
    .filter(slug => {
      const key = `${locale}:${slug.toLowerCase()}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
    .map(slug => ({
      params: mapParams(slug),
      locale
    }))
}

export function getConfiguredLocales() {
  const locales = new Set([BLOG.LANG])
  const siteIds = String(BLOG.NOTION_PAGE_ID || '')
    .split(',')
    .map(siteId => siteId.trim())
    .filter(Boolean)

  for (const siteId of siteIds) {
    const prefix = extractLangPrefix(siteId)
    if (prefix) {
      locales.add(prefix)
    }
  }

  return Array.from(locales)
}

export function buildSingleSegmentStaticPaths({ allPages, locale, allowList }) {
  return buildStaticPathsByMatcher({
    allPages,
    locale,
    allowList,
    matcher: page => hasSlashCount(page, 0),
    mapParams: slug => ({ prefix: slug })
  })
}

export function buildTwoSegmentStaticPaths({ allPages, locale, allowList }) {
  return buildStaticPathsByMatcher({
    allPages,
    locale,
    allowList,
    matcher: page => hasSlashCount(page, 1),
    mapParams: slug => {
      const [prefix, segment] = slug.split('/')
      return { prefix, slug: segment }
    }
  })
}

export function buildMultiSegmentStaticPaths({ allPages, locale, allowList }) {
  return buildStaticPathsByMatcher({
    allPages,
    locale,
    allowList,
    matcher: page => hasAtLeastSlashCount(page, 2),
    mapParams: slug => {
      const [prefix, segment, ...suffix] = slug.split('/')
      return { prefix, slug: segment, suffix }
    }
  })
}
