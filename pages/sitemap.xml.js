/**
 * Dynamic Sitemap Generator for NotionNext
 * 
 * This file generates XML sitemaps dynamically based on published content from Notion.
 * It includes comprehensive error handling, performance monitoring, and caching mechanisms.
 * 
 * Features:
 * - Dynamic content filtering (only published posts/pages)
 * - Multi-language support with locale prefixes
 * - Enhanced error handling with fallback strategies
 * - Performance monitoring and timeout protection
 * - Intelligent caching with configurable TTL
 * - XML validation and proper escaping
 * - Search engine optimization compliance
 * 
 * Configuration:
 * - Set BLOG.SEO_SITEMAP_ENHANCED=true to enable enhanced sitemap generation
 * - Configure BLOG.NOTION_PAGE_ID for multi-site support
 * - Adjust performance limits in SitemapPerformanceMonitor config
 * 
 * @author NotionNext Team
 * @version 2.0.0
 * @since 2024-01-28
 */

import BLOG from '@/blog.config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { extractLangId, extractLangPrefix } from '@/lib/utils/pageId'
import { URLValidator } from '@/lib/utils/URLValidator'
import { SitemapErrorHandler } from '@/lib/utils/SitemapErrorHandler'
import { XMLFormatter } from '@/lib/utils/XMLFormatter'
import { SitemapPerformanceMonitor } from '@/lib/utils/SitemapPerformanceMonitor'
import { SitemapEnhancedGenerator } from '@/lib/utils/SitemapEnhancedGenerator'

export const getServerSideProps = async ctx => {
  const baseUrl = 'https://www.shareking.vip'
  
  // 初始化性能监控器
  const performanceMonitor = new SitemapPerformanceMonitor({
    maxGenerationTime: 10000, // 10秒超时
    maxMemoryUsage: 512 * 1024 * 1024, // 512MB内存限制
    enableCache: true,
    cacheMaxAge: 3600 * 1000, // 1小时缓存
    enableMonitoring: true,
    enableTimeoutProtection: true
  })
  
  // 初始化其他组件
  const errorHandler = new SitemapErrorHandler({ baseUrl })
  const urlValidator = new URLValidator({ baseUrl })
  const xmlFormatter = new XMLFormatter({ 
    baseUrl,
    maxUrls: 50000,
    enableValidation: true,
    prettyPrint: false
  })
  
  // 生成缓存键
  const cacheKey = `sitemap_${BLOG.NOTION_PAGE_ID.replace(/,/g, '_')}`
  
  // 使用性能监控器执行sitemap生成
  const result = await performanceMonitor.executeWithMonitoring(
    async () => {
      return await generateSitemapWithComponents(
        baseUrl, 
        BLOG.NOTION_PAGE_ID.split(','),
        errorHandler,
        urlValidator,
        xmlFormatter
      )
    },
    cacheKey,
    { timeout: 10000 }
  )

  try {
    // 设置响应头并返回结果
    xmlFormatter.setOptimalResponseHeaders(ctx.res, { 
      isFallback: result.stats?.source === 'fallback',
      fromCache: result.fromCache 
    })
    
    ctx.res.write(result.xml)
    ctx.res.end()

    // 记录性能统计
    const perfStats = performanceMonitor.getPerformanceStats()
    console.log(`[Sitemap] Performance stats:`, {
      generationTime: result.generationTime,
      fromCache: result.fromCache,
      cacheHitRate: perfStats.cacheHitRate,
      memoryUsage: `${(perfStats.currentMemoryUsage / 1024 / 1024).toFixed(2)}MB`
    })

    // 检查系统健康状态
    const healthStatus = performanceMonitor.getHealthStatus()
    if (!healthStatus.healthy) {
      console.warn('[Sitemap] Performance health warning:', healthStatus.issues)
    }

    return { props: {} }

  } catch (criticalError) {
    console.error('[Sitemap] Critical error in sitemap generation:', criticalError)

    // 使用最高级别的降级策略
    const emergencyXml = errorHandler.generateFallbackSitemap('level3')
    xmlFormatter.setOptimalResponseHeaders(ctx.res, { isFallback: true })
    ctx.res.write(emergencyXml)
    ctx.res.end()

    return { props: {} }
  }
}



function generateSitemapUrls(baseUrl, allPages, locale, urlValidator) {
  // 处理locale前缀
  let localePrefix = ''
  if (locale && locale.length > 0 && locale !== 'zh-CN') {
    localePrefix = locale.indexOf('/') === 0 ? locale : '/' + locale
  }

  const currentDate = new Date().toISOString().split('T')[0]
  
  // 基础页面
  const urls = [
    {
      loc: `${baseUrl}${localePrefix}`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      loc: `${baseUrl}${localePrefix}/archive`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}${localePrefix}/category`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}${localePrefix}/search`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.6'
    },
    {
      loc: `${baseUrl}${localePrefix}/tag`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8'
    }
  ]

  // 添加RSS链接
  if (allPages && allPages.length > 0) {
    urls.push({
      loc: `${baseUrl}${localePrefix}/rss/feed.xml`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.7'
    })
  }

  // 添加文章页面
  if (allPages) {
    allPages
      .filter(p => {
        return p.status === 'Published' &&
               p.slug &&
               p.publishDay &&
               urlValidator.isValidSlug(p.slug)
      })
      .forEach(post => {
        const generatedUrl = urlValidator.generateURL(post.slug, locale)
        
        if (generatedUrl) {
          urls.push({
            loc: generatedUrl,
            lastmod: new Date(post.publishDay).toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: '0.8'
          })
        }
      })
  }

  return urls
}

async function generateSitemapWithComponents(baseUrl, siteIds, errorHandler, urlValidator, xmlFormatter) {
  // 收集所有站点数据
  const allSiteData = []
  const siteResults = []
  const siteErrors = []

  // 处理每个站点，使用增强的错误处理
  for (let index = 0; index < siteIds.length; index++) {
    const siteId = siteIds[index]
    const id = extractLangId(siteId)
    const locale = extractLangPrefix(siteId)

    try {
      // 使用重试机制获取站点数据
      const siteData = await errorHandler.retry(async () => {
        return await getGlobalData({
          pageId: id,
          from: 'sitemap.xml'
        })
      })

      // 缓存成功获取的数据
      errorHandler.setCachedData(siteId, siteData)
      
      // 收集站点数据用于增强版生成
      allSiteData.push({
        ...siteData,
        locale,
        siteId
      })
      
      siteResults.push({ siteId, pageCount: siteData.allPages?.length || 0 })

    } catch (fetchError) {
      const fetchResult = errorHandler.handleDataFetchError(fetchError, siteId, { locale })
      
      if (fetchResult.success && fetchResult.data) {
        allSiteData.push({
          ...fetchResult.data,
          locale,
          siteId
        })
        siteResults.push({ siteId, pageCount: fetchResult.data.allPages?.length || 0, source: fetchResult.source })
      } else {
        siteErrors.push({ siteId, error: fetchError.message })
      }
    }
  }

  // 记录处理结果统计
  if (siteResults.length > 0) {
    console.log(`[Sitemap] Successfully processed ${siteResults.length}/${siteIds.length} sites`)
  }
  if (siteErrors.length > 0) {
    console.warn(`[Sitemap] Failed to process ${siteErrors.length} sites:`, siteErrors)
  }

  // 如果没有获取到任何数据，使用降级策略
  if (allSiteData.length === 0) {
    const fallbackXml = errorHandler.generateFallbackSitemap('level2')
    return {
      success: true,
      xml: fallbackXml,
      stats: { source: 'fallback', urlsProcessed: 0 }
    }
  }

  // 合并所有站点的页面数据
  const allPages = []
  allSiteData.forEach(siteData => {
    if (siteData.allPages) {
      // 为多语言页面添加locale信息
      const pagesWithLocale = siteData.allPages.map(page => ({
        ...page,
        locale: siteData.locale
      }))
      allPages.push(...pagesWithLocale)
    }
  })

  // 检查是否启用增强版sitemap
  if (BLOG.SEO_SITEMAP_ENHANCED) {
    try {
      // 使用增强版生成器
      const enhancedGenerator = new SitemapEnhancedGenerator({ baseUrl })
      const enhancedResult = await enhancedGenerator.generateEnhancedSitemaps({
        allPages,
        siteInfo: allSiteData[0]?.siteInfo
      })

      if (enhancedResult.success) {
        // 返回主sitemap（向后兼容）
        const mainSitemap = enhancedResult.sitemaps.find(s => s.filename === 'sitemap.xml')
        
        console.log(`[Sitemap] Enhanced generation completed:`, {
          sitemapFiles: enhancedResult.stats.sitemapFiles,
          totalUrls: enhancedResult.stats.totalUrls,
          generationTime: enhancedResult.stats.generationTime
        })

        return {
          success: true,
          xml: mainSitemap.content,
          stats: {
            urlsProcessed: mainSitemap.urls,
            source: 'enhanced',
            enhancedStats: enhancedResult.stats
          }
        }
      }
    } catch (enhancedError) {
      console.warn('[Sitemap] Enhanced generation failed, falling back to standard generation:', enhancedError.message)
    }
  }

  // 标准生成流程（降级或未启用增强版时）
  let allUrls = []
  
  allSiteData.forEach(siteData => {
    try {
      const localeUrls = generateSitemapUrls(baseUrl, siteData.allPages, siteData.locale, urlValidator)
      allUrls = allUrls.concat(localeUrls)
    } catch (processingError) {
      const processingResult = errorHandler.handleProcessingError(
        processingError, 
        siteData, 
        { siteId: siteData.siteId, locale: siteData.locale }
      )
      
      if (processingResult.success) {
        const localeUrls = generateSitemapUrls(baseUrl, processingResult.data.allPages, siteData.locale, urlValidator)
        allUrls = allUrls.concat(localeUrls)
      }
    }
  })

  // 使用URLValidator进行去重和验证
  const validationResult = urlValidator.validateURLList(allUrls)
  const uniqueUrls = urlValidator.deduplicateURLs(validationResult.valid)

  // 记录验证统计信息
  if (validationResult.invalid.length > 0) {
    console.warn(`[Sitemap] Filtered ${validationResult.invalid.length} invalid URLs`)
  }

  // 使用XMLFormatter生成XML，包含错误处理
  let xmlResult
  try {
    xmlResult = xmlFormatter.generateSitemapXML(uniqueUrls)
    
    if (!xmlResult.success) {
      throw new Error(xmlResult.error)
    }
    
    // 记录XML生成统计
    const stats = xmlResult.stats
    console.log(`[Sitemap] Generated XML: ${stats.urlsProcessed} URLs, ${stats.xmlSize} bytes, ${stats.generationTime}ms`)
    
    if (xmlResult.warnings && xmlResult.warnings.length > 0) {
      console.warn(`[Sitemap] XML generation warnings:`, xmlResult.warnings)
    }
    
    return xmlResult
    
  } catch (xmlError) {
    console.error('[Sitemap] XML generation failed:', xmlError.message)
    const fallbackResult = errorHandler.handleXMLGenerationError(xmlError, uniqueUrls)
    
    return {
      success: true,
      xml: fallbackResult.xml,
      stats: { source: fallbackResult.source, urlsProcessed: uniqueUrls.length }
    }
  }
}

export default () => { }
