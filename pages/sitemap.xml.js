// pages/sitemap.xml.js
import { getServerSideSitemap } from 'next-sitemap'
import { getGlobalData } from '@/lib/notion/getNotionData'
import BLOG from '@/blog.config'

export const getServerSideProps = async (ctx) => {
  const { allPages } = await getGlobalData({ from: 'rss' })
  const defaultFields = [
    {
      loc: `${BLOG.LINK}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    }, {
      loc: `${BLOG.LINK}/archive`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    }, {
      loc: `${BLOG.LINK}/category`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    }, {
      loc: `${BLOG.LINK}/feed`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    }, {
      loc: `${BLOG.LINK}/search`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    }, {
      loc: `${BLOG.LINK}/tag`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    }
  ]
  const postFields = allPages?.filter(p => p.status === BLOG.NOTION_PROPERTY_NAME.status_publish)?.map(post => {
    const slugWithoutLeadingSlash = post?.slug.startsWith('/') ? post?.slug?.slice(1) : post.slug
    return {
      loc: `${BLOG.LINK}/${slugWithoutLeadingSlash}`,
      lastmod: new Date(post?.publishDay).toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    }
  })
  const fields = defaultFields.concat(postFields)

  // 缓存
  ctx.res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=59'
  )

  return getServerSideSitemap(ctx, fields)
}

export default () => { }
