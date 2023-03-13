
import fs from 'fs'
import BLOG from '@/blog.config'

export async function generateRobotsTxt() {
  const content = `
    # *
    User-agent: *
    Allow: /
  
    # Host
    Host: ${BLOG.LINK}
  
    # Sitemaps
    Sitemap: ${BLOG.LINK}/sitemap.xml
  
    `
  try {
    fs.writeFileSync('robots.txt', content)
    fs.writeFileSync('./public/robots.txt', content)
  } catch (error) {
    console.warn('无法写入文件', error)
  }
}
