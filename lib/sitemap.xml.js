import BLOG from '@/blog.config'
import fs from 'fs'
import { siteConfig } from './config'

const UUID_LIKE_SLUG =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const NOTION_ID_LIKE_SLUG = /^[0-9a-z]{32}$/i
const KNOWN_BROKEN_SLUGS = new Set([
  'aboutme',
  'basicai',
  '干货分享/zotero-arxiv-daily',
  'article/ai-agent-programming-2026',
  'article/deepseekai',
  'article/googlevids',
  'article/3dgs',
  'article/effortless',
  'article/napkinai',
  'article/mi-gpt',
  'article/pygwalker',
  'article/openai-sora-shutdown-10yi-lesson',
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

function normalizeSlug(slug) {
  if (typeof slug !== 'string') {
    return ''
  }
  return slug.trim().replace(/^\/+|\/+$/g, '')
}

function shouldIncludeSlug(rawSlug) {
  const normalizedSlug = normalizeSlug(rawSlug).toLowerCase()

  if (!normalizedSlug) return false
  if (/^https?:\/\//i.test(normalizedSlug)) return false
  if (normalizedSlug === '#' || normalizedSlug === '/#') return false
  if (normalizedSlug === 'article') return false
  if (normalizedSlug.includes(' ')) return false
  if (normalizedSlug.includes('/http:') || normalizedSlug.includes('/https:')) {
    return false
  }
  if (KNOWN_BROKEN_SLUGS.has(normalizedSlug)) return false

  const tail = normalizedSlug.split('/').pop()
  if (!tail) return false
  if (NOTION_ID_LIKE_SLUG.test(tail)) return false
  if (UUID_LIKE_SLUG.test(tail)) return false

  return true
}

function dedupeUrls(urls) {
  const map = new Map()
  for (const url of urls) {
    const existing = map.get(url.loc)
    if (!existing || new Date(url.lastmod) > new Date(existing.lastmod)) {
      map.set(url.loc, url)
    }
  }
  return Array.from(map.values())
}
/**
 * 生成站点地图
 * @param {*} param0
 */
export function generateSitemapXml({ allPages, NOTION_CONFIG }) {
  let link = siteConfig('LINK', BLOG.LINK, NOTION_CONFIG)
  // 确保链接不以斜杠结尾
  if (link && link.endsWith('/')) {
    link = link.slice(0, -1)
  }
  const urls = [
    {
      loc: `${link}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${link}/archive`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.5
    },
    {
      loc: `${link}/about`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.4
    },
    {
      loc: `${link}/contact`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.4
    },
    {
      loc: `${link}/privacy-policy`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.3
    },
    {
      loc: `${link}/terms-of-service`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.3
    },
    {
      loc: `${link}/category`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily'
    },
    {
      loc: `${link}/tag`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily'
    }
  ]
  // 循环页面生成
  allPages?.forEach(post => {
    if (post?.status !== BLOG.NOTION_PROPERTY_NAME.status_publish) return

    const postType = String(post?.type || '')
    if (!['Post', 'Page'].includes(postType)) return

    if (!shouldIncludeSlug(post?.slug)) return

    const slugWithoutLeadingSlash = normalizeSlug(post?.slug)
    urls.push({
      loc: `${link}/${slugWithoutLeadingSlash}`,
      lastmod: new Date(
        post?.lastEditedDay || post?.publishDay || new Date().toISOString()
      )
        .toISOString()
        .split('T')[0],
      changefreq: postType === 'Page' ? 'weekly' : 'daily',
      priority: postType === 'Page' ? 0.6 : 0.8
    })
  })
  const xml = createSitemapXml(dedupeUrls(urls))
  try {
    fs.writeFileSync('sitemap.xml', xml)
    fs.writeFileSync('./public/sitemap.xml', xml)
  } catch (error) {
    console.warn('无法写入文件', error)
  }
}

/**
 * 生成站点地图
 * @param {*} urls
 * @returns
 */
function createSitemapXml(urls) {
  let urlsXml = ''
  urls.forEach(u => {
    urlsXml += `<url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority ?? 0.7}</priority>
    </url>
    `
  })

  return `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    ${urlsXml}
    </urlset>
    `
}
