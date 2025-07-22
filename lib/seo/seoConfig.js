/**
 * SEO配置和测试规则
 * 定义SEO测试的规则、阈值和配置
 */

export const SEO_TEST_CONFIG = {
  // Meta标签配置
  meta: {
    title: {
      minLength: 10,
      maxLength: 60,
      required: true
    },
    description: {
      minLength: 120,
      maxLength: 160,
      required: true
    },
    keywords: {
      maxCount: 10,
      required: false
    }
  },

  // 内容质量配置
  content: {
    minWordCount: 300,
    maxWordCount: 2000,
    headingStructure: {
      maxH1Count: 1,
      requireH1: true
    }
  },

  // 性能配置
  performance: {
    maxLoadTime: 3000, // 毫秒
    warnLoadTime: 1000, // 毫秒
    imageOptimization: {
      preferredFormats: ['webp', 'avif'],
      maxUnoptimizedRatio: 0.5
    }
  },

  // 结构化数据配置
  structuredData: {
    requiredSchemas: {
      article: ['headline', 'author', 'datePublished'],
      website: ['name', 'url'],
      organization: ['name', 'url']
    }
  },

  // 技术SEO配置
  technical: {
    httpsRequired: true,
    robotsTxtRequired: true,
    sitemapRequired: true
  }
}

/**
 * SEO测试规则定义
 */
export const SEO_TEST_RULES = {
  // 关键测试规则
  critical: [
    'testTitleTag',
    'testMetaDescription',
    'testHeadingStructure',
    'testHttpsRedirect'
  ],

  // 重要测试规则
  important: [
    'testCanonicalUrl',
    'testOpenGraphTags',
    'testJsonLdPresence',
    'testRobotsTxt',
    'testSitemap'
  ],

  // 建议测试规则
  recommended: [
    'testTwitterCardTags',
    'testArticleSchema',
    'testWebSiteSchema',
    'testImageOptimization',
    'testContentLength'
  ],

  // 可选测试规则
  optional: [
    'testMetaKeywords',
    'testOrganizationSchema',
    'testBreadcrumbSchema'
  ]
}

/**
 * SEO评分权重配置
 */
export const SEO_SCORING_WEIGHTS = {
  critical: 40,    // 关键测试占40%
  important: 30,   // 重要测试占30%
  recommended: 20, // 建议测试占20%
  optional: 10     // 可选测试占10%
}

/**
 * 测试套件配置
 */
export const TEST_SUITES_CONFIG = {
  'basic-seo': {
    name: '基础SEO测试',
    description: '检查基本的SEO元素',
    tests: [
      'testTitleTag',
      'testMetaDescription',
      'testCanonicalUrl',
      'testHeadingStructure'
    ],
    weight: 'critical'
  },

  'meta-tags': {
    name: 'Meta标签测试',
    description: '全面检查页面meta标签',
    tests: [
      'testTitleTag',
      'testMetaDescription',
      'testMetaKeywords',
      'testCanonicalUrl',
      'testViewportTag',
      'testRobotsTag'
    ],
    weight: 'critical'
  },

  'social-media': {
    name: '社交媒体优化',
    description: '检查社交媒体分享优化',
    tests: [
      'testOpenGraphTags',
      'testTwitterCardTags'
    ],
    weight: 'important'
  },

  'structured-data': {
    name: '结构化数据',
    description: '检查结构化数据实现',
    tests: [
      'testJsonLdPresence',
      'testArticleSchema',
      'testWebSiteSchema',
      'testOrganizationSchema',
      'testBreadcrumbSchema'
    ],
    weight: 'important'
  },

  'performance': {
    name: '性能优化',
    description: '检查页面性能相关指标',
    tests: [
      'testPageLoadTime',
      'testImageOptimization',
      'testResourceCompression',
      'testCacheHeaders'
    ],
    weight: 'recommended'
  },

  'technical-seo': {
    name: '技术SEO',
    description: '检查技术SEO实现',
    tests: [
      'testHttpsRedirect',
      'testRobotsTxt',
      'testSitemap',
      'testUrlStructure',
      'testInternalLinks'
    ],
    weight: 'important'
  },

  'content-quality': {
    name: '内容质量',
    description: '检查内容质量和结构',
    tests: [
      'testHeadingStructure',
      'testContentLength',
      'testKeywordDensity',
      'testReadability',
      'testImageAltTags'
    ],
    weight: 'recommended'
  },

  'accessibility': {
    name: '可访问性',
    description: '检查页面可访问性',
    tests: [
      'testImageAltTags',
      'testHeadingStructure',
      'testColorContrast',
      'testKeyboardNavigation'
    ],
    weight: 'recommended'
  }
}

/**
 * 错误消息模板
 */
export const ERROR_MESSAGES = {
  title: {
    missing: '页面缺少title标签',
    tooShort: '标题过短，建议至少{minLength}个字符',
    tooLong: '标题过长，建议不超过{maxLength}个字符',
    empty: '标题内容为空'
  },
  
  metaDescription: {
    missing: '页面缺少meta description标签',
    tooShort: '描述过短，建议至少{minLength}个字符',
    tooLong: '描述过长，建议不超过{maxLength}个字符',
    empty: 'meta description内容为空'
  },

  headingStructure: {
    noH1: '页面缺少H1标签',
    multipleH1: '页面有多个H1标签，建议只使用一个',
    skipLevel: '标题层级跳跃，不符合语义化结构',
    noHeadings: '页面没有标题标签'
  },

  structuredData: {
    noJsonLd: '未找到JSON-LD结构化数据',
    invalidSchema: '结构化数据格式不正确',
    missingFields: '结构化数据缺少必要字段: {fields}'
  },

  performance: {
    slowLoading: '页面加载时间过长: {time}ms',
    unoptimizedImages: '发现未优化的图片，建议使用WebP/AVIF格式',
    noCompression: '资源未启用压缩'
  },

  technical: {
    noHttps: '网站未使用HTTPS',
    noRobotsTxt: 'robots.txt文件不存在或无法访问',
    noSitemap: 'sitemap.xml文件不存在或无法访问',
    robotsBlocked: 'robots.txt可能阻止了搜索引擎爬取'
  }
}

/**
 * 成功消息模板
 */
export const SUCCESS_MESSAGES = {
  title: '标题设置正确，长度合适',
  metaDescription: '描述设置正确，长度合适',
  headingStructure: '标题结构良好，符合语义化要求',
  structuredData: '结构化数据实现完整',
  performance: '页面性能良好',
  https: '网站正确使用HTTPS',
  robotsTxt: 'robots.txt文件存在且配置合理',
  sitemap: 'sitemap.xml文件存在且格式正确'
}

/**
 * 优化建议模板
 */
export const OPTIMIZATION_SUGGESTIONS = {
  title: {
    tooShort: '增加标题长度，包含更多描述性关键词',
    tooLong: '缩短标题长度，保留最重要的关键词',
    missing: '为每个页面添加唯一且描述性的标题'
  },

  metaDescription: {
    tooShort: '扩展描述内容，更详细地描述页面内容',
    tooLong: '精简描述内容，突出最重要的信息',
    missing: '为每个页面添加独特的meta描述'
  },

  structuredData: {
    missing: '添加相关的结构化数据以帮助搜索引擎理解内容',
    incomplete: '补充结构化数据中的必要字段'
  },

  performance: {
    slowLoading: '优化图片大小、启用压缩、使用CDN',
    images: '使用现代图片格式如WebP、AVIF'
  },

  technical: {
    https: '启用HTTPS以提高安全性和SEO排名',
    robots: '创建robots.txt文件并正确配置',
    sitemap: '创建XML sitemap并提交到搜索引擎'
  }
}

/**
 * 获取测试配置
 */
export function getTestConfig(testName) {
  const configMap = {
    title: SEO_TEST_CONFIG.meta.title,
    metaDescription: SEO_TEST_CONFIG.meta.description,
    metaKeywords: SEO_TEST_CONFIG.meta.keywords,
    contentLength: SEO_TEST_CONFIG.content,
    headingStructure: SEO_TEST_CONFIG.content.headingStructure,
    performance: SEO_TEST_CONFIG.performance,
    structuredData: SEO_TEST_CONFIG.structuredData
  }

  return configMap[testName] || {}
}

/**
 * 获取错误消息
 */
export function getErrorMessage(testName, errorType, params = {}) {
  const messages = ERROR_MESSAGES[testName]
  if (!messages || !messages[errorType]) {
    return `${testName} 测试失败: ${errorType}`
  }

  let message = messages[errorType]
  
  // 替换参数
  Object.keys(params).forEach(key => {
    message = message.replace(`{${key}}`, params[key])
  })

  return message
}

/**
 * 获取成功消息
 */
export function getSuccessMessage(testName) {
  return SUCCESS_MESSAGES[testName] || `${testName} 测试通过`
}

/**
 * 获取优化建议
 */
export function getOptimizationSuggestion(testName, issueType) {
  const suggestions = OPTIMIZATION_SUGGESTIONS[testName]
  if (!suggestions) {
    return '请查看测试结果并进行相应优化'
  }

  return suggestions[issueType] || suggestions.general || '请进行相应优化'
}

/**
 * 计算SEO得分
 */
export function calculateSEOScore(testResults) {
  const scoreByWeight = {
    critical: 0,
    important: 0,
    recommended: 0,
    optional: 0
  }

  const countByWeight = {
    critical: 0,
    important: 0,
    recommended: 0,
    optional: 0
  }

  // 统计各权重级别的测试结果
  testResults.forEach(result => {
    const weight = getTestWeight(result.test)
    countByWeight[weight]++
    
    if (result.status === 'PASS') {
      scoreByWeight[weight] += 1
    } else if (result.status === 'WARN') {
      scoreByWeight[weight] += 0.5
    }
  })

  // 计算加权得分
  let totalScore = 0
  let totalWeight = 0

  Object.keys(SEO_SCORING_WEIGHTS).forEach(weight => {
    if (countByWeight[weight] > 0) {
      const weightScore = (scoreByWeight[weight] / countByWeight[weight]) * SEO_SCORING_WEIGHTS[weight]
      totalScore += weightScore
      totalWeight += SEO_SCORING_WEIGHTS[weight]
    }
  })

  return totalWeight > 0 ? Math.round(totalScore / totalWeight * 100) : 0
}

/**
 * 获取测试权重
 */
function getTestWeight(testName) {
  if (SEO_TEST_RULES.critical.includes(testName)) return 'critical'
  if (SEO_TEST_RULES.important.includes(testName)) return 'important'
  if (SEO_TEST_RULES.recommended.includes(testName)) return 'recommended'
  return 'optional'
}