/**
 * SEO工具函数测试
 */

import {
  optimizeMetaDescription,
  optimizePageTitle,
  generateCanonicalUrl,
  generateHreflangData,
  extractOptimizedKeywords,
  generateOgImageUrl,
  getTwitterCardType,
  validateMetaDescription
} from '../seoUtils'

describe('SEO Utils Tests', () => {
  describe('optimizeMetaDescription', () => {
    test('应该正确截断过长的描述', () => {
      const longDescription = '这是一个非常长的描述'.repeat(20)
      const result = optimizeMetaDescription(longDescription, 160)
      expect(result.length).toBeLessThanOrEqual(163) // 包含省略号
      expect(result.endsWith('...')).toBe(true)
    })
    
    test('应该保持短描述不变', () => {
      const shortDescription = '这是一个短描述'
      const result = optimizeMetaDescription(shortDescription)
      expect(result).toBe(shortDescription)
    })
    
    test('应该移除HTML标签', () => {
      const htmlDescription = '<p>这是一个<strong>包含HTML</strong>的描述</p>'
      const result = optimizeMetaDescription(htmlDescription)
      expect(result).toBe('这是一个包含HTML的描述')
    })
    
    test('应该处理空描述', () => {
      expect(optimizeMetaDescription('')).toBe('')
      expect(optimizeMetaDescription(null)).toBe('')
      expect(optimizeMetaDescription(undefined)).toBe('')
    })
  })
  
  describe('optimizePageTitle', () => {
    test('应该正确组合页面标题和网站标题', () => {
      const result = optimizePageTitle('文章标题', '网站名称')
      expect(result).toBe('文章标题 | 网站名称')
    })
    
    test('应该处理过长的标题', () => {
      const longTitle = '这是一个非常长的文章标题'.repeat(5)
      const result = optimizePageTitle(longTitle, '网站名称')
      expect(result.length).toBeLessThanOrEqual(60)
    })
    
    test('应该处理缺失的参数', () => {
      expect(optimizePageTitle('', '网站名称')).toBe('网站名称')
      expect(optimizePageTitle('文章标题', '')).toBe('文章标题')
      expect(optimizePageTitle('', '')).toBe('')
    })
  })
  
  describe('generateCanonicalUrl', () => {
    test('应该正确生成canonical URL', () => {
      const result = generateCanonicalUrl('https://example.com', '/article/test')
      expect(result).toBe('https://example.com/article/test')
    })
    
    test('应该处理末尾斜杠', () => {
      const result = generateCanonicalUrl('https://example.com/', 'article/test')
      expect(result).toBe('https://example.com/article/test')
    })
    
    test('应该处理空路径', () => {
      const result = generateCanonicalUrl('https://example.com', '')
      expect(result).toBe('https://example.com')
    })
  })
  
  describe('generateHreflangData', () => {
    test('应该生成正确的hreflang数据', () => {
      const locales = ['zh-CN', 'en-US']
      const result = generateHreflangData('https://example.com', '/article', locales, 'zh-CN')
      
      expect(result).toHaveLength(3) // 2个语言 + x-default
      expect(result[0]).toEqual({
        hreflang: 'zh-CN',
        href: 'https://example.com/article'
      })
      expect(result[1]).toEqual({
        hreflang: 'en-US',
        href: 'https://example.com/en-US/article'
      })
      expect(result[2]).toEqual({
        hreflang: 'x-default',
        href: 'https://example.com/article'
      })
    })
    
    test('应该处理单语言情况', () => {
      const result = generateHreflangData('https://example.com', '/article', ['zh-CN'], 'zh-CN')
      expect(result).toEqual([])
    })
  })
  
  describe('extractOptimizedKeywords', () => {
    test('应该从内容中提取关键词', () => {
      const content = 'JavaScript 是一种编程语言。React 是一个 JavaScript 库。'
      const tags = ['前端', '开发']
      const result = extractOptimizedKeywords(content, tags, 5)
      
      expect(result).toContain('前端')
      expect(result).toContain('开发')
      expect(result.length).toBeLessThanOrEqual(5)
    })
    
    test('应该处理空内容', () => {
      const result = extractOptimizedKeywords('', ['标签1', '标签2'])
      expect(result).toEqual(['标签1', '标签2'])
    })
  })
  
  describe('generateOgImageUrl', () => {
    test('应该处理完整URL', () => {
      const result = generateOgImageUrl('https://example.com/image.jpg', 'https://site.com')
      expect(result).toBe('https://example.com/image.jpg')
    })
    
    test('应该处理相对路径', () => {
      const result = generateOgImageUrl('/images/cover.jpg', 'https://site.com')
      expect(result).toBe('https://site.com/images/cover.jpg')
    })
    
    test('应该提供默认图片', () => {
      const result = generateOgImageUrl('', 'https://site.com')
      expect(result).toBe('https://site.com/bg_image.jpg')
    })
  })
  
  describe('getTwitterCardType', () => {
    test('应该根据图片返回正确的卡片类型', () => {
      expect(getTwitterCardType('https://example.com/image.jpg')).toBe('summary_large_image')
      expect(getTwitterCardType('')).toBe('summary')
      expect(getTwitterCardType(null)).toBe('summary')
    })
  })
  
  describe('validateMetaDescription', () => {
    test('应该验证正确的描述', () => {
      const goodDescription = '这是一个长度适中的meta描述，包含了足够的信息来吸引用户点击，同时也不会太长导致被搜索引擎截断。'
      const result = validateMetaDescription(goodDescription)
      
      expect(result.isValid).toBe(true)
      expect(result.issues).toHaveLength(0)
      expect(result.score).toBe(100)
    })
    
    test('应该检测过短的描述', () => {
      const shortDescription = '太短了'
      const result = validateMetaDescription(shortDescription)
      
      expect(result.isValid).toBe(false)
      expect(result.issues).toContain('meta描述过短，建议120-160字符')
      expect(result.score).toBeLessThan(100)
    })
    
    test('应该检测过长的描述', () => {
      const longDescription = '这是一个非常长的描述'.repeat(20)
      const result = validateMetaDescription(longDescription)
      
      expect(result.isValid).toBe(false)
      expect(result.issues).toContain('meta描述过长，可能被搜索引擎截断')
      expect(result.score).toBeLessThan(100)
    })
    
    test('应该检测缺失的描述', () => {
      const result = validateMetaDescription('')
      
      expect(result.isValid).toBe(false)
      expect(result.issues).toContain('缺少meta描述')
      expect(result.score).toBe(0)
    })
  })
})

// 如果在Node.js环境中运行测试，需要模拟浏览器环境
if (typeof window === 'undefined') {
  global.window = {
    screen: { width: 1920 }
  }
}