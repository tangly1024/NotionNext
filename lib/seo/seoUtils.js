/**
 * SEO分析引擎
 * 提供页面SEO评分、问题检测和优化建议
 */

// ==================== SEO优化工具函数 ====================

/**
 * 优化页面标题
 * @param {string} pageTitle - 页面标题
 * @param {string} siteTitle - 网站标题
 * @returns {string} 优化后的标题
 */
export function optimizePageTitle(pageTitle, siteTitle) {
  if (!pageTitle && !siteTitle) return ''
  if (!pageTitle) return siteTitle
  if (!siteTitle) return pageTitle
  
  const separator = ' | '
  const combined = `${pageTitle}${separator}${siteTitle}`
  
  // 如果组合后的标题过长，截断页面标题部分
  if (combined.length > 60) {
    const maxPageTitleLength = 60 - separator.length - siteTitle.length
    if (maxPageTitleLength > 10) {
      const truncatedPageTitle = pageTitle.substring(0, maxPageTitleLength - 3) + '...'
      return `${truncatedPageTitle}${separator}${siteTitle}`
    } else {
      // 如果网站标题太长，只返回页面标题
      return pageTitle.length <= 60 ? pageTitle : pageTitle.substring(0, 57) + '...'
    }
  }
  
  return combined
}

/**
 * 优化Meta描述
 * @param {string} description - 原始描述
 * @returns {string} 优化后的描述
 */
export function optimizeMetaDescription(description) {
  if (!description) return ''
  
  // 移除多余的空白字符
  const cleaned = description.replace(/\s+/g, ' ').trim()
  
  // 确保长度在120-160字符之间
  if (cleaned.length < 120) {
    return cleaned
  }
  
  if (cleaned.length > 160) {
    // 在句号或其他标点符号处截断
    const truncated = cleaned.substring(0, 157)
    const lastPunctuation = Math.max(
      truncated.lastIndexOf('。'),
      truncated.lastIndexOf('！'),
      truncated.lastIndexOf('？'),
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf('!'),
      truncated.lastIndexOf('?')
    )
    
    if (lastPunctuation > 100) {
      return truncated.substring(0, lastPunctuation + 1)
    } else {
      return truncated + '...'
    }
  }
  
  return cleaned
}

/**
 * 验证Meta描述
 * @param {string} description - 描述文本
 * @returns {Object} 验证结果
 */
export function validateMetaDescription(description) {
  const result = {
    isValid: true,
    length: description ? description.length : 0,
    issues: [],
    suggestions: []
  }
  
  if (!description) {
    result.isValid = false
    result.issues.push('缺少Meta描述')
    result.suggestions.push('添加120-160字符的描述')
    return result
  }
  
  if (description.length < 120) {
    result.issues.push('描述过短')
    result.suggestions.push('扩展描述到至少120字符')
  }
  
  if (description.length > 160) {
    result.issues.push('描述过长')
    result.suggestions.push('缩短描述到160字符以内')
  }
  
  // 检查是否包含关键信息
  if (!/[。！？.!?]/.test(description)) {
    result.suggestions.push('建议使用完整的句子结构')
  }
  
  return result
}

/**
 * 生成Canonical URL
 * @param {string} path - 页面路径
 * @param {string} baseUrl - 基础URL
 * @returns {string} Canonical URL
 */
export function generateCanonicalUrl(path, baseUrl) {
  if (!baseUrl) return path
  
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  
  return `${cleanBaseUrl}${cleanPath}`
}

/**
 * 生成Hreflang数据
 * @param {string} currentPath - 当前页面路径
 * @param {Array} languages - 支持的语言列表
 * @param {string} baseUrl - 基础URL
 * @returns {Array} Hreflang数据
 */
export function generateHreflangData(currentPath, languages, baseUrl) {
  if (!languages || !Array.isArray(languages)) return []
  
  return languages.map(lang => ({
    hreflang: lang.code,
    href: generateCanonicalUrl(`/${lang.code}${currentPath}`, baseUrl)
  }))
}

/**
 * 生成Open Graph图片URL
 * @param {string} imageUrl - 图片URL
 * @param {string} baseUrl - 基础URL
 * @returns {string} 完整的图片URL
 */
export function generateOgImageUrl(imageUrl, baseUrl) {
  if (!imageUrl) {
    // 提供默认图片
    return `${baseUrl}/bg_image.jpg`
  }
  
  // 如果已经是完整URL，直接返回
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  
  // 处理相对路径
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`
  
  return `${cleanBaseUrl}${cleanImageUrl}`
}

/**
 * 从内容中提取优化的关键词
 * @param {string} content - 内容文本
 * @param {Array} tags - 标签数组
 * @param {number} maxKeywords - 最大关键词数量
 * @returns {Array} 优化的关键词列表
 */
export function extractOptimizedKeywords(content, tags = [], maxKeywords = 10) {
  const keywords = []
  
  // 首先添加标签作为关键词
  if (tags && Array.isArray(tags)) {
    keywords.push(...tags)
  }
  
  if (!content) {
    return keywords.slice(0, maxKeywords)
  }
  
  // 从内容中提取关键词
  const contentKeywords = extractKeywords(content)
  
  // 合并并去重
  const allKeywords = [...new Set([...keywords, ...contentKeywords])]
  
  return allKeywords.slice(0, maxKeywords)
}

/**
 * 获取Twitter卡片类型
 * @param {string} imageUrl - 图片URL
 * @returns {string} Twitter卡片类型
 */
export function getTwitterCardType(imageUrl) {
  if (!imageUrl) {
    return 'summary'
  }
  
  // 如果有图片，使用大图卡片
  return 'summary_large_image'
}

/**
 * 批量分析SEO
 * @param {Array} posts - 文章列表
 * @param {Object} siteInfo - 网站信息
 * @returns {Array} 分析结果
 */
export function batchAnalyzeSEO(posts, siteInfo) {
  if (!posts || !Array.isArray(posts)) return []
  
  return posts.map(post => ({
    ...post,
    analysis: analyzeSinglePost(post, siteInfo),
    score: calculateSEOScore(post, siteInfo),
    issues: detectSEOIssues(post, siteInfo).length,
    recommendations: generateSEORecommendations(post, siteInfo)
  }))
}

/**
 * 分析单个文章的SEO
 * @param {Object} post - 文章对象
 * @param {Object} siteInfo - 网站信息
 * @returns {Object} 分析结果
 */
export function analyzeSinglePost(post, siteInfo) {
  const analysis = {
    postInfo: extractPostInfo(post),
    titleAnalysis: analyzeTitleSEO(post.title),
    contentAnalysis: analyzeContentSEO(post.content || ''),
    metaAnalysis: analyzeMetaTags(post),
    structureAnalysis: analyzeContentStructure(post.content || ''),
    keywordAnalysis: analyzeKeywords(post),
    imageAnalysis: analyzeImages(post.content || ''),
    linkAnalysis: analyzeLinks(post.content || ''),
    technicalSEO: analyzeTechnicalSEO(post, siteInfo),
    timestamp: new Date().toISOString()
  }
  
  return analysis
}

/**
 * 计算SEO评分
 * @param {Object} post - 文章对象
 * @param {Object} siteInfo - 网站信息
 * @returns {number} SEO评分 (0-100)
 */
export function calculateSEOScore(post, siteInfo) {
  const weights = {
    title: 0.2,        // 标题优化 20%
    content: 0.25,     // 内容质量 25%
    meta: 0.15,        // Meta标签 15%
    structure: 0.15,   // 内容结构 15%
    keywords: 0.1,     // 关键词优化 10%
    images: 0.05,      // 图片优化 5%
    links: 0.05,       // 链接优化 5%
    technical: 0.05    // 技术SEO 5%
  }
  
  const scores = {
    title: scoreTitleSEO(post.title),
    content: scoreContentSEO(post.content || ''),
    meta: scoreMetaTags(post),
    structure: scoreContentStructure(post.content || ''),
    keywords: scoreKeywords(post),
    images: scoreImages(post.content || ''),
    links: scoreLinks(post.content || ''),
    technical: scoreTechnicalSEO(post, siteInfo)
  }
  
  let totalScore = 0
  Object.keys(weights).forEach(key => {
    totalScore += scores[key] * weights[key]
  })
  
  return Math.round(Math.max(0, Math.min(100, totalScore)))
}

/**
 * 检测SEO问题
 * @param {Object} post - 文章对象
 * @param {Object} siteInfo - 网站信息
 * @returns {Array} 问题列表
 */
export function detectSEOIssues(post, siteInfo) {
  const issues = []
  
  // 标题问题
  const titleIssues = detectTitleIssues(post.title)
  issues.push(...titleIssues)
  
  // 内容问题
  const contentIssues = detectContentIssues(post.content || '')
  issues.push(...contentIssues)
  
  // Meta标签问题
  const metaIssues = detectMetaIssues(post)
  issues.push(...metaIssues)
  
  // 结构问题
  const structureIssues = detectStructureIssues(post.content || '')
  issues.push(...structureIssues)
  
  // 关键词问题
  const keywordIssues = detectKeywordIssues(post)
  issues.push(...keywordIssues)
  
  // 图片问题
  const imageIssues = detectImageIssues(post.content || '')
  issues.push(...imageIssues)
  
  // 链接问题
  const linkIssues = detectLinkIssues(post.content || '')
  issues.push(...linkIssues)
  
  // 技术SEO问题
  const technicalIssues = detectTechnicalIssues(post, siteInfo)
  issues.push(...technicalIssues)
  
  return issues
}

/**
 * 生成SEO优化建议
 * @param {Object} post - 文章对象
 * @param {Object} siteInfo - 网站信息
 * @returns {Array} 建议列表
 */
export function generateSEORecommendations(post, siteInfo) {
  const issues = detectSEOIssues(post, siteInfo)
  const recommendations = []
  
  // 根据问题生成建议
  issues.forEach(issue => {
    const recommendation = generateRecommendationForIssue(issue)
    if (recommendation) {
      recommendations.push(recommendation)
    }
  })
  
  // 添加通用优化建议
  const generalRecommendations = generateGeneralRecommendations(post)
  recommendations.push(...generalRecommendations)
  
  // 去重并按优先级排序
  return deduplicateAndSortRecommendations(recommendations)
}

// ==================== 标题分析 ====================

function analyzeTitleSEO(title) {
  if (!title) return { length: 0, wordCount: 0, hasNumbers: false, hasKeywords: false }
  
  return {
    length: title.length,
    wordCount: title.split(/\s+/).length,
    hasNumbers: /\d/.test(title),
    hasKeywords: detectKeywordsInTitle(title),
    isClickbait: detectClickbait(title),
    sentiment: analyzeSentiment(title),
    readability: calculateTitleReadability(title)
  }
}

function scoreTitleSEO(title) {
  if (!title) return 0
  
  let score = 100
  const length = title.length
  
  // 长度评分
  if (length < 30 || length > 60) score -= 20
  if (length < 10 || length > 80) score -= 30
  
  // 关键词评分
  if (!detectKeywordsInTitle(title)) score -= 15
  
  // 可读性评分
  if (calculateTitleReadability(title) < 0.6) score -= 10
  
  return Math.max(0, score)
}

function detectTitleIssues(title) {
  const issues = []
  
  if (!title) {
    issues.push({
      type: 'error',
      category: 'title',
      message: '缺少标题',
      priority: 'high'
    })
    return issues
  }
  
  if (title.length < 30) {
    issues.push({
      type: 'warning',
      category: 'title',
      message: '标题过短，建议30-60字符',
      priority: 'medium'
    })
  }
  
  if (title.length > 60) {
    issues.push({
      type: 'warning',
      category: 'title',
      message: '标题过长，可能在搜索结果中被截断',
      priority: 'medium'
    })
  }
  
  if (!detectKeywordsInTitle(title)) {
    issues.push({
      type: 'warning',
      category: 'title',
      message: '标题中缺少关键词',
      priority: 'medium'
    })
  }
  
  return issues
}

// ==================== 内容分析 ====================

function analyzeContentSEO(content) {
  const wordCount = getWordCount(content)
  const sentences = getSentences(content)
  const paragraphs = getParagraphs(content)
  
  return {
    wordCount,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    averageSentenceLength: wordCount / sentences.length || 0,
    averageParagraphLength: wordCount / paragraphs.length || 0,
    readabilityScore: calculateReadabilityScore(content),
    keywordDensity: calculateKeywordDensity(content),
    hasHeadings: hasHeadingStructure(content),
    hasList: hasListStructure(content),
    uniqueWords: getUniqueWordCount(content)
  }
}

function scoreContentSEO(content) {
  if (!content) return 0
  
  let score = 100
  const wordCount = getWordCount(content)
  
  // 内容长度评分
  if (wordCount < 300) score -= 30
  if (wordCount < 150) score -= 50
  if (wordCount > 3000) score -= 10
  
  // 可读性评分
  const readability = calculateReadabilityScore(content)
  if (readability < 0.6) score -= 20
  
  // 结构评分
  if (!hasHeadingStructure(content)) score -= 15
  if (!hasListStructure(content)) score -= 5
  
  return Math.max(0, score)
}

function detectContentIssues(content) {
  const issues = []
  const wordCount = getWordCount(content)
  
  if (wordCount < 300) {
    issues.push({
      type: 'warning',
      category: 'content',
      message: '内容过短，建议至少300字',
      priority: 'medium'
    })
  }
  
  if (!hasHeadingStructure(content)) {
    issues.push({
      type: 'warning',
      category: 'content',
      message: '缺少标题结构，建议使用H2、H3等标题',
      priority: 'medium'
    })
  }
  
  const readability = calculateReadabilityScore(content)
  if (readability < 0.5) {
    issues.push({
      type: 'warning',
      category: 'content',
      message: '内容可读性较差，建议简化句子结构',
      priority: 'low'
    })
  }
  
  return issues
}

// ==================== Meta标签分析 ====================

function analyzeMetaTags(post) {
  return {
    hasTitle: !!post.title,
    hasDescription: !!post.summary,
    titleLength: post.title?.length || 0,
    descriptionLength: post.summary?.length || 0,
    hasKeywords: !!post.tags && post.tags.length > 0,
    hasCategory: !!post.category,
    hasAuthor: !!post.author,
    hasPublishDate: !!post.publishDay
  }
}

function scoreMetaTags(post) {
  let score = 100
  
  if (!post.title) score -= 40
  if (!post.summary) score -= 30
  if (!post.tags || post.tags.length === 0) score -= 15
  if (!post.category) score -= 10
  if (!post.publishDay) score -= 5
  
  // 长度检查
  if (post.title && (post.title.length < 30 || post.title.length > 60)) score -= 10
  if (post.summary && (post.summary.length < 120 || post.summary.length > 160)) score -= 15
  
  return Math.max(0, score)
}

function detectMetaIssues(post) {
  const issues = []
  
  if (!post.summary) {
    issues.push({
      type: 'error',
      category: 'meta',
      message: '缺少meta description',
      priority: 'high'
    })
  } else if (post.summary.length < 120 || post.summary.length > 160) {
    issues.push({
      type: 'warning',
      category: 'meta',
      message: 'Meta description长度建议120-160字符',
      priority: 'medium'
    })
  }
  
  if (!post.tags || post.tags.length === 0) {
    issues.push({
      type: 'warning',
      category: 'meta',
      message: '缺少标签，建议添加相关标签',
      priority: 'medium'
    })
  }
  
  return issues
}

// ==================== 内容结构分析 ====================

function analyzeContentStructure(content) {
  const headings = extractHeadings(content)
  
  return {
    headings,
    headingCount: headings.length,
    hasH1: headings.some(h => h.level === 1),
    hasH2: headings.some(h => h.level === 2),
    hasH3: headings.some(h => h.level === 3),
    headingHierarchy: checkHeadingHierarchy(headings),
    hasList: hasListStructure(content),
    hasTable: hasTableStructure(content),
    hasCodeBlock: hasCodeBlockStructure(content)
  }
}

function scoreContentStructure(content) {
  let score = 100
  const headings = extractHeadings(content)
  
  if (headings.length === 0) score -= 30
  if (!headings.some(h => h.level === 1)) score -= 20
  if (!headings.some(h => h.level === 2)) score -= 15
  if (!checkHeadingHierarchy(headings)) score -= 10
  if (!hasListStructure(content)) score -= 10
  
  return Math.max(0, score)
}

function detectStructureIssues(content) {
  const issues = []
  const headings = extractHeadings(content)
  
  if (headings.length === 0) {
    issues.push({
      type: 'warning',
      category: 'structure',
      message: '缺少标题结构，建议添加H1、H2等标题',
      priority: 'medium'
    })
  }
  
  const h1Count = headings.filter(h => h.level === 1).length
  if (h1Count === 0) {
    issues.push({
      type: 'warning',
      category: 'structure',
      message: '缺少H1标题',
      priority: 'medium'
    })
  } else if (h1Count > 1) {
    issues.push({
      type: 'warning',
      category: 'structure',
      message: '存在多个H1标题，建议只使用一个',
      priority: 'low'
    })
  }
  
  if (!checkHeadingHierarchy(headings)) {
    issues.push({
      type: 'warning',
      category: 'structure',
      message: '标题层级不规范，可能存在跳跃',
      priority: 'low'
    })
  }
  
  return issues
}

// ==================== 关键词分析 ====================

function analyzeKeywords(post) {
  const content = `${post.title || ''} ${post.summary || ''} ${post.content || ''}`
  const keywords = extractKeywords(content)
  
  return {
    extractedKeywords: keywords.slice(0, 10),
    keywordCount: keywords.length,
    tags: post.tags || [],
    category: post.category,
    keywordDensity: calculateKeywordDensity(content),
    hasTargetKeyword: hasTargetKeywordInContent(post)
  }
}

function scoreKeywords(post) {
  let score = 100
  
  if (!post.tags || post.tags.length === 0) score -= 30
  if (!post.category) score -= 20
  
  const content = `${post.title || ''} ${post.summary || ''} ${post.content || ''}`
  const density = calculateKeywordDensity(content)
  
  if (density < 0.5 || density > 3) score -= 15
  
  return Math.max(0, score)
}

function detectKeywordIssues(post) {
  const issues = []
  
  if (!post.tags || post.tags.length === 0) {
    issues.push({
      type: 'warning',
      category: 'keywords',
      message: '缺少标签，建议添加相关关键词标签',
      priority: 'medium'
    })
  }
  
  const content = `${post.title || ''} ${post.summary || ''} ${post.content || ''}`
  const density = calculateKeywordDensity(content)
  
  if (density < 0.5) {
    issues.push({
      type: 'warning',
      category: 'keywords',
      message: '关键词密度过低，建议适当增加关键词使用',
      priority: 'low'
    })
  } else if (density > 3) {
    issues.push({
      type: 'warning',
      category: 'keywords',
      message: '关键词密度过高，可能被视为关键词堆砌',
      priority: 'medium'
    })
  }
  
  return issues
}

// ==================== 图片分析 ====================

function analyzeImages(content) {
  const images = extractImages(content)
  
  return {
    imageCount: images.length,
    imagesWithAlt: images.filter(img => img.alt).length,
    imagesWithoutAlt: images.filter(img => !img.alt).length,
    imageFormats: getImageFormats(images),
    hasOptimizedImages: checkImageOptimization(images)
  }
}

function scoreImages(content) {
  const images = extractImages(content)
  if (images.length === 0) return 100
  
  let score = 100
  const imagesWithAlt = images.filter(img => img.alt).length
  const altRatio = imagesWithAlt / images.length
  
  if (altRatio < 0.8) score -= 20
  if (altRatio < 0.5) score -= 30
  
  return Math.max(0, score)
}

function detectImageIssues(content) {
  const issues = []
  const images = extractImages(content)
  const imagesWithoutAlt = images.filter(img => !img.alt)
  
  if (imagesWithoutAlt.length > 0) {
    issues.push({
      type: 'warning',
      category: 'images',
      message: `${imagesWithoutAlt.length}张图片缺少alt属性`,
      priority: 'medium'
    })
  }
  
  return issues
}

// ==================== 链接分析 ====================

function analyzeLinks(content) {
  const links = extractLinks(content)
  const internalLinks = links.filter(link => isInternalLink(link.href))
  const externalLinks = links.filter(link => !isInternalLink(link.href))
  
  return {
    totalLinks: links.length,
    internalLinks: internalLinks.length,
    externalLinks: externalLinks.length,
    linksWithTitle: links.filter(link => link.title).length,
    noFollowLinks: links.filter(link => link.rel && link.rel.includes('nofollow')).length
  }
}

function scoreLinks(content) {
  const links = extractLinks(content)
  const internalLinks = links.filter(link => isInternalLink(link.href))
  
  let score = 100
  
  if (internalLinks.length === 0) score -= 20
  if (links.length === 0) score -= 10
  
  return Math.max(0, score)
}

function detectLinkIssues(content) {
  const issues = []
  const links = extractLinks(content)
  const internalLinks = links.filter(link => isInternalLink(link.href))
  
  if (internalLinks.length === 0) {
    issues.push({
      type: 'warning',
      category: 'links',
      message: '缺少内部链接，建议添加相关文章链接',
      priority: 'low'
    })
  }
  
  return issues
}

// ==================== 技术SEO分析 ====================

function analyzeTechnicalSEO(post, siteInfo) {
  return {
    hasSlug: !!post.slug,
    slugOptimized: isSlugOptimized(post.slug),
    hasPublishDate: !!post.publishDay,
    hasAuthor: !!post.author,
    hasCategory: !!post.category,
    urlStructure: analyzeUrlStructure(post.slug, siteInfo),
    hasCanonicalUrl: true, // 假设有canonical URL
    hasOpenGraph: analyzeOpenGraph(post),
    hasTwitterCard: analyzeTwitterCard(post)
  }
}

function scoreTechnicalSEO(post, siteInfo) {
  let score = 100
  
  if (!post.slug) score -= 20
  if (!isSlugOptimized(post.slug)) score -= 15
  if (!post.publishDay) score -= 10
  if (!post.author) score -= 5
  if (!post.category) score -= 10
  
  return Math.max(0, score)
}

function detectTechnicalIssues(post, siteInfo) {
  const issues = []
  
  if (!post.slug) {
    issues.push({
      type: 'error',
      category: 'technical',
      message: '缺少URL slug',
      priority: 'high'
    })
  } else if (!isSlugOptimized(post.slug)) {
    issues.push({
      type: 'warning',
      category: 'technical',
      message: 'URL slug不够优化，建议使用关键词',
      priority: 'medium'
    })
  }
  
  if (!post.publishDay) {
    issues.push({
      type: 'warning',
      category: 'technical',
      message: '缺少发布日期',
      priority: 'medium'
    })
  }
  
  return issues
}

// ==================== 辅助函数 ====================

function extractPostInfo(post) {
  return {
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    category: post.category,
    tags: post.tags || [],
    author: post.author,
    publishDate: post.publishDay,
    wordCount: getWordCount(post.content || ''),
    readingTime: calculateReadingTime(post.content || '')
  }
}

function getWordCount(text) {
  if (!text) return 0
  return text.match(/[\u4e00-\u9fa5]|\b\w+\b/g)?.length || 0
}

function getSentences(text) {
  if (!text) return []
  return text.split(/[。！？.!?]+/).filter(s => s.trim().length > 0)
}

function getParagraphs(text) {
  if (!text) return []
  return text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
}

function calculateReadabilityScore(text) {
  if (!text) return 0
  
  const sentences = getSentences(text)
  const words = getWordCount(text)
  const avgSentenceLength = words / sentences.length || 0
  
  // 简化的可读性评分
  let score = 1
  if (avgSentenceLength > 20) score -= (avgSentenceLength - 20) * 0.02
  if (avgSentenceLength > 30) score -= (avgSentenceLength - 30) * 0.03
  
  return Math.max(0, Math.min(1, score))
}

function calculateKeywordDensity(text) {
  if (!text) return 0
  
  const words = getWordCount(text)
  const keywords = extractKeywords(text)
  
  if (words === 0 || keywords.length === 0) return 0
  
  // 计算前3个关键词的平均密度
  const topKeywords = keywords.slice(0, 3)
  let totalDensity = 0
  
  topKeywords.forEach(keyword => {
    const keywordCount = (text.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length
    totalDensity += (keywordCount / words) * 100
  })
  
  return totalDensity / topKeywords.length
}

function extractKeywords(text) {
  if (!text) return []
  
  const stopWords = new Set([
    '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这',
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'
  ])
  
  const words = text.toLowerCase().match(/[\u4e00-\u9fa5]+|\b[a-z]+\b/g) || []
  const wordCount = {}
  
  words.forEach(word => {
    if (word.length >= 2 && !stopWords.has(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1
    }
  })
  
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([word]) => word)
}

function extractHeadings(content) {
  if (!content) return []
  
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings = []
  let match
  
  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim()
    })
  }
  
  return headings
}

function checkHeadingHierarchy(headings) {
  for (let i = 1; i < headings.length; i++) {
    const prevLevel = headings[i - 1].level
    const currentLevel = headings[i].level
    
    if (currentLevel > prevLevel + 1) {
      return false
    }
  }
  return true
}

function hasHeadingStructure(content) {
  return extractHeadings(content).length > 0
}

function hasListStructure(content) {
  return /^[\s]*[-*+]\s+/m.test(content) || /^[\s]*\d+\.\s+/m.test(content)
}

function hasTableStructure(content) {
  return /\|.*\|/.test(content)
}

function hasCodeBlockStructure(content) {
  return /```/.test(content) || /`[^`]+`/.test(content)
}

function extractImages(content) {
  if (!content) return []
  
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
  const images = []
  let match
  
  while ((match = imageRegex.exec(content)) !== null) {
    images.push({
      alt: match[1],
      src: match[2]
    })
  }
  
  return images
}

function extractLinks(content) {
  if (!content) return []
  
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const links = []
  let match
  
  while ((match = linkRegex.exec(content)) !== null) {
    links.push({
      text: match[1],
      href: match[2]
    })
  }
  
  return links
}

function isInternalLink(href) {
  return href && !href.startsWith('http') && !href.startsWith('//')
}

function isSlugOptimized(slug) {
  if (!slug) return false
  
  // 检查slug是否包含关键词、使用连字符等
  return /^[a-z0-9-]+$/.test(slug) && slug.length >= 3 && slug.length <= 60
}

function detectKeywordsInTitle(title) {
  // 简化的关键词检测
  return title && title.length > 10
}

function detectClickbait(title) {
  const clickbaitWords = ['震惊', '不敢相信', '必看', '绝对', '史上最', '你不知道的']
  return clickbaitWords.some(word => title.includes(word))
}

function analyzeSentiment(title) {
  // 简化的情感分析
  const positiveWords = ['好', '棒', '优秀', '完美', 'amazing', 'great', 'excellent']
  const negativeWords = ['坏', '差', '糟糕', 'bad', 'terrible', 'awful']
  
  const positive = positiveWords.some(word => title.toLowerCase().includes(word))
  const negative = negativeWords.some(word => title.toLowerCase().includes(word))
  
  if (positive && !negative) return 'positive'
  if (negative && !positive) return 'negative'
  return 'neutral'
}

function calculateTitleReadability(title) {
  // 简化的标题可读性评分
  const words = title.split(/\s+/).length
  const chars = title.length
  
  if (words <= 10 && chars <= 60) return 1
  if (words <= 15 && chars <= 80) return 0.8
  return 0.6
}

function getUniqueWordCount(text) {
  const words = getWordCount(text)
  const uniqueWords = new Set(text.toLowerCase().match(/[\u4e00-\u9fa5]|\b\w+\b/g) || [])
  return uniqueWords.size
}

function calculateReadingTime(content) {
  const wordsPerMinute = 200 // 中文阅读速度
  const wordCount = getWordCount(content)
  return Math.ceil(wordCount / wordsPerMinute)
}

function getImageFormats(images) {
  const formats = {}
  images.forEach(img => {
    const ext = img.src.split('.').pop()?.toLowerCase()
    if (ext) {
      formats[ext] = (formats[ext] || 0) + 1
    }
  })
  return formats
}

function checkImageOptimization(images) {
  const modernFormats = ['webp', 'avif']
  return images.some(img => {
    const ext = img.src.split('.').pop()?.toLowerCase()
    return modernFormats.includes(ext)
  })
}

function analyzeUrlStructure(slug, siteInfo) {
  return {
    hasSlug: !!slug,
    slugLength: slug?.length || 0,
    hasKeywords: slug ? /[a-z]/.test(slug) : false,
    hasNumbers: slug ? /\d/.test(slug) : false,
    hasSpecialChars: slug ? /[^a-z0-9-]/.test(slug) : false
  }
}

function analyzeOpenGraph(post) {
  return {
    hasTitle: !!post.title,
    hasDescription: !!post.summary,
    hasImage: !!post.pageCover,
    hasType: true // 假设有type
  }
}

function analyzeTwitterCard(post) {
  return {
    hasCard: true, // 假设有Twitter Card
    hasTitle: !!post.title,
    hasDescription: !!post.summary,
    hasImage: !!post.pageCover
  }
}

function hasTargetKeywordInContent(post) {
  // 简化的目标关键词检测
  return post.tags && post.tags.length > 0
}

function generateRecommendationForIssue(issue) {
  const recommendations = {
    'title': {
      '缺少标题': {
        message: '添加吸引人的标题，包含主要关键词',
        priority: 'high',
        category: 'content'
      },
      '标题过短': {
        message: '扩展标题长度到30-60字符，增加描述性词汇',
        priority: 'medium',
        category: 'optimization'
      },
      '标题过长': {
        message: '缩短标题长度，保持在60字符以内',
        priority: 'medium',
        category: 'optimization'
      }
    },
    'content': {
      '内容过短': {
        message: '增加内容深度，建议至少300字以上',
        priority: 'high',
        category: 'content'
      },
      '缺少标题结构': {
        message: '添加H2、H3等子标题，改善内容结构',
        priority: 'medium',
        category: 'structure'
      }
    },
    'meta': {
      '缺少meta description': {
        message: '添加120-160字符的meta描述',
        priority: 'high',
        category: 'meta'
      }
    }
  }
  
  const categoryRecs = recommendations[issue.category]
  if (categoryRecs && categoryRecs[issue.message]) {
    return categoryRecs[issue.message]
  }
  
  return null
}

function generateGeneralRecommendations(post) {
  const recommendations = []
  
  // 通用建议
  recommendations.push({
    message: '定期更新内容，保持新鲜度',
    priority: 'low',
    category: 'maintenance'
  })
  
  recommendations.push({
    message: '添加相关内部链接，提升页面权重',
    priority: 'medium',
    category: 'linking'
  })
  
  if (post.tags && post.tags.length < 3) {
    recommendations.push({
      message: '增加更多相关标签，提升内容发现性',
      priority: 'low',
      category: 'keywords'
    })
  }
  
  return recommendations
}

function deduplicateAndSortRecommendations(recommendations) {
  const seen = new Set()
  const unique = recommendations.filter(rec => {
    if (seen.has(rec.message)) return false
    seen.add(rec.message)
    return true
  })
  
  const priorityOrder = { high: 3, medium: 2, low: 1 }
  return unique.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
}

// ==================== 报告生成 ====================

/**
 * 生成SEO报告
 * @param {Array} analysisResults - 分析结果
 * @returns {Object} SEO报告
 */
export function generateSEOReport(analysisResults) {
  const report = {
    summary: generateSummary(analysisResults),
    topPerformers: getTopPerformers(analysisResults),
    needsImprovement: getNeedsImprovement(analysisResults),
    commonIssues: getCommonIssues(analysisResults),
    recommendations: getGlobalRecommendations(analysisResults),
    generatedAt: new Date().toISOString()
  }
  
  return report
}

function generateSummary(results) {
  const totalPosts = results.length
  const analyzedPosts = results.filter(r => r.analysis).length
  const totalScore = results.reduce((sum, r) => sum + (r.score || 0), 0)
  const averageScore = totalPosts > 0 ? Math.round(totalScore / totalPosts) : 0
  const totalIssues = results.reduce((sum, r) => sum + (r.issues || 0), 0)
  
  const scoreDistribution = {
    excellent: results.filter(r => r.score >= 90).length,
    good: results.filter(r => r.score >= 80 && r.score < 90).length,
    fair: results.filter(r => r.score >= 70 && r.score < 80).length,
    poor: results.filter(r => r.score >= 60 && r.score < 70).length,
    veryPoor: results.filter(r => r.score < 60).length
  }
  
  return {
    totalPosts,
    analyzedPosts,
    averageScore,
    totalIssues,
    scoreDistribution
  }
}

function getTopPerformers(results) {
  return results
    .filter(r => r.score >= 80)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
}

function getNeedsImprovement(results) {
  return results
    .filter(r => r.score < 70)
    .sort((a, b) => a.score - b.score)
    .slice(0, 10)
}

function getCommonIssues(results) {
  const issueCount = {}
  
  results.forEach(result => {
    if (result.analysis) {
      // 这里需要从分析结果中提取问题
      // 简化实现
      if (result.score < 70) {
        const category = result.score < 50 ? 'critical' : 'warning'
        const key = `${category}_low_score`
        issueCount[key] = (issueCount[key] || 0) + 1
      }
    }
  })
  
  return Object.entries(issueCount)
    .map(([issue, count]) => ({
      category: issue.split('_')[0],
      message: issue.split('_').slice(1).join(' '),
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

function getGlobalRecommendations(results) {
  const recommendations = []
  
  const lowScoreCount = results.filter(r => r.score < 70).length
  if (lowScoreCount > results.length * 0.3) {
    recommendations.push({
      message: '超过30%的文章SEO评分较低，建议系统性优化',
      priority: 'high'
    })
  }
  
  const noTagsCount = results.filter(r => !r.tags || r.tags.length === 0).length
  if (noTagsCount > 0) {
    recommendations.push({
      message: `${noTagsCount}篇文章缺少标签，建议添加相关标签`,
      priority: 'medium'
    })
  }
  
  return recommendations
}

/**
 * 导出SEO报告
 * @param {Object} report - SEO报告
 * @param {string} format - 导出格式 ('json' | 'csv' | 'html')
 * @returns {string} 导出内容
 */
export function exportSEOReport(report, format = 'json') {
  switch (format.toLowerCase()) {
    case 'json':
      return JSON.stringify(report, null, 2)
    
    case 'csv':
      return generateCSVReport(report)
    
    case 'html':
      return generateHTMLReport(report)
    
    default:
      throw new Error(`Unsupported export format: ${format}`)
  }
}

function generateCSVReport(report) {
  const csvRows = []
  
  // 标题行
  csvRows.push(['指标', '数值', '说明'])
  
  // 摘要数据
  csvRows.push(['总文章数', report.summary.totalPosts, ''])
  csvRows.push(['平均评分', report.summary.averageScore, ''])
  csvRows.push(['总问题数', report.summary.totalIssues, ''])
  
  // 评分分布
  Object.entries(report.summary.scoreDistribution).forEach(([level, count]) => {
    csvRows.push([`${level}文章数`, count, ''])
  })
  
  return csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
}

function generateHTMLReport(report) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>SEO分析报告</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; }
        .metric { margin: 10px 0; }
        .score { font-weight: bold; color: #2196F3; }
      </style>
    </head>
    <body>
      <h1>SEO分析报告</h1>
      <div class="summary">
        <h2>摘要</h2>
        <div class="metric">总文章数: <span class="score">${report.summary.totalPosts}</span></div>
        <div class="metric">平均评分: <span class="score">${report.summary.averageScore}/100</span></div>
        <div class="metric">总问题数: <span class="score">${report.summary.totalIssues}</span></div>
      </div>
      <p>报告生成时间: ${new Date(report.generatedAt).toLocaleString()}</p>
    </body>
    </html>
  `
}