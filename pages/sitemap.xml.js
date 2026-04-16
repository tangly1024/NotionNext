// pages/sitemap.xml.js
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { extractLangId, extractLangPrefix } from '@/lib/utils/pageId'
import { getServerSideSitemap } from 'next-sitemap'

export const getServerSideProps = async ctx => {
  let fields = []
  const siteIds = BLOG.NOTION_PAGE_ID.split(',')

  for (let index = 0; index < siteIds.length; index++) {
    const siteId = siteIds[index]
    const id = extractLangId(siteId)
    const locale = extractLangPrefix(siteId)
    // 第一个id站点默认语言
    const siteData = await getGlobalData({
      pageId: id,
      from: 'sitemap.xml'
    })
    const link = siteConfig(
      'LINK',
      siteData?.siteInfo?.link,
      siteData.NOTION_CONFIG
    )
    const isDefaultLocale = index === 0 || !locale || locale === BLOG.LANG
    const localeFields = generateLocalesSitemap(link, siteData.allPages, {
      includeRoot: isDefaultLocale,
      locale
    })
    fields = fields.concat(localeFields)
  }

  fields = getUniqueFields(fields)

  // 缓存
  ctx.res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=59'
  )
  return getServerSideSitemap(ctx, fields)
}

function normalizeSlug(slug) {
  if (typeof slug !== 'string') {
    return ''
  }

  return slug.trim().replace(/^\/+|\/+$/g, '')
}

const UUID_LIKE_SLUG =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const NOTION_ID_LIKE_SLUG = /^[0-9a-z]{32}$/i
const KNOWN_BROKEN_SLUGS = new Set([
  'article/mi-gpt',
  'article/pygwalker',
  'article/13e00092-b977-81eb-9616-c42fa3a1e1e6',
  'article/13e00092-b977-81ac-9c52-d00e97827bcf',
  'article/13e00092-b977-81a2-bf09-cb426dd663dd',
  'article/13e00092-b977-818c-b794-d305dec02052',
  'article/13e00092-b977-8112-88c5-c73ee02e8b8d',
  'article/13e00092-b977-8173-bd68-e1a95782aa3e',
  'article/13e00092-b977-81a7-940a-f1e585ef07c9',
  'article/13e00092-b977-818c-a0ce-d789b5fe6c50',
  'article/13e00092-b977-819e-a17d-d616716336ff',
  'article/13e00092-b977-81c3-bf63-eddcfbb6f417',
  'article/13e00092-b977-816e-be5e-e6428817b6c1',
  'article/13e00092-b977-8123-9b4b-fb08fb810c20',
  'article/13e00092-b977-8155-a176-f2356fee047b',
  'article/13e00092-b977-81a2-af48-e03aa7482052',
  'article/13e00092-b977-81a3-97e9-dba59bd118de',
  'article/13e00092-b977-8131-bb3c-f8d784e077b1',
  'article/13e00092-b977-810d-b620-fc981f318fa4',
  'article/13e00092-b977-81ba-b052-fcac2474d15f',
  'article/13e00092-b977-81da-b5d1-fc1ddaa74fe4',
  'article/13e00092-b977-81fe-bdd3-e1b7bcccb1ce',
  'article/13e00092-b977-812c-9928-f058d852d697'
])

function shouldIncludeSlug(rawSlug) {
  const normalizedSlug = normalizeSlug(rawSlug).toLowerCase()

  if (!normalizedSlug) {
    return false
  }

  if (/^https?:\/\//i.test(normalizedSlug)) return false
  if (normalizedSlug === '#' || normalizedSlug === '/#') return false
  if (normalizedSlug === 'article') return false
  if (normalizedSlug.includes(' ')) return false
  if (normalizedSlug.includes('/http:') || normalizedSlug.includes('/https:')) {
    return false
  }
  if (KNOWN_BROKEN_SLUGS.has(normalizedSlug)) return false

  const tail = normalizedSlug.split('/').pop()
  if (!tail) {
    return false
  }

  if (NOTION_ID_LIKE_SLUG.test(tail)) {
    return false
  }

  if (UUID_LIKE_SLUG.test(tail)) {
    return false
  }

  return true
}

function generateLocalesSitemap(link, allPages, options = {}) {
  const { includeRoot = true } = options
  const normalizedLink = link?.endsWith('/') ? link.slice(0, -1) : link
  const dateNow = new Date().toISOString().split('T')[0]
  const defaultFields = includeRoot
    ? [
        {
          loc: `${normalizedLink}/`,
          lastmod: dateNow,
          changefreq: 'daily',
          priority: '0.9'
        },
        {
          loc: `${normalizedLink}/archive`,
          lastmod: dateNow,
          changefreq: 'weekly',
          priority: '0.5'
        }
      ]
    : []
  const postFields =
    allPages
      ?.filter(p => {
        if (p.status !== BLOG.NOTION_PROPERTY_NAME.status_publish) return false

        const postType = String(p?.type || '')
        if (!['Post', 'Page'].includes(postType)) return false

        return shouldIncludeSlug(p?.slug)
      })
      ?.map(page => {
        const canonicalSlug = normalizeSlug(page?.slug)
        return {
          loc: `${normalizedLink}/${canonicalSlug}`,
          lastmod: new Date(
            page?.lastEditedDay || page?.publishDay || dateNow
          ).toISOString().split('T')[0],
          changefreq: page?.type === 'Page' ? 'weekly' : 'daily',
          priority: page?.type === 'Page' ? '0.6' : '0.8'
        }
      }) ?? []

  return defaultFields.concat(postFields)
}

function getUniqueFields(fields) {
  const uniqueFieldsMap = new Map()

  fields.forEach(field => {
    const existingField = uniqueFieldsMap.get(field.loc)

    if (!existingField || new Date(field.lastmod) > new Date(existingField.lastmod)) {
      uniqueFieldsMap.set(field.loc, field)
    }
  })

  return Array.from(uniqueFieldsMap.values())
}

const Sitemap = () => {}

export default Sitemap
