/**
 * 图片SEO优化配置
 * 集中管理图片SEO相关的配置选项
 */

import { siteConfig } from '@/lib/config'

/**
 * 默认图片SEO配置
 */
export const DEFAULT_IMAGE_SEO_CONFIG = {
  // Alt属性配置
  altText: {
    enabled: true,
    autoGenerate: true,
    minLength: 10,
    maxLength: 125,
    required: true,
    fallbackText: 'Image',
    includeContext: true,
    includeFilename: true
  },

  // 文件名优化配置
  filename: {
    enabled: false, // 默认关闭，因为需要服务器端支持
    maxLength: 50,
    separator: '-',
    includeKeywords: true,
    includeDate: false,
    removeNumbers: true,
    cleanSpecialChars: true
  },

  // 图片格式配置
  formats: {
    preferred: ['avif', 'webp'],
    supported: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg'],
    autoConvert: false, // 需要服务器端支持
    quality: 85
  },

  // 文件大小配置
  fileSize: {
    maxSize: 2 * 1024 * 1024, // 2MB
    recommendedSize: 500 * 1024, // 500KB
    warningSize: 1024 * 1024, // 1MB
    enableCompression: true
  },

  // 性能优化配置
  performance: {
    enableLazyLoading: true,
    enablePreloading: true,
    enableResponsiveImages: true,
    preloadCriticalImages: true,
    lazyLoadThreshold: '50px',
    intersectionThreshold: 0.1
  },

  // SEO配置
  seo: {
    enableStructuredData: true,
    enableImageSitemap: true,
    autoGenerateAlt: true,
    addTitleAttribute: true,
    addDimensionAttributes: true,
    enableImageOptimization: true
  },

  // 可访问性配置
  accessibility: {
    enforceAltText: true,
    skipDecorativeImages: false,
    addAriaLabels: false,
    supportScreenReaders: true
  },

  // 验证配置
  validation: {
    enabled: true,
    strictMode: false,
    checkAltLength: true,
    checkFileSize: true,
    checkFormat: true,
    checkDimensions: true
  },

  // 错误处理配置
  errorHandling: {
    enableFallback: true,
    fallbackImage: null,
    retryAttempts: 2,
    logErrors: true,
    gracefulDegradation: true
  }
}

/**
 * 获取图片SEO配置
 * @param {Object} customConfig - 自定义配置
 * @returns {Object} 合并后的配置
 */
export function getImageSEOConfig(customConfig = {}) {
  // 从站点配置中获取相关设置
  const siteImageConfig = {
    altText: {
      autoGenerate: siteConfig('SEO_AUTO_GENERATE_ALT', true),
      maxLength: siteConfig('IMAGE_ALT_MAX_LENGTH', 125)
    },
    performance: {
      enableLazyLoading: siteConfig('IMAGE_LAZY_LOADING', true),
      enablePreloading: siteConfig('IMAGE_PRELOADING', true)
    },
    seo: {
      enableStructuredData: siteConfig('SEO_STRUCTURED_DATA', true),
      enableImageSitemap: siteConfig('SEO_SITEMAP_IMAGES', true)
    },
    fileSize: {
      maxSize: siteConfig('IMAGE_MAX_SIZE', 2 * 1024 * 1024),
      recommendedSize: siteConfig('IMAGE_RECOMMENDED_SIZE', 500 * 1024)
    },
    formats: {
      quality: siteConfig('IMAGE_QUALITY', 85)
    }
  }

  // 深度合并配置
  return deepMerge(DEFAULT_IMAGE_SEO_CONFIG, siteImageConfig, customConfig)
}

/**
 * 验证图片SEO配置
 * @param {Object} config - 配置对象
 * @returns {Object} 验证结果
 */
export function validateImageSEOConfig(config) {
  const validation = {
    isValid: true,
    errors: [],
    warnings: []
  }

  // 验证alt文本配置
  if (config.altText.maxLength < config.altText.minLength) {
    validation.isValid = false
    validation.errors.push('Alt text max length cannot be less than min length')
  }

  if (config.altText.maxLength > 250) {
    validation.warnings.push('Alt text max length is very long, consider reducing it')
  }

  // 验证文件大小配置
  if (config.fileSize.recommendedSize > config.fileSize.maxSize) {
    validation.isValid = false
    validation.errors.push('Recommended file size cannot be larger than max file size')
  }

  // 验证格式配置
  const invalidFormats = config.formats.preferred.filter(
    format => !config.formats.supported.includes(format)
  )
  if (invalidFormats.length > 0) {
    validation.isValid = false
    validation.errors.push(`Preferred formats contain unsupported formats: ${invalidFormats.join(', ')}`)
  }

  // 验证质量设置
  if (config.formats.quality < 1 || config.formats.quality > 100) {
    validation.isValid = false
    validation.errors.push('Image quality must be between 1 and 100')
  }

  return validation
}

/**
 * 获取图片优化建议
 * @param {Object} imageData - 图片数据
 * @param {Object} config - 配置
 * @returns {Array} 优化建议列表
 */
export function getImageOptimizationSuggestions(imageData, config = getImageSEOConfig()) {
  const suggestions = []

  // Alt属性建议
  if (!imageData.alt && config.altText.required) {
    suggestions.push({
      type: 'error',
      category: 'accessibility',
      message: 'Missing alt attribute',
      priority: 'high',
      fix: 'Add descriptive alt text'
    })
  } else if (imageData.alt && imageData.alt.length < config.altText.minLength) {
    suggestions.push({
      type: 'warning',
      category: 'accessibility',
      message: 'Alt text is too short',
      priority: 'medium',
      fix: 'Make alt text more descriptive'
    })
  } else if (imageData.alt && imageData.alt.length > config.altText.maxLength) {
    suggestions.push({
      type: 'warning',
      category: 'accessibility',
      message: 'Alt text is too long',
      priority: 'medium',
      fix: 'Shorten alt text while keeping it descriptive'
    })
  }

  // 文件大小建议
  if (imageData.fileSize > config.fileSize.maxSize) {
    suggestions.push({
      type: 'error',
      category: 'performance',
      message: 'Image file size exceeds maximum limit',
      priority: 'high',
      fix: 'Compress or resize the image'
    })
  } else if (imageData.fileSize > config.fileSize.recommendedSize) {
    suggestions.push({
      type: 'warning',
      category: 'performance',
      message: 'Image file size is larger than recommended',
      priority: 'medium',
      fix: 'Consider compressing the image'
    })
  }

  // 格式建议
  const currentFormat = getImageFormat(imageData.src)
  if (!config.formats.preferred.includes(currentFormat)) {
    suggestions.push({
      type: 'info',
      category: 'performance',
      message: `Consider using modern format (${config.formats.preferred.join(' or ')})`,
      priority: 'low',
      fix: `Convert from ${currentFormat} to ${config.formats.preferred[0]}`
    })
  }

  // 尺寸属性建议
  if (!imageData.width || !imageData.height) {
    suggestions.push({
      type: 'warning',
      category: 'performance',
      message: 'Missing width/height attributes',
      priority: 'medium',
      fix: 'Add width and height attributes to prevent layout shift'
    })
  }

  // 加载属性建议
  if (!imageData.loading && config.performance.enableLazyLoading) {
    suggestions.push({
      type: 'info',
      category: 'performance',
      message: 'Consider adding loading attribute',
      priority: 'low',
      fix: 'Add loading="lazy" for non-critical images'
    })
  }

  return suggestions
}

/**
 * 生成图片SEO检查清单
 * @param {Object} config - 配置
 * @returns {Array} 检查清单
 */
export function generateImageSEOChecklist(config = getImageSEOConfig()) {
  const checklist = []

  if (config.altText.enabled) {
    checklist.push({
      category: 'Accessibility',
      item: 'All images have descriptive alt attributes',
      required: config.altText.required,
      description: 'Alt text helps screen readers and improves SEO'
    })
  }

  if (config.seo.addTitleAttribute) {
    checklist.push({
      category: 'SEO',
      item: 'Images have title attributes',
      required: false,
      description: 'Title attributes provide additional context'
    })
  }

  if (config.seo.addDimensionAttributes) {
    checklist.push({
      category: 'Performance',
      item: 'Images have width and height attributes',
      required: true,
      description: 'Prevents cumulative layout shift (CLS)'
    })
  }

  if (config.performance.enableLazyLoading) {
    checklist.push({
      category: 'Performance',
      item: 'Non-critical images use lazy loading',
      required: false,
      description: 'Improves initial page load performance'
    })
  }

  if (config.seo.enableStructuredData) {
    checklist.push({
      category: 'SEO',
      item: 'Images have structured data markup',
      required: false,
      description: 'Helps search engines understand image content'
    })
  }

  checklist.push({
    category: 'Performance',
    item: 'Images are optimized for web',
    required: true,
    description: 'Use appropriate formats and compression'
  })

  checklist.push({
    category: 'SEO',
    item: 'Image filenames are descriptive',
    required: false,
    description: 'Descriptive filenames improve SEO'
  })

  return checklist
}

// ==================== 辅助函数 ====================

/**
 * 深度合并对象
 */
function deepMerge(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepMerge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMerge(target, ...sources)
}

/**
 * 检查是否为对象
 */
function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * 获取图片格式
 */
function getImageFormat(src) {
  if (!src) return 'unknown'
  const extension = src.split('.').pop()?.toLowerCase().split('?')[0]
  return extension || 'unknown'
}

/**
 * 预设配置模板
 */
export const IMAGE_SEO_PRESETS = {
  // 严格模式 - 最高质量要求
  strict: {
    altText: {
      required: true,
      minLength: 15,
      maxLength: 100
    },
    fileSize: {
      maxSize: 1024 * 1024, // 1MB
      recommendedSize: 300 * 1024 // 300KB
    },
    validation: {
      strictMode: true,
      enforceAltText: true
    }
  },

  // 性能优先模式
  performance: {
    fileSize: {
      maxSize: 500 * 1024, // 500KB
      recommendedSize: 200 * 1024 // 200KB
    },
    formats: {
      preferred: ['avif', 'webp'],
      quality: 75
    },
    performance: {
      enableLazyLoading: true,
      enablePreloading: false
    }
  },

  // 可访问性优先模式
  accessibility: {
    altText: {
      required: true,
      enforceAltText: true,
      minLength: 10
    },
    accessibility: {
      enforceAltText: true,
      addAriaLabels: true,
      supportScreenReaders: true
    }
  },

  // 宽松模式 - 最小要求
  relaxed: {
    altText: {
      required: false,
      minLength: 5,
      maxLength: 200
    },
    fileSize: {
      maxSize: 5 * 1024 * 1024, // 5MB
      recommendedSize: 1024 * 1024 // 1MB
    },
    validation: {
      strictMode: false
    }
  }
}