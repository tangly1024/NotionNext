import fs from 'fs'
import { generateEnhancedRobotsTxt } from './seo/robotsEnhanced'

export function generateRobotsTxt(props) {
  // 使用增强版robots.txt生成器
  try {
    generateEnhancedRobotsTxt(props)
  } catch (error) {
    // 如果增强版失败，回退到简单版本
    console.warn('Enhanced robots.txt generation failed, using fallback:', error.message)
    generateFallbackRobotsTxt(props)
  }
}

// 保留原有的简单版本作为回退
function generateFallbackRobotsTxt(props) {
  const { siteInfo } = props
  const LINK = siteInfo?.link
  const content = `
    # *
    User-agent: *
    Allow: /
  
    # Host
    Host: ${LINK}
  
    # Sitemaps
    Sitemap: ${LINK}/sitemap.xml
  
    `
  try {
    fs.mkdirSync('./public', { recursive: true })
    fs.writeFileSync('./public/robots.txt', content)
  } catch (error) {
    // 在vercel运行环境是只读的，这里会报错；
    // 但在vercel编译阶段、或VPS等其他平台这行代码会成功执行
  }
}
