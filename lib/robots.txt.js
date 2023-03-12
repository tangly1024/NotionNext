
import fs from 'fs'
import BLOG from '@/blog.config'

export async function generateRobotsTxt() {
  fs.mkdirSync('./public/rss', { recursive: true })
  fs.writeFileSync('./public/robots.txt', `
  # *
  User-agent: *
  Allow: /

  # Host
  Host: ${BLOG.LINK}

  # Sitemaps
  Sitemap: ${BLOG.LINK}/sitemap.xml

  `)
}
