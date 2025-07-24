/**
 * 分类URL映射工具
 * 将中文分类名映射为英文URL路径
 */

import { siteConfig } from '@/lib/config'

// 获取分类映射配置
function getCategoryMappingConfig() {
  return siteConfig('CATEGORY_URL_MAPPING', {
    '影视资源': 'movie',
    '软件资源': 'software', 
    '教程资源': 'tutorials',
    '游戏资源': 'games',
    '书籍资源': 'books'
  })
}

// 分类映射配置
export const CATEGORY_URL_MAPPING = getCategoryMappingConfig()

// 反向映射（英文到中文）
export const REVERSE_CATEGORY_MAPPING = Object.fromEntries(
  Object.entries(CATEGORY_URL_MAPPING).map(([chinese, english]) => [english, chinese])
)

/**
 * 将中文分类名转换为英文URL路径
 * @param {string} chineseCategory - 中文分类名
 * @returns {string} 英文URL路径
 */
export function getCategoryUrlPath(chineseCategory) {
  return CATEGORY_URL_MAPPING[chineseCategory] || chineseCategory
}

/**
 * 将英文URL路径转换为中文分类名
 * @param {string} englishPath - 英文URL路径
 * @returns {string} 中文分类名
 */
export function getCategoryFromUrlPath(englishPath) {
  return REVERSE_CATEGORY_MAPPING[englishPath] || englishPath
}

/**
 * 检查是否为自定义分类路径
 * @param {string} path - URL路径
 * @returns {boolean} 是否为自定义分类路径
 */
export function isCustomCategoryPath(path) {
  return Object.values(CATEGORY_URL_MAPPING).includes(path)
}

/**
 * 生成文章的自定义URL
 * @param {object} post - 文章对象
 * @param {string} customSlug - 自定义slug（可选）
 * @returns {string} 自定义URL路径
 */
export function generateCustomPostUrl(post, customSlug = null) {
  if (!post || !post.category) {
    return null
  }

  const categoryPath = getCategoryUrlPath(post.category)
  const slug = customSlug || post.slug || post.id
  
  return `/${categoryPath}/${slug}`
}

/**
 * 解析自定义URL路径
 * @param {string} prefix - URL前缀
 * @param {string} slug - URL slug
 * @returns {object} 解析结果
 */
export function parseCustomUrl(prefix, slug) {
  const chineseCategory = getCategoryFromUrlPath(prefix)
  const isCustomCategory = isCustomCategoryPath(prefix)
  
  return {
    category: chineseCategory,
    slug: slug,
    isCustomCategory: isCustomCategory,
    originalPrefix: prefix
  }
}

/**
 * 获取所有自定义分类路径
 * @returns {string[]} 所有英文分类路径
 */
export function getAllCustomCategoryPaths() {
  return Object.values(CATEGORY_URL_MAPPING)
}

/**
 * 获取所有中文分类名
 * @returns {string[]} 所有中文分类名
 */
export function getAllChineseCategories() {
  return Object.keys(CATEGORY_URL_MAPPING)
}

/**
 * 为文章生成多个可能的URL路径（用于静态生成）
 * @param {object} post - 文章对象
 * @returns {string[]} 可能的URL路径数组
 */
export function generatePostUrlVariants(post) {
  const urls = []
  
  if (!post) return urls
  
  // 默认路径 /article/slug
  if (post.slug) {
    urls.push(`/article/${post.slug}`)
  }
  
  // 自定义分类路径 /category-path/slug
  if (post.category) {
    const categoryPath = getCategoryUrlPath(post.category)
    const slug = post.slug || post.id
    urls.push(`/${categoryPath}/${slug}`)
  }
  
  return urls
}