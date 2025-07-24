/**
 * URL生成工具
 * 根据文章信息生成正确的URL路径
 */

import { getCategoryUrlPath, isCustomCategoryPath } from './categoryMapping'
import { siteConfig } from '@/lib/config'

/**
 * 生成文章的完整URL
 * @param {object} post - 文章对象
 * @param {string} customSlug - 自定义slug（可选）
 * @returns {string} 完整的文章URL
 */
export function generatePostUrl(post, customSlug = null) {
  if (!post) return '/'

  const baseUrl = siteConfig('LINK', '')
  const slug = customSlug || post.slug || post.id
  
  // 如果文章有分类，尝试使用自定义分类路径
  if (post.category) {
    const categoryPath = getCategoryUrlPath(post.category)
    
    // 如果是自定义分类，使用 /category-path/slug 格式
    if (categoryPath !== post.category) {
      const finalSlug = slug.includes('/') ? slug.split('/').pop() : slug
      return `${baseUrl}/${categoryPath}/${finalSlug}`
    }
  }

  // 默认使用原有的路径格式
  if (slug.includes('/')) {
    return `${baseUrl}/${slug}`
  } else {
    return `${baseUrl}/article/${slug}`
  }
}

/**
 * 生成文章的相对路径
 * @param {object} post - 文章对象
 * @param {string} customSlug - 自定义slug（可选）
 * @returns {string} 相对路径
 */
export function generatePostPath(post, customSlug = null) {
  if (!post) return '/'

  const slug = customSlug || post.slug || post.id
  
  // 如果文章有分类，尝试使用自定义分类路径
  if (post.category) {
    const categoryPath = getCategoryUrlPath(post.category)
    
    // 如果是自定义分类，使用 /category-path/slug 格式
    if (categoryPath !== post.category) {
      const finalSlug = slug.includes('/') ? slug.split('/').pop() : slug
      return `/${categoryPath}/${finalSlug}`
    }
  }

  // 默认使用原有的路径格式
  if (slug.includes('/')) {
    return `/${slug}`
  } else {
    return `/article/${slug}`
  }
}

/**
 * 生成分类页面的URL
 * @param {string} category - 分类名（中文）
 * @returns {string} 分类页面URL
 */
export function generateCategoryUrl(category) {
  if (!category) return '/'

  const baseUrl = siteConfig('LINK', '')
  const categoryPath = getCategoryUrlPath(category)
  
  return `${baseUrl}/category/${categoryPath}`
}

/**
 * 生成分类页面的相对路径
 * @param {string} category - 分类名（中文）
 * @returns {string} 分类页面相对路径
 */
export function generateCategoryPath(category) {
  if (!category) return '/'

  const categoryPath = getCategoryUrlPath(category)
  return `/category/${categoryPath}`
}

/**
 * 从URL路径解析文章信息
 * @param {string} pathname - URL路径
 * @returns {object} 解析结果
 */
export function parseUrlPath(pathname) {
  if (!pathname || pathname === '/') {
    return { type: 'home' }
  }

  const segments = pathname.split('/').filter(Boolean)
  
  if (segments.length === 0) {
    return { type: 'home' }
  }

  // 检查是否为分类页面 /category/xxx
  if (segments[0] === 'category' && segments.length === 2) {
    return {
      type: 'category',
      category: segments[1],
      isCustomCategory: isCustomCategoryPath(segments[1])
    }
  }

  // 检查是否为文章页面
  if (segments.length === 2) {
    const [prefix, slug] = segments
    
    return {
      type: 'post',
      prefix: prefix,
      slug: slug,
      isCustomCategory: isCustomCategoryPath(prefix)
    }
  }

  // 其他情况
  return {
    type: 'other',
    segments: segments
  }
}

/**
 * 检查URL是否为文章页面
 * @param {string} pathname - URL路径
 * @returns {boolean} 是否为文章页面
 */
export function isPostUrl(pathname) {
  const parsed = parseUrlPath(pathname)
  return parsed.type === 'post'
}

/**
 * 检查URL是否为分类页面
 * @param {string} pathname - URL路径
 * @returns {boolean} 是否为分类页面
 */
export function isCategoryUrl(pathname) {
  const parsed = parseUrlPath(pathname)
  return parsed.type === 'category'
}

/**
 * 为SEO生成规范URL
 * @param {object} post - 文章对象
 * @returns {string} 规范URL
 */
export function generateCanonicalUrl(post) {
  return generatePostUrl(post)
}

/**
 * 生成面包屑导航数据
 * @param {object} post - 文章对象
 * @param {string} pathname - 当前路径
 * @returns {array} 面包屑数据
 */
export function generateBreadcrumbs(post, pathname) {
  const breadcrumbs = [
    { name: '首页', url: '/' }
  ]

  if (!post) return breadcrumbs

  // 添加分类面包屑
  if (post.category) {
    breadcrumbs.push({
      name: post.category,
      url: generateCategoryPath(post.category)
    })
  }

  // 添加当前文章
  breadcrumbs.push({
    name: post.title,
    url: generatePostPath(post),
    current: true
  })

  return breadcrumbs
}