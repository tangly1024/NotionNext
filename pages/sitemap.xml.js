// pages/sitemap.xml.js
import BLOG from '@/blog.config'
import { getNotionPageData } from '@/lib/db/getSiteData'
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
    const localeFields = generateLocalesSitemap(
      await getNotionPageData({
        pageId: id,
        from: 'sitemap.xml'
      }).allPages,
      locale
    )
    fields = fields.concat(localeFields)
  }

  // 缓存
  ctx.res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=59'
  )
  console.log('fff', fields)
  return getServerSideSitemap(ctx, fields)
}

function generateLocalesSitemap(allPages, locale) {
  if (locale && locale.length > 0 && locale.indexOf('/') !== 0) {
    locale = '/' + locale
  }
  const defaultFields = [
    {
      loc: `${BLOG.LINK}${locale}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    },
    {
      loc: `${BLOG.LINK}${locale}/archive`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    },
    {
      loc: `${BLOG.LINK}${locale}/category`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    },
    {
      loc: `${BLOG.LINK}${locale}/feed`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    },
    {
      loc: `${BLOG.LINK}${locale}/search`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    },
    {
      loc: `${BLOG.LINK}${locale}/tag`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    }
  ]
  const postFields =
    allPages
      ?.filter(p => p.status === BLOG.NOTION_PROPERTY_NAME.status_publish)
      ?.map(post => {
        const slugWithoutLeadingSlash = post?.slug.startsWith('/')
          ? post?.slug?.slice(1)
          : post.slug
        return {
          loc: `${BLOG.LINK}${locale}/${slugWithoutLeadingSlash}`,
          lastmod: new Date(post?.publishDay).toISOString().split('T')[0],
          changefreq: 'daily',
          priority: '0.7'
        }
      }) ?? []

  return defaultFields.concat(postFields)
}

export default () => {}
