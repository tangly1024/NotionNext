/**
 * SEO配置管理
 * 集中管理SEO相关的配置选项
 */

/**
 * 默认SEO配置
 */
export const DEFAULT_SEO_CONFIG = {
  // 基础配置
  titleSeparator: ' | ',
  maxTitleLength: 60,
  maxDescriptionLength: 160,
  minDescriptionLength: 120,
  maxKeywords: 10,
  
  // 图片配置
  defaultOgImage: '/bg_image.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  
  // Twitter配置
  twitterCardType: 'summary_large_image',
  
  // 结构化数据配置
  enableStructuredData: true,
  enableBreadcrumbs: true,
  enableArticleSchema: true,
  enableWebsiteSchema: true,
  enableOrganizationSchema: true,
  
  // 多语言配置
  enableHreflang: true,
  defaultLocale: 'zh-CN',
  
  // 性能配置
  enableDNSPrefetch: true,
  enablePreconnect: true,
  
  // 验证配置
  enableSEOValidation: process.env.NODE_ENV === 'development',
  
  // 爬虫配置
  robotsDirective: 'follow, index',
  
  // 缓存配置
  enableMetaCache: true,
  metaCacheTTL: 3600, // 1小时
}

/**
 * 获取SEO配置
 * @param {Object} customConfig 自定义配置
 * @param {Object} notionConfig Notion配置
 * @returns {Object} 合并后的配置
 */
export function getSEOConfig(customConfig = {}, notionConfig = {}) {
  return {
    ...DEFAULT_SEO_CONFIG,
    ...notionConfig,
    ...customConfig
  }
}

/**
 * 验证SEO配置
 * @param {Object} config SEO配置
 * @returns {Object} 验证结果
 */
export function validateSEOConfig(config) {
  const errors = []
  const warnings = []
  
  // 检查必需配置
  if (!config.titleSeparator) {
    errors.push('titleSeparator不能为空')
  }
  
  if (config.maxTitleLength < 30) {
    warnings.push('maxTitleLength过小，可能影响SEO效果')
  }
  
  if (config.maxDescriptionLength < 120) {
    warnings.push('maxDescriptionLength过小，建议至少120字符')
  }
  
  if (config.maxKeywords > 15) {
    warnings.push('maxKeywords过多，可能被搜索引擎视为关键词堆砌')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * SEO配置预设
 */
export const SEO_PRESETS = {
  // 博客优化预设
  blog: {
    maxTitleLength: 60,
    maxDescriptionLength: 160,
    enableArticleSchema: true,
    enableBreadcrumbs: true,
    robotsDirective: 'follow, index'
  },
  
  // 企业网站预设
  corporate: {
    maxTitleLength: 55,
    maxDescriptionLength: 155,
    enableOrganizationSchema: true,
    enableWebsiteSchema: true,
    robotsDirective: 'follow, index'
  },
  
  // 电商网站预设
  ecommerce: {
    maxTitleLength: 65,
    maxDescriptionLength: 160,
    enableProductSchema: true,
    enableBreadcrumbs: true,
    robotsDirective: 'follow, index'
  },
  
  // 新闻网站预设
  news: {
    maxTitleLength: 70,
    maxDescriptionLength: 160,
    enableArticleSchema: true,
    enableNewsSchema: true,
    robotsDirective: 'follow, index, news'
  }
}

/**
 * 应用SEO预设
 * @param {string} presetName 预设名称
 * @param {Object} customConfig 自定义配置
 * @returns {Object} 应用预设后的配置
 */
export function applySEOPreset(presetName, customConfig = {}) {
  const preset = SEO_PRESETS[presetName]
  if (!preset) {
    throw new Error(`未知的SEO预设: ${presetName}`)
  }
  
  return {
    ...DEFAULT_SEO_CONFIG,
    ...preset,
    ...customConfig
  }
}

/**
 * 获取页面类型特定的SEO配置
 * @param {string} pageType 页面类型
 * @param {Object} baseConfig 基础配置
 * @returns {Object} 页面特定配置
 */
export function getPageTypeSEOConfig(pageType, baseConfig = {}) {
  const pageConfigs = {
    home: {
      enableWebsiteSchema: true,
      enableOrganizationSchema: true,
      robotsDirective: 'follow, index'
    },
    
    article: {
      enableArticleSchema: true,
      enableBreadcrumbs: true,
      robotsDirective: 'follow, index'
    },
    
    category: {
      enableBreadcrumbs: true,
      robotsDirective: 'follow, index'
    },
    
    tag: {
      enableBreadcrumbs: true,
      robotsDirective: 'follow, index'
    },
    
    search: {
      robotsDirective: 'noindex, follow'
    },
    
    archive: {
      enableBreadcrumbs: true,
      robotsDirective: 'follow, index'
    },
    
    '404': {
      robotsDirective: 'noindex, nofollow'
    }
  }
  
  return {
    ...baseConfig,
    ...pageConfigs[pageType]
  }
}