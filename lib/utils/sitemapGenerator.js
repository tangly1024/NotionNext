/**
 * Sitemap生成工具
 * 支持自定义分类URL的sitemap生成
 */

import { generatePostUrl, generateCategoryUrl } from './urlGenerator'
import { getAllCustomCategoryPaths, getAllChineseCategories } from './categoryMapping'
import { siteConfig } from '@/lib/config'

/**
 * 生成文章的sitemap条目
 * @param {object} post - 文章对象
 * @returns {object} sitemap条目
 */
export function generatePostSitemapEntry(post) {
  if (!post) return null

  const url = generatePostUrl(post)
  const lastmod = post.lastEditedTime || post.publishTime || new Date().toISOString()
  
  return {
    url: url,
    lastmod: lastmod,
    changefreq: siteConfig('SEO_SITEMAP_CHANGEFREQ_POSTS', 'weekly'),
    priority: post.category ? '0.8' : '0.6'
  }
}

/**
 * 生成分类页面的sitemap条目
 * @param {string} category - 分类名（中文）
 * @param {number} postCount - 该分类下的文章数量
 * @returns {object} sitemap条目
 */
export function generateCategorySitemapEntry(category, postCount = 0) {
  if (!category) return null

  const url = generateCategoryUrl(category)
  
  return {
    url: url,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: postCount > 10 ? '0.8' : '0.6'
  }
}

/**
 * 为文章生成所有可能的URL（用于sitemap）
 * @param {object} post - 文章对象
 * @returns {array} URL数组
 */
export function generateAllPostUrls(post) {
  const urls = []
  
  if (!post) return urls

  // 主要URL（自定义分类URL或默认URL）
  const mainUrl = generatePostUrl(post)
  urls.push({
    url: mainUrl,
    isPrimary: true,
    lastmod: post.lastEditedTime || post.publishTime || new Date().toISOString(),
    changefreq: siteConfig('SEO_SITEMAP_CHANGEFREQ_POSTS', 'weekly'),
    priority: '0.8'
  })

  return urls
}

/**
 * 生成完整的sitemap数据
 * @param {array} allPages - 所有页面数据
 * @returns {object} sitemap数据
 */
export function generateSitemapData(allPages) {
  const baseUrl = siteConfig('LINK', '')
  const sitemapData = {
    urls: [],
    categories: [],
    posts: []
  }

  // 首页
  sitemapData.urls.push({
    url: baseUrl,
    lastmod: new Date().toISOString(),
    changefreq: siteConfig('SEO_SITEMAP_CHANGEFREQ_HOME', 'daily'),
    priority: '1.0'
  })

  // 处理文章
  const posts = allPages?.filter(page => 
    page.type === 'Post' && page.status === 'Published'
  ) || []

  posts.forEach(post => {
    const postUrls = generateAllPostUrls(post)
    sitemapData.posts.push(...postUrls)
  })

  // 处理分类页面
  const categoryStats = {}
  posts.forEach(post => {
    if (post.category) {
      categoryStats[post.category] = (categoryStats[post.category] || 0) + 1
    }
  })

  Object.keys(categoryStats).forEach(category => {
    const categoryEntry = generateCategorySitemapEntry(category, categoryStats[category])
    if (categoryEntry) {
      sitemapData.categories.push(categoryEntry)
    }
  })

  // 合并所有URL
  sitemapData.urls.push(...sitemapData.posts, ...sitemapData.categories)

  return sitemapData
}

/**
 * 生成XML格式的sitemap
 * @param {array} allPages - 所有页面数据
 * @returns {string} XML格式的sitemap
 */
export function generateSitemapXml(allPages) {
  const sitemapData = generateSitemapData(allPages)
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  sitemapData.urls.forEach(entry => {
    xml += '  <url>\n'
    xml += `    <loc>${entry.url}</loc>\n`
    xml += `    <lastmod>${entry.lastmod}</lastmod>\n`
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`
    xml += `    <priority>${entry.priority}</priority>\n`
    xml += '  </url>\n'
  })

  xml += '</urlset>'
  
  return xml
}

/**
 * 验证URL的有效性
 * @param {string} url - 要验证的URL
 * @returns {boolean} URL是否有效
 */
export function validateUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 清理和标准化URL
 * @param {string} url - 原始URL
 * @returns {string} 清理后的URL
 */
export function cleanUrl(url) {
  if (!url) return ''
  
  // 移除重复的斜杠
  url = url.replace(/\/+/g, '/')
  
  // 确保以http开头
  if (!url.startsWith('http')) {
    const baseUrl = siteConfig('LINK', '')
    url = baseUrl + (url.startsWith('/') ? url : '/' + url)
  }
  
  return url
}