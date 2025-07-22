/**
 * 面包屑导航生成器
 * 根据页面类型和路径自动生成面包屑导航
 */

/**
 * 生成面包屑导航数据
 * @param {Object} pageData 页面数据
 * @param {Object} siteInfo 网站信息
 * @param {Object} router Next.js路由对象
 * @param {Object} locale 语言配置
 * @returns {Array} 面包屑数据数组
 */
export function generateBreadcrumbs(pageData, siteInfo, router, locale) {
  const breadcrumbs = []
  const baseUrl = siteInfo?.link || ''
  
  // 首页面包屑
  breadcrumbs.push({
    name: locale?.COMMON?.HOME || '首页',
    url: '/'
  })
  
  // 根据路由生成面包屑
  switch (router.route) {
    case '/':
      // 首页不需要额外面包屑
      return []
      
    case '/archive':
      breadcrumbs.push({
        name: locale?.NAV?.ARCHIVE || '归档',
        url: '/archive'
      })
      break
      
    case '/category':
      breadcrumbs.push({
        name: locale?.COMMON?.CATEGORY || '分类',
        url: '/category'
      })
      break
      
    case '/category/[category]':
    case '/category/[category]/page/[page]':
      breadcrumbs.push({
        name: locale?.COMMON?.CATEGORY || '分类',
        url: '/category'
      })
      if (pageData.category) {
        breadcrumbs.push({
          name: pageData.category,
          url: `/category/${pageData.category}`
        })
      }
      break
      
    case '/tag':
      breadcrumbs.push({
        name: locale?.COMMON?.TAGS || '标签',
        url: '/tag'
      })
      break
      
    case '/tag/[tag]':
    case '/tag/[tag]/page/[page]':
      breadcrumbs.push({
        name: locale?.COMMON?.TAGS || '标签',
        url: '/tag'
      })
      if (pageData.tag) {
        breadcrumbs.push({
          name: pageData.tag,
          url: `/tag/${pageData.tag}`
        })
      }
      break
      
    case '/search':
    case '/search/[keyword]':
    case '/search/[keyword]/page/[page]':
      breadcrumbs.push({
        name: locale?.NAV?.SEARCH || '搜索',
        url: '/search'
      })
      if (pageData.keyword) {
        breadcrumbs.push({
          name: `搜索: ${pageData.keyword}`,
          url: `/search/${pageData.keyword}`
        })
      }
      break
      
    case '/page/[page]':
      breadcrumbs.push({
        name: `第 ${pageData.page} 页`,
        url: `/page/${pageData.page}`
      })
      break
      
    default:
      // 文章页面或其他页面
      if (pageData.type === 'Post' && pageData.category) {
        // 添加分类面包屑
        breadcrumbs.push({
          name: locale?.COMMON?.CATEGORY || '分类',
          url: '/category'
        })
        breadcrumbs.push({
          name: pageData.category[0],
          url: `/category/${pageData.category[0]}`
        })
      }
      
      if (pageData.title) {
        breadcrumbs.push({
          name: pageData.title,
          url: `/${pageData.slug || ''}`
        })
      }
      break
  }
  
  return breadcrumbs
}

/**
 * 生成智能面包屑（基于URL路径）
 * @param {string} pathname URL路径
 * @param {Object} siteInfo 网站信息
 * @param {Object} locale 语言配置
 * @returns {Array} 面包屑数据数组
 */
export function generateSmartBreadcrumbs(pathname, siteInfo, locale) {
  const breadcrumbs = []
  const segments = pathname.split('/').filter(segment => segment)
  
  // 首页
  breadcrumbs.push({
    name: locale?.COMMON?.HOME || '首页',
    url: '/'
  })
  
  // 如果是首页，直接返回
  if (segments.length === 0) {
    return []
  }
  
  let currentPath = ''
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // 获取段名称
    let segmentName = segment
    
    // 根据段内容智能命名
    switch (segment) {
      case 'archive':
        segmentName = locale?.NAV?.ARCHIVE || '归档'
        break
      case 'category':
        segmentName = locale?.COMMON?.CATEGORY || '分类'
        break
      case 'tag':
        segmentName = locale?.COMMON?.TAGS || '标签'
        break
      case 'search':
        segmentName = locale?.NAV?.SEARCH || '搜索'
        break
      case 'page':
        segmentName = '页面'
        break
      default:
        // 解码URL编码的中文
        try {
          segmentName = decodeURIComponent(segment)
        } catch (e) {
          segmentName = segment
        }
        
        // 如果是数字，可能是页码
        if (/^\d+$/.test(segment)) {
          const prevSegment = segments[index - 1]
          if (prevSegment === 'page') {
            segmentName = `第 ${segment} 页`
          }
        }
        break
    }
    
    breadcrumbs.push({
      name: segmentName,
      url: currentPath
    })
  })
  
  return breadcrumbs
}

/**
 * 生成自定义面包屑
 * @param {Array} customBreadcrumbs 自定义面包屑配置
 * @param {Object} siteInfo 网站信息
 * @returns {Array} 面包屑数据数组
 */
export function generateCustomBreadcrumbs(customBreadcrumbs, siteInfo) {
  if (!customBreadcrumbs || !Array.isArray(customBreadcrumbs)) {
    return []
  }
  
  return customBreadcrumbs.map(crumb => ({
    name: crumb.name || crumb.title,
    url: crumb.url || crumb.href || crumb.link
  }))
}

/**
 * 验证面包屑数据
 * @param {Array} breadcrumbs 面包屑数据
 * @returns {Object} 验证结果
 */
export function validateBreadcrumbs(breadcrumbs) {
  const result = {
    isValid: true,
    errors: [],
    warnings: []
  }
  
  if (!breadcrumbs || !Array.isArray(breadcrumbs)) {
    result.isValid = false
    result.errors.push('面包屑数据必须是数组')
    return result
  }
  
  if (breadcrumbs.length === 0) {
    result.warnings.push('面包屑数据为空')
    return result
  }
  
  breadcrumbs.forEach((crumb, index) => {
    if (!crumb.name) {
      result.errors.push(`第${index + 1}个面包屑缺少name字段`)
      result.isValid = false
    }
    
    if (!crumb.url) {
      result.errors.push(`第${index + 1}个面包屑缺少url字段`)
      result.isValid = false
    }
    
    // 检查URL格式
    if (crumb.url && !crumb.url.startsWith('/') && !crumb.url.startsWith('http')) {
      result.warnings.push(`第${index + 1}个面包屑URL格式可能不正确`)
    }
  })
  
  // 检查是否有重复的面包屑
  const urls = breadcrumbs.map(crumb => crumb.url)
  const uniqueUrls = [...new Set(urls)]
  if (urls.length !== uniqueUrls.length) {
    result.warnings.push('存在重复的面包屑URL')
  }
  
  return result
}

/**
 * 优化面包屑显示
 * @param {Array} breadcrumbs 原始面包屑数据
 * @param {Object} options 优化选项
 * @returns {Array} 优化后的面包屑数据
 */
export function optimizeBreadcrumbs(breadcrumbs, options = {}) {
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return []
  }
  
  const {
    maxLength = 50, // 最大名称长度
    maxItems = 5,   // 最大项目数量
    showHome = true, // 是否显示首页
    ellipsis = '...' // 省略号
  } = options
  
  let optimized = [...breadcrumbs]
  
  // 如果不显示首页，移除第一个项目（假设是首页）
  if (!showHome && optimized.length > 0 && optimized[0].url === '/') {
    optimized = optimized.slice(1)
  }
  
  // 限制项目数量
  if (optimized.length > maxItems) {
    const start = optimized.slice(0, 1) // 保留第一个
    const end = optimized.slice(-(maxItems - 2)) // 保留最后几个
    optimized = [
      ...start,
      { name: ellipsis, url: '#', isEllipsis: true },
      ...end
    ]
  }
  
  // 优化名称长度
  optimized = optimized.map(crumb => {
    if (crumb.isEllipsis) return crumb
    
    let name = crumb.name
    if (name.length > maxLength) {
      name = name.substring(0, maxLength - 3) + ellipsis
    }
    
    return {
      ...crumb,
      name,
      originalName: crumb.name
    }
  })
  
  return optimized
}

/**
 * 生成面包屑JSON-LD结构化数据
 * @param {Array} breadcrumbs 面包屑数据
 * @param {string} baseUrl 基础URL
 * @returns {Object} BreadcrumbList结构化数据
 */
export function generateBreadcrumbJsonLd(breadcrumbs, baseUrl) {
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null
  }
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs
      .filter(crumb => !crumb.isEllipsis) // 过滤省略号
      .map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.originalName || crumb.name,
        item: crumb.url.startsWith('http') ? crumb.url : `${baseUrl}${crumb.url}`
      }))
  }
}

/**
 * 生成面包屑HTML
 * @param {Array} breadcrumbs 面包屑数据
 * @param {Object} options 渲染选项
 * @returns {string} HTML字符串
 */
export function renderBreadcrumbsHtml(breadcrumbs, options = {}) {
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return ''
  }
  
  const {
    className = 'breadcrumbs',
    separator = '/',
    linkClassName = 'breadcrumb-link',
    activeClassName = 'breadcrumb-active',
    listClassName = 'breadcrumb-list',
    itemClassName = 'breadcrumb-item'
  } = options
  
  const items = breadcrumbs.map((crumb, index) => {
    const isLast = index === breadcrumbs.length - 1
    const isEllipsis = crumb.isEllipsis
    
    let content
    if (isEllipsis) {
      content = `<span class="${activeClassName}">${crumb.name}</span>`
    } else if (isLast) {
      content = `<span class="${activeClassName}">${crumb.name}</span>`
    } else {
      content = `<a href="${crumb.url}" class="${linkClassName}">${crumb.name}</a>`
    }
    
    const separatorHtml = !isLast ? `<span class="breadcrumb-separator">${separator}</span>` : ''
    
    return `<li class="${itemClassName}">${content}${separatorHtml}</li>`
  }).join('')
  
  return `
    <nav class="${className}" aria-label="面包屑导航">
      <ol class="${listClassName}">
        ${items}
      </ol>
    </nav>
  `
}

/**
 * 面包屑工具类
 */
export class BreadcrumbManager {
  constructor(siteInfo, locale) {
    this.siteInfo = siteInfo
    this.locale = locale
    this.cache = new Map()
  }
  
  /**
   * 生成面包屑（带缓存）
   * @param {Object} pageData 页面数据
   * @param {Object} router 路由对象
   * @param {Object} options 选项
   * @returns {Array} 面包屑数据
   */
  generate(pageData, router, options = {}) {
    const cacheKey = `${router.route}-${JSON.stringify(pageData)}`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }
    
    let breadcrumbs
    
    if (options.custom) {
      breadcrumbs = generateCustomBreadcrumbs(options.custom, this.siteInfo)
    } else if (options.smart) {
      breadcrumbs = generateSmartBreadcrumbs(router.asPath, this.siteInfo, this.locale)
    } else {
      breadcrumbs = generateBreadcrumbs(pageData, this.siteInfo, router, this.locale)
    }
    
    // 优化面包屑
    if (options.optimize !== false) {
      breadcrumbs = optimizeBreadcrumbs(breadcrumbs, options.optimizeOptions)
    }
    
    // 缓存结果
    this.cache.set(cacheKey, breadcrumbs)
    
    return breadcrumbs
  }
  
  /**
   * 清除缓存
   */
  clearCache() {
    this.cache.clear()
  }
  
  /**
   * 生成结构化数据
   * @param {Array} breadcrumbs 面包屑数据
   * @returns {Object} 结构化数据
   */
  generateStructuredData(breadcrumbs) {
    return generateBreadcrumbJsonLd(breadcrumbs, this.siteInfo?.link)
  }
  
  /**
   * 渲染HTML
   * @param {Array} breadcrumbs 面包屑数据
   * @param {Object} options 渲染选项
   * @returns {string} HTML字符串
   */
  renderHtml(breadcrumbs, options) {
    return renderBreadcrumbsHtml(breadcrumbs, options)
  }
}