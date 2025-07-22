/**
 * 相关文章推荐算法
 * 基于标签、分类、内容相似度等因素推荐相关文章
 */

/**
 * 获取相关文章
 * @param {Object} currentPost - 当前文章
 * @param {Array} allPosts - 所有文章列表
 * @param {Object} options - 配置选项
 * @returns {Array} 相关文章列表
 */
export function getRelatedPosts(currentPost, allPosts, options = {}) {
  const {
    maxResults = 6,
    minScore = 0.1,
    weights = {
      tags: 0.4,
      category: 0.3,
      content: 0.2,
      publishTime: 0.1
    },
    excludeCurrentPost = true,
    includeUnpublished = false
  } = options

  if (!currentPost || !allPosts || allPosts.length === 0) {
    return []
  }

  // 过滤文章
  let candidatePosts = allPosts.filter(post => {
    // 排除当前文章
    if (excludeCurrentPost && post.id === currentPost.id) {
      return false
    }
    
    // 排除未发布文章
    if (!includeUnpublished && post.status !== 'Published') {
      return false
    }
    
    return true
  })

  // 计算相关性评分
  const scoredPosts = candidatePosts.map(post => ({
    ...post,
    relevanceScore: calculateRelevanceScore(currentPost, post, weights)
  }))

  // 过滤低分文章并排序
  return scoredPosts
    .filter(post => post.relevanceScore >= minScore)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxResults)
}

/**
 * 计算文章相关性评分
 * @param {Object} currentPost - 当前文章
 * @param {Object} candidatePost - 候选文章
 * @param {Object} weights - 权重配置
 * @returns {number} 相关性评分 (0-1)
 */
function calculateRelevanceScore(currentPost, candidatePost, weights) {
  let totalScore = 0

  // 标签相似度
  const tagScore = calculateTagSimilarity(currentPost.tags || [], candidatePost.tags || [])
  totalScore += tagScore * weights.tags

  // 分类相似度
  const categoryScore = calculateCategorySimilarity(currentPost.category, candidatePost.category)
  totalScore += categoryScore * weights.category

  // 内容相似度
  const contentScore = calculateContentSimilarity(
    currentPost.title + ' ' + (currentPost.summary || ''),
    candidatePost.title + ' ' + (candidatePost.summary || '')
  )
  totalScore += contentScore * weights.content

  // 发布时间相似度
  const timeScore = calculateTimeSimilarity(currentPost.publishDay, candidatePost.publishDay)
  totalScore += timeScore * weights.publishTime

  return Math.min(1, Math.max(0, totalScore))
}

/**
 * 计算标签相似度
 * @param {Array} tags1 - 文章1的标签
 * @param {Array} tags2 - 文章2的标签
 * @returns {number} 相似度评分 (0-1)
 */
function calculateTagSimilarity(tags1, tags2) {
  if (!tags1.length || !tags2.length) return 0

  const set1 = new Set(tags1.map(tag => tag.toLowerCase()))
  const set2 = new Set(tags2.map(tag => tag.toLowerCase()))
  
  const intersection = new Set([...set1].filter(tag => set2.has(tag)))
  const union = new Set([...set1, ...set2])
  
  // Jaccard相似度
  return intersection.size / union.size
}

/**
 * 计算分类相似度
 * @param {string} category1 - 文章1的分类
 * @param {string} category2 - 文章2的分类
 * @returns {number} 相似度评分 (0-1)
 */
function calculateCategorySimilarity(category1, category2) {
  if (!category1 || !category2) return 0
  return category1.toLowerCase() === category2.toLowerCase() ? 1 : 0
}

/**
 * 计算内容相似度（基于关键词）
 * @param {string} content1 - 文章1的内容
 * @param {string} content2 - 文章2的内容
 * @returns {number} 相似度评分 (0-1)
 */
function calculateContentSimilarity(content1, content2) {
  if (!content1 || !content2) return 0

  const keywords1 = extractKeywords(content1)
  const keywords2 = extractKeywords(content2)
  
  if (keywords1.length === 0 || keywords2.length === 0) return 0

  const set1 = new Set(keywords1)
  const set2 = new Set(keywords2)
  
  const intersection = new Set([...set1].filter(keyword => set2.has(keyword)))
  const union = new Set([...set1, ...set2])
  
  return intersection.size / union.size
}

/**
 * 计算发布时间相似度
 * @param {string} date1 - 文章1的发布日期
 * @param {string} date2 - 文章2的发布日期
 * @returns {number} 相似度评分 (0-1)
 */
function calculateTimeSimilarity(date1, date2) {
  if (!date1 || !date2) return 0

  const time1 = new Date(date1).getTime()
  const time2 = new Date(date2).getTime()
  
  const daysDiff = Math.abs(time1 - time2) / (1000 * 60 * 60 * 24)
  
  // 时间差越小，相似度越高
  // 30天内的文章有较高相似度，超过365天的文章相似度接近0
  if (daysDiff <= 30) return 1 - (daysDiff / 30) * 0.5
  if (daysDiff <= 365) return 0.5 - ((daysDiff - 30) / 335) * 0.5
  return 0
}

/**
 * 提取关键词
 * @param {string} text - 文本内容
 * @returns {Array} 关键词列表
 */
function extractKeywords(text) {
  if (!text) return []

  // 停用词列表
  const stopWords = new Set([
    '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这',
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had'
  ])

  // 提取中英文词汇
  const words = text.toLowerCase()
    .match(/[\u4e00-\u9fa5]+|\b[a-z]+\b/g) || []

  // 过滤停用词和短词
  return words
    .filter(word => word.length >= 2 && !stopWords.has(word))
    .slice(0, 20) // 限制关键词数量
}

/**
 * 按分类获取相关文章
 * @param {string} category - 分类名称
 * @param {Array} allPosts - 所有文章
 * @param {Object} options - 配置选项
 * @returns {Array} 相关文章列表
 */
export function getRelatedPostsByCategory(category, allPosts, options = {}) {
  const { maxResults = 6, excludeIds = [] } = options

  return allPosts
    .filter(post => 
      post.category === category && 
      post.status === 'Published' &&
      !excludeIds.includes(post.id)
    )
    .sort((a, b) => new Date(b.publishDay) - new Date(a.publishDay))
    .slice(0, maxResults)
}

/**
 * 按标签获取相关文章
 * @param {Array} tags - 标签列表
 * @param {Array} allPosts - 所有文章
 * @param {Object} options - 配置选项
 * @returns {Array} 相关文章列表
 */
export function getRelatedPostsByTags(tags, allPosts, options = {}) {
  const { maxResults = 6, excludeIds = [] } = options

  if (!tags || tags.length === 0) return []

  const tagSet = new Set(tags.map(tag => tag.toLowerCase()))

  return allPosts
    .filter(post => {
      if (post.status !== 'Published' || excludeIds.includes(post.id)) {
        return false
      }
      
      const postTags = (post.tags || []).map(tag => tag.toLowerCase())
      return postTags.some(tag => tagSet.has(tag))
    })
    .map(post => {
      const postTags = (post.tags || []).map(tag => tag.toLowerCase())
      const commonTags = postTags.filter(tag => tagSet.has(tag))
      return {
        ...post,
        commonTagsCount: commonTags.length
      }
    })
    .sort((a, b) => {
      // 先按共同标签数排序，再按发布时间排序
      if (a.commonTagsCount !== b.commonTagsCount) {
        return b.commonTagsCount - a.commonTagsCount
      }
      return new Date(b.publishDay) - new Date(a.publishDay)
    })
    .slice(0, maxResults)
}

/**
 * 获取热门相关文章
 * @param {Object} currentPost - 当前文章
 * @param {Array} allPosts - 所有文章
 * @param {Object} analytics - 分析数据（浏览量、点赞等）
 * @param {Object} options - 配置选项
 * @returns {Array} 热门相关文章列表
 */
export function getPopularRelatedPosts(currentPost, allPosts, analytics = {}, options = {}) {
  const { maxResults = 6 } = options

  // 先获取基础相关文章
  const relatedPosts = getRelatedPosts(currentPost, allPosts, {
    ...options,
    maxResults: maxResults * 2 // 获取更多候选文章
  })

  // 根据热度数据排序
  return relatedPosts
    .map(post => ({
      ...post,
      popularity: calculatePopularity(post, analytics)
    }))
    .sort((a, b) => {
      // 综合相关性和热度
      const scoreA = a.relevanceScore * 0.7 + a.popularity * 0.3
      const scoreB = b.relevanceScore * 0.7 + b.popularity * 0.3
      return scoreB - scoreA
    })
    .slice(0, maxResults)
}

/**
 * 计算文章热度
 * @param {Object} post - 文章对象
 * @param {Object} analytics - 分析数据
 * @returns {number} 热度评分 (0-1)
 */
function calculatePopularity(post, analytics) {
  const postAnalytics = analytics[post.id] || {}
  
  const views = postAnalytics.views || 0
  const likes = postAnalytics.likes || 0
  const comments = postAnalytics.comments || 0
  const shares = postAnalytics.shares || 0
  
  // 简单的热度计算公式
  const popularity = (views * 0.4 + likes * 0.3 + comments * 0.2 + shares * 0.1) / 100
  
  return Math.min(1, popularity)
}

/**
 * 生成相关文章的结构化数据
 * @param {Array} relatedPosts - 相关文章列表
 * @param {string} baseUrl - 网站基础URL
 * @returns {Object} 结构化数据
 */
export function generateRelatedPostsStructuredData(relatedPosts, baseUrl) {
  if (!relatedPosts || relatedPosts.length === 0) return null

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "相关文章",
    "description": "基于内容相似度推荐的相关文章",
    "numberOfItems": relatedPosts.length,
    "itemListElement": relatedPosts.map((post, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Article",
        "headline": post.title,
        "description": post.summary,
        "url": `${baseUrl}/${post.slug}`,
        "datePublished": post.publishDay,
        "author": {
          "@type": "Person",
          "name": post.author || "NotionNext"
        },
        "publisher": {
          "@type": "Organization",
          "name": "NotionNext Blog"
        }
      }
    }))
  }
}

/**
 * 相关文章缓存管理
 */
export class RelatedPostsCache {
  constructor(ttl = 3600000) { // 默认1小时缓存
    this.cache = new Map()
    this.ttl = ttl
  }

  get(postId) {
    const cached = this.cache.get(postId)
    if (!cached) return null

    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(postId)
      return null
    }

    return cached.data
  }

  set(postId, relatedPosts) {
    this.cache.set(postId, {
      data: relatedPosts,
      timestamp: Date.now()
    })
  }

  clear() {
    this.cache.clear()
  }

  size() {
    return this.cache.size
  }
}

/**
 * 相关文章推荐配置
 */
export const RELATED_POSTS_CONFIG = {
  // 默认配置
  default: {
    maxResults: 6,
    minScore: 0.1,
    weights: {
      tags: 0.4,
      category: 0.3,
      content: 0.2,
      publishTime: 0.1
    }
  },
  
  // 技术文章配置
  tech: {
    maxResults: 8,
    minScore: 0.15,
    weights: {
      tags: 0.5,
      category: 0.3,
      content: 0.15,
      publishTime: 0.05
    }
  },
  
  // 生活文章配置
  lifestyle: {
    maxResults: 4,
    minScore: 0.08,
    weights: {
      tags: 0.3,
      category: 0.4,
      content: 0.2,
      publishTime: 0.1
    }
  }
}

/**
 * 获取推荐配置
 * @param {string} category - 文章分类
 * @returns {Object} 推荐配置
 */
export function getRecommendationConfig(category) {
  const categoryKey = category?.toLowerCase()
  
  if (categoryKey && RELATED_POSTS_CONFIG[categoryKey]) {
    return RELATED_POSTS_CONFIG[categoryKey]
  }
  
  return RELATED_POSTS_CONFIG.default
}