/**
 * 性能优化工具集
 * 提供关键CSS内联、资源压缩、缓存策略等性能优化功能
 */

import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'

/**
 * 关键CSS提取和内联工具
 */
export class CriticalCSSOptimizer {
  constructor(options = {}) {
    this.options = {
      inlineThreshold: 14 * 1024, // 14KB 内联阈值
      criticalViewport: { width: 1200, height: 800 },
      enableInlining: true,
      ...options
    }
    
    this.criticalCSS = new Map()
    this.nonCriticalCSS = new Map()
  }

  /**
   * 提取关键CSS
   */
  async extractCriticalCSS(html, cssFiles) {
    const criticalRules = new Set()
    const nonCriticalRules = new Set()

    try {
      // 解析HTML中使用的选择器
      const usedSelectors = this.extractUsedSelectors(html)
      
      // 分析CSS文件
      for (const cssFile of cssFiles) {
        const cssContent = await this.loadCSSFile(cssFile)
        const rules = this.parseCSSRules(cssContent)
        
        rules.forEach(rule => {
          if (this.isCriticalRule(rule, usedSelectors)) {
            criticalRules.add(rule)
          } else {
            nonCriticalRules.add(rule)
          }
        })
      }

      return {
        critical: Array.from(criticalRules).join('\n'),
        nonCritical: Array.from(nonCriticalRules).join('\n')
      }
    } catch (error) {
      console.error('Critical CSS extraction failed:', error)
      return { critical: '', nonCritical: '' }
    }
  }

  /**
   * 提取HTML中使用的选择器
   */
  extractUsedSelectors(html) {
    const selectors = new Set()
    
    // 提取class名
    const classMatches = html.matchAll(/class=["']([^"']+)["']/g)
    for (const match of classMatches) {
      const classes = match[1].split(/\s+/)
      classes.forEach(cls => selectors.add(`.${cls}`))
    }
    
    // 提取id
    const idMatches = html.matchAll(/id=["']([^"']+)["']/g)
    for (const match of idMatches) {
      selectors.add(`#${match[1]}`)
    }
    
    // 提取标签名
    const tagMatches = html.matchAll(/<(\w+)[^>]*>/g)
    for (const match of tagMatches) {
      selectors.add(match[1].toLowerCase())
    }
    
    return selectors
  }

  /**
   * 解析CSS规则
   */
  parseCSSRules(cssContent) {
    const rules = []
    
    // 简化的CSS解析，实际项目中建议使用专业的CSS解析器
    const ruleMatches = cssContent.matchAll(/([^{}]+)\{([^{}]+)\}/g)
    
    for (const match of ruleMatches) {
      const selector = match[1].trim()
      const declarations = match[2].trim()
      
      if (selector && declarations) {
        rules.push(`${selector} { ${declarations} }`)
      }
    }
    
    return rules
  }

  /**
   * 判断是否为关键CSS规则
   */
  isCriticalRule(rule, usedSelectors) {
    // 提取规则中的选择器
    const selectorMatch = rule.match(/^([^{]+)/);
    if (!selectorMatch) return false;
    
    const selector = selectorMatch[1].trim();
    
    // 检查是否为关键选择器
    const criticalPatterns = [
      /^body/, /^html/, /^\.container/, /^\.header/, /^\.nav/,
      /^h[1-6]/, /^p/, /^a/, /^img/, /^\.btn/
    ]
    
    // 检查是否匹配关键模式
    if (criticalPatterns.some(pattern => pattern.test(selector))) {
      return true
    }
    
    // 检查是否在使用的选择器中
    return Array.from(usedSelectors).some(used => 
      selector.includes(used) || used.includes(selector)
    )
  }

  /**
   * 加载CSS文件
   */
  async loadCSSFile(cssFile) {
    try {
      if (cssFile.startsWith('http')) {
        const response = await fetch(cssFile)
        return await response.text()
      } else {
        // 本地文件处理
        const fs = require('fs').promises
        return await fs.readFile(cssFile, 'utf8')
      }
    } catch (error) {
      console.error(`Failed to load CSS file: ${cssFile}`, error)
      return ''
    }
  }

  /**
   * 生成内联CSS
   */
  generateInlineCSS(criticalCSS) {
    if (!this.options.enableInlining || !criticalCSS) {
      return ''
    }

    const minifiedCSS = this.minifyCSS(criticalCSS)
    
    if (minifiedCSS.length > this.options.inlineThreshold) {
      console.warn('Critical CSS exceeds inline threshold, consider optimization')
    }

    return `<style>${minifiedCSS}</style>`
  }

  /**
   * 压缩CSS
   */
  minifyCSS(css) {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
      .replace(/\s+/g, ' ') // 压缩空白
      .replace(/;\s*}/g, '}') // 移除最后的分号
      .replace(/\s*{\s*/g, '{') // 压缩大括号
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*;\s*/g, ';') // 压缩分号
      .replace(/\s*:\s*/g, ':') // 压缩冒号
      .trim()
  }
}

/**
 * 资源压缩和缓存策略
 */
export class ResourceOptimizer {
  constructor(options = {}) {
    this.options = {
      enableGzip: true,
      enableBrotli: true,
      cacheMaxAge: 31536000, // 1年
      staticCacheMaxAge: 86400, // 1天
      enableServiceWorker: true,
      ...options
    }
  }

  /**
   * 获取压缩中间件配置
   */
  getCompressionConfig() {
    return {
      gzip: {
        enabled: this.options.enableGzip,
        level: 6,
        threshold: 1024,
        filter: (req, res) => {
          if (req.headers['x-no-compression']) {
            return false
          }
          return /json|text|javascript|css|xml|svg/.test(res.getHeader('content-type'))
        }
      },
      brotli: {
        enabled: this.options.enableBrotli,
        quality: 6,
        threshold: 1024
      }
    }
  }

  /**
   * 获取缓存头配置
   */
  getCacheHeaders(filePath, fileType) {
    const headers = {}
    
    // 根据文件类型设置缓存策略
    switch (fileType) {
      case 'static':
        // 静态资源长期缓存
        headers['Cache-Control'] = `public, max-age=${this.options.cacheMaxAge}, immutable`
        headers['Expires'] = new Date(Date.now() + this.options.cacheMaxAge * 1000).toUTCString()
        break
        
      case 'dynamic':
        // 动态内容短期缓存
        headers['Cache-Control'] = `public, max-age=${this.options.staticCacheMaxAge}, must-revalidate`
        break
        
      case 'api':
        // API响应缓存
        headers['Cache-Control'] = 'public, max-age=300, s-maxage=600'
        break
        
      default:
        headers['Cache-Control'] = 'public, max-age=3600'
    }
    
    // 添加ETag支持
    if (filePath) {
      headers['ETag'] = this.generateETag(filePath)
    }
    
    return headers
  }

  /**
   * 生成ETag
   */
  generateETag(filePath) {
    // 使用简单的哈希算法替代crypto模块
    const str = filePath + Date.now()
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 转换为32位整数
    }
    return Math.abs(hash).toString(16)
  }

  /**
   * 优化图片资源
   */
  async optimizeImage(imagePath, options = {}) {
    const {
      quality = 80,
      format = 'webp',
      sizes = [320, 640, 1024, 1920],
      enableLazyLoading = true
    } = options

    try {
      const optimizedImages = []
      
      // 生成不同尺寸的图片
      for (const size of sizes) {
        const optimizedPath = await this.resizeImage(imagePath, size, quality, format)
        optimizedImages.push({
          src: optimizedPath,
          width: size,
          format
        })
      }

      return {
        original: imagePath,
        optimized: optimizedImages,
        lazyLoading: enableLazyLoading
      }
    } catch (error) {
      console.error('Image optimization failed:', error)
      return { original: imagePath, optimized: [], lazyLoading: false }
    }
  }

  /**
   * 调整图片大小（模拟实现）
   */
  async resizeImage(imagePath, width, quality, format) {
    // 实际项目中需要使用图片处理库如 sharp
    const path = require('path')
    const ext = format === 'webp' ? '.webp' : path.extname(imagePath)
    const basename = path.basename(imagePath, path.extname(imagePath))
    const dirname = path.dirname(imagePath)
    
    return `${dirname}/${basename}_${width}w${ext}`
  }
}

/**
 * 第三方脚本优化器
 */
export class ThirdPartyScriptOptimizer {
  constructor(options = {}) {
    this.options = {
      enableLazyLoading: true,
      loadingStrategy: 'intersection', // intersection, idle, delay
      delayTime: 3000,
      ...options
    }
    
    this.scriptQueue = []
    this.loadedScripts = new Set()
  }

  /**
   * 优化脚本加载
   */
  optimizeScript(scriptConfig) {
    const {
      src,
      async = true,
      defer = true,
      loading = 'lazy',
      priority = 'normal',
      condition = null
    } = scriptConfig

    return {
      src,
      async,
      defer,
      loading,
      priority,
      condition,
      optimized: true,
      loadStrategy: this.getLoadStrategy(priority, loading)
    }
  }

  /**
   * 获取加载策略
   */
  getLoadStrategy(priority, loading) {
    if (priority === 'high') {
      return 'immediate'
    }
    
    if (loading === 'lazy') {
      return this.options.loadingStrategy
    }
    
    return 'normal'
  }

  /**
   * 生成优化后的脚本标签
   */
  generateScriptTag(scriptConfig) {
    const optimized = this.optimizeScript(scriptConfig)
    
    let attributes = []
    
    if (optimized.async) attributes.push('async')
    if (optimized.defer) attributes.push('defer')
    if (optimized.loading === 'lazy') attributes.push('loading="lazy"')
    
    const attributeString = attributes.join(' ')
    
    if (optimized.loadStrategy === 'intersection') {
      return this.generateIntersectionScript(optimized)
    }
    
    if (optimized.loadStrategy === 'idle') {
      return this.generateIdleScript(optimized)
    }
    
    if (optimized.loadStrategy === 'delay') {
      return this.generateDelayedScript(optimized)
    }
    
    return `<script src="${optimized.src}" ${attributeString}></script>`
  }

  /**
   * 生成交集观察器加载脚本
   */
  generateIntersectionScript(scriptConfig) {
    return `
      <script>
        (function() {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const script = document.createElement('script');
                script.src = '${scriptConfig.src}';
                script.async = ${scriptConfig.async};
                script.defer = ${scriptConfig.defer};
                document.head.appendChild(script);
                observer.disconnect();
              }
            });
          });
          
          const trigger = document.querySelector('[data-script-trigger="${scriptConfig.src}"]') || document.body;
          observer.observe(trigger);
        })();
      </script>
    `
  }

  /**
   * 生成空闲时加载脚本
   */
  generateIdleScript(scriptConfig) {
    return `
      <script>
        (function() {
          function loadScript() {
            const script = document.createElement('script');
            script.src = '${scriptConfig.src}';
            script.async = ${scriptConfig.async};
            script.defer = ${scriptConfig.defer};
            document.head.appendChild(script);
          }
          
          if ('requestIdleCallback' in window) {
            requestIdleCallback(loadScript);
          } else {
            setTimeout(loadScript, 1000);
          }
        })();
      </script>
    `
  }

  /**
   * 生成延迟加载脚本
   */
  generateDelayedScript(scriptConfig) {
    return `
      <script>
        setTimeout(function() {
          const script = document.createElement('script');
          script.src = '${scriptConfig.src}';
          script.async = ${scriptConfig.async};
          script.defer = ${scriptConfig.defer};
          document.head.appendChild(script);
        }, ${this.options.delayTime});
      </script>
    `
  }
}

/**
 * 代码分割和懒加载优化器
 */
export class CodeSplittingOptimizer {
  constructor(options = {}) {
    this.options = {
      chunkSizeLimit: 244 * 1024, // 244KB
      enablePrefetch: true,
      enablePreload: true,
      ...options
    }
    
    this.chunks = new Map()
    this.dependencies = new Map()
  }

  /**
   * 分析代码分割机会
   */
  analyzeCodeSplitting(bundleInfo) {
    const recommendations = []
    
    // 分析大型依赖
    if (bundleInfo.size > this.options.chunkSizeLimit) {
      recommendations.push({
        type: 'split_large_bundle',
        message: 'Bundle size exceeds recommended limit',
        suggestion: 'Consider splitting into smaller chunks'
      })
    }
    
    // 分析第三方库
    const thirdPartyLibs = bundleInfo.modules?.filter(m => 
      m.name.includes('node_modules')
    ) || []
    
    if (thirdPartyLibs.length > 0) {
      recommendations.push({
        type: 'vendor_chunk',
        message: 'Third-party libraries detected',
        suggestion: 'Create separate vendor chunk'
      })
    }
    
    return recommendations
  }

  /**
   * 生成预加载提示
   */
  generatePreloadHints(criticalResources) {
    const hints = []
    
    criticalResources.forEach(resource => {
      if (resource.critical) {
        hints.push(`<link rel="preload" href="${resource.url}" as="${resource.type}">`)
      } else if (resource.important) {
        hints.push(`<link rel="prefetch" href="${resource.url}">`)
      }
    })
    
    return hints.join('\n')
  }

  /**
   * 优化动态导入
   */
  optimizeDynamicImports(importMap) {
    const optimized = {}
    
    Object.entries(importMap).forEach(([key, value]) => {
      optimized[key] = {
        ...value,
        webpackChunkName: this.generateChunkName(key),
        webpackPrefetch: value.prefetch || false,
        webpackPreload: value.preload || false
      }
    })
    
    return optimized
  }

  /**
   * 生成chunk名称
   */
  generateChunkName(moduleName) {
    return moduleName
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase()
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
}

/**
 * 性能监控和优化建议
 */
export class PerformanceAnalyzer {
  constructor() {
    this.metrics = new Map()
    this.recommendations = []
  }

  /**
   * 分析性能指标
   */
  analyzePerformance(metrics) {
    const analysis = {
      score: 0,
      issues: [],
      recommendations: []
    }
    
    // 分析FCP (First Contentful Paint)
    if (metrics.fcp > 3000) {
      analysis.issues.push('FCP过慢')
      analysis.recommendations.push('优化关键渲染路径')
    }
    
    // 分析LCP (Largest Contentful Paint)
    if (metrics.lcp > 4000) {
      analysis.issues.push('LCP过慢')
      analysis.recommendations.push('优化最大内容元素加载')
    }
    
    // 分析FID (First Input Delay)
    if (metrics.fid > 300) {
      analysis.issues.push('FID过高')
      analysis.recommendations.push('减少主线程阻塞')
    }
    
    // 分析CLS (Cumulative Layout Shift)
    if (metrics.cls > 0.25) {
      analysis.issues.push('CLS过高')
      analysis.recommendations.push('避免布局偏移')
    }
    
    // 计算总体得分
    analysis.score = this.calculatePerformanceScore(metrics)
    
    return analysis
  }

  /**
   * 计算性能得分
   */
  calculatePerformanceScore(metrics) {
    let score = 100
    
    // FCP权重25%
    if (metrics.fcp > 1800) score -= 25
    else if (metrics.fcp > 1000) score -= 10
    
    // LCP权重25%
    if (metrics.lcp > 4000) score -= 25
    else if (metrics.lcp > 2500) score -= 10
    
    // FID权重25%
    if (metrics.fid > 300) score -= 25
    else if (metrics.fid > 100) score -= 10
    
    // CLS权重25%
    if (metrics.cls > 0.25) score -= 25
    else if (metrics.cls > 0.1) score -= 10
    
    return Math.max(0, score)
  }

  /**
   * 生成优化建议
   */
  generateOptimizationSuggestions(analysis) {
    const suggestions = []
    
    analysis.issues.forEach(issue => {
      switch (issue) {
        case 'FCP过慢':
          suggestions.push({
            priority: 'high',
            category: 'rendering',
            title: '优化首次内容绘制',
            description: '减少阻塞渲染的资源，内联关键CSS',
            impact: 'high'
          })
          break
          
        case 'LCP过慢':
          suggestions.push({
            priority: 'high',
            category: 'loading',
            title: '优化最大内容元素',
            description: '优化图片加载，使用CDN，启用预加载',
            impact: 'high'
          })
          break
          
        case 'FID过高':
          suggestions.push({
            priority: 'medium',
            category: 'interactivity',
            title: '减少输入延迟',
            description: '优化JavaScript执行，使用Web Workers',
            impact: 'medium'
          })
          break
          
        case 'CLS过高':
          suggestions.push({
            priority: 'medium',
            category: 'stability',
            title: '减少布局偏移',
            description: '为图片和广告设置尺寸，避免动态内容插入',
            impact: 'medium'
          })
          break
      }
    })
    
    return suggestions
  }
}

// 导出工具类实例
export const criticalCSSOptimizer = new CriticalCSSOptimizer()
export const resourceOptimizer = new ResourceOptimizer()
export const thirdPartyScriptOptimizer = new ThirdPartyScriptOptimizer()
export const codeSplittingOptimizer = new CodeSplittingOptimizer()
export const performanceAnalyzer = new PerformanceAnalyzer()