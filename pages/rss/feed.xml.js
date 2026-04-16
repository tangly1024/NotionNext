import BLOG from '@/blog.config'
import { chineseToEnglishCategory } from '@/lib/utils/categoryMapper'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { extractLangId, extractLangPrefix } from '@/lib/utils/pageId'

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function normalizeLink(link) {
  return link?.endsWith('/') ? link.slice(0, -1) : link
}

function buildFeedXml({ siteInfo, posts }) {
  const link = normalizeLink(siteInfo.link)
  const now = new Date().toUTCString()
  const items = posts
    .map(post => {
      const category = post?.category
        ? chineseToEnglishCategory(post.category)
        : ''

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}/${escapeXml(post.slug)}</link>
      <guid isPermaLink="true">${link}/${escapeXml(post.slug)}</guid>
      <pubDate>${new Date(post?.publishDay || Date.now()).toUTCString()}</pubDate>
      <description><![CDATA[${post.summary || ''}]]></description>
      <category><![CDATA[${category}]]></category>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteInfo.title)}</title>
    <link>${link}</link>
    <description>${escapeXml(siteInfo.description)}</description>
    <lastBuildDate>${now}</lastBuildDate>
    <language>${escapeXml(siteInfo.lang || BLOG.LANG)}</language>
${items}
  </channel>
</rss>`
}

async function loadDefaultSiteData() {
  const siteIds = BLOG.NOTION_PAGE_ID.split(',')
  const defaultSiteId = siteIds[0]
  const pageId = extractLangId(defaultSiteId)
  const locale = extractLangPrefix(defaultSiteId) || BLOG.LANG

  return getGlobalData({
    pageId,
    locale,
    from: 'rss-feed'
  })
}

export async function getServerSideProps({ res }) {
  const props = await loadDefaultSiteData()
  const siteInfo = {
    title: props?.siteInfo?.title || siteConfig('TITLE'),
    description: props?.siteInfo?.description || siteConfig('DESCRIPTION'),
    link: props?.siteInfo?.link || siteConfig('LINK'),
    lang: props?.NOTION_CONFIG?.LANG || BLOG.LANG
  }
  const posts =
    props?.allPages
      ?.filter(page => page.type === 'Post' && page.status === 'Published')
      ?.sort((a, b) => (b?.publishDate || 0) - (a?.publishDate || 0))
      ?.slice(0, 20) || []

  const xml = buildFeedXml({ siteInfo, posts })

  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=86400'
  )
  res.write(xml)
  res.end()

  return { props: {} }
}

export default function FeedXml() {
  return null
}
