// pages/sitemap.xml.js
import { getServerSideSitemap } from 'next-sitemap'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import BLOG from '@/blog.config'

export const getServerSideProps = async (ctx) => {
  const { allPages } = await getGlobalNotionData({ from: 'rss' })
  const defaultFields = [
    {
      loc: `${BLOG.LINK}`, // Absolute url
      lastmod: new Date(),
      changefreq: 'daily',
      priority: '0.7'
    }, {
      loc: `${BLOG.LINK}/archive`, // Absolute url
      lastmod: new Date(),
      changefreq: 'daily',
      priority: '0.7'
    }, {
      loc: `${BLOG.LINK}/category`, // Absolute url
      lastmod: new Date(),
      changefreq: 'daily',
      priority: '0.7'
    }, {
      loc: `${BLOG.LINK}/feed`, // Absolute url
      lastmod: new Date(),
      changefreq: 'daily',
      priority: '0.7'
    }, {
      loc: `${BLOG.LINK}/search`, // Absolute url
      lastmod: new Date(),
      changefreq: 'daily',
      priority: '0.7'
    }, {
      loc: `${BLOG.LINK}/tag`, // Absolute url
      lastmod: new Date(),
      changefreq: 'daily',
      priority: '0.7'
    }
  ]
  const postFields = allPages?.map(post => {
    console.log(post)
    return {
      loc: `${BLOG.LINK}/${post.slug}`, // Absolute url
      lastmod: new Date(post?.date?.start_date || post?.createdTime),
      changefreq: 'daily',
      priority: '0.7'
    }
  })
  const fields = defaultFields.concat(postFields)

  return getServerSideSitemap(ctx, fields)
}

export default () => { }
