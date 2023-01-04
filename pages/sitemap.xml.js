// pages/sitemap.xml.js
import { getServerSideSitemap } from 'next-sitemap'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import BLOG from '@/blog.config'

export const getServerSideProps = async (ctx) => {
  const { allPages } = await getGlobalNotionData({ from: 'rss' })
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
  const postFields = allPages?.map(post => {
    return {
      loc: `${BLOG.LINK}/${post.slug}`,
      lastmod: new Date(post?.date?.start_date || post?.createdTime).toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    }
  })
  const fields = defaultFields.concat(postFields)

  // 缓存
  //   ctx.res.setHeader(
  //     'Cache-Control',
  //     'public, s-maxage=10, stale-while-revalidate=59'
  //   )

  return getServerSideSitemap(ctx, fields)
}

export default () => { }
