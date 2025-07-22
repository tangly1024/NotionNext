/**
 * 自动提交调度器
 * 监控内容变化，自动提交新内容到搜索引擎
 */

import searchEngineSubmission from './searchEngineSubmission'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'

class AutoSubmissionScheduler {
  constructor() {
    this.isRunning = false
    this.intervalId = null
    this.lastCheck = null
    this.submissionQueue = new Set()
    this.config = {
      checkInterval: 60 * 60 * 1000, // 1小时检查一次
      batchSize: 10,
      maxRetries: 3,
      retryDelay: 5 * 60 * 1000, // 5分钟重试延迟
      enableAutoSubmission: true
    }
  }

  /**
   * 启动自动提交调度器
   */
  start() {
    if (this.isRunning) {
      console.log('Auto submission scheduler is already running')
      return
    }

    this.isRunning = true
    this.lastCheck = Date.now()
    
    console.log('Starting auto submission scheduler...')
    
    // 立即执行一次检查
    this.checkAndSubmit()
    
    // 设置定时检查
    this.intervalId = setInterval(() => {
      this.checkAndSubmit()
    }, this.config.checkInterval)
  }

  /**
   * 停止自动提交调度器
   */
  stop() {
    if (!this.isRunning) {
      return
    }

    this.isRunning = false
    
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    
    console.log('Auto submission scheduler stopped')
  }

  /**
   * 检查并提交新内容
   */
  async checkAndSubmit() {
    if (!this.config.enableAutoSubmission) {
      return
    }

    try {
      console.log('Checking for new content to submit...')
      
      // 获取需要提交的URL
      const urlsToSubmit = await this.getUrlsToSubmit()
      
      if (urlsToSubmit.length === 0) {
        console.log('No new content to submit')
        return
      }

      console.log(`Found ${urlsToSubmit.length} URLs to submit`)
      
      // 添加到提交队列
      urlsToSubmit.forEach(url => this.submissionQueue.add(url))
      
      // 处理提交队列
      await this.processSubmissionQueue()
      
    } catch (error) {
      console.error('Error in auto submission check:', error)
    }
  }

  /**
   * 获取需要提交的URL
   */
  async getUrlsToSubmit() {
    const urls = []
    const siteUrl = siteConfig('LINK', BLOG.LINK)
    
    try {
      // 检查sitemap是否需要重新提交
      const sitemapLastModified = await this.getSitemapLastModified()
      if (this.shouldSubmitSitemap(sitemapLastModified)) {
        urls.push(`${siteUrl}/sitemap.xml`)
      }

      // 检查新发布的文章
      const newPosts = await this.getNewPosts()
      newPosts.forEach(post => {
        if (post.slug) {
          urls.push(`${siteUrl}/${post.slug}`)
        }
      })

      // 检查更新的页面
      const updatedPages = await this.getUpdatedPages()
      updatedPages.forEach(page => {
        if (page.slug) {
          urls.push(`${siteUrl}/${page.slug}`)
        }
      })

    } catch (error) {
      console.error('Error getting URLs to submit:', error)
    }

    return [...new Set(urls)] // 去重
  }

  /**
   * 获取sitemap最后修改时间
   */
  async getSitemapLastModified() {
    try {
      const siteUrl = siteConfig('LINK', BLOG.LINK)
      const response = await fetch(`${siteUrl}/sitemap.xml`, { method: 'HEAD' })
      const lastModified = response.headers.get('last-modified')
      return lastModified ? new Date(lastModified).getTime() : Date.now()
    } catch (error) {
      console.error('Error getting sitemap last modified:', error)
      return Date.now()
    }
  }

  /**
   * 检查是否需要提交sitemap
   */
  shouldSubmitSitemap(lastModified) {
    if (!this.lastCheck) return true
    return lastModified > this.lastCheck
  }

  /**
   * 获取新发布的文章
   */
  async getNewPosts() {
    try {
      // 这里需要根据实际的数据获取方式来实现
      // 可能需要从数据库、文件系统或API获取
      
      // 示例实现：检查最近24小时内的新文章
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
      
      // 这里应该调用实际的数据获取函数
      // const posts = await getAllPosts()
      // return posts.filter(post => 
      //   post.publishedAt && 
      //   new Date(post.publishedAt).getTime() > oneDayAgo
      // )
      
      return [] // 临时返回空数组
    } catch (error) {
      console.error('Error getting new posts:', error)
      return []
    }
  }

  /**
   * 获取更新的页面
   */
  async getUpdatedPages() {
    try {
      // 类似于getNewPosts，这里需要实现获取更新页面的逻辑
      return []
    } catch (error) {
      console.error('Error getting updated pages:', error)
      return []
    }
  }

  /**
   * 处理提交队列
   */
  async processSubmissionQueue() {
    const urls = Array.from(this.submissionQueue)
    this.submissionQueue.clear()

    if (urls.length === 0) return

    console.log(`Processing ${urls.length} URLs in submission queue`)

    // 分批处理
    for (let i = 0; i < urls.length; i += this.config.batchSize) {
      const batch = urls.slice(i, i + this.config.batchSize)
      await this.submitBatch(batch)
      
      // 批次间添加延迟
      if (i + this.config.batchSize < urls.length) {
        await this.delay(2000)
      }
    }
  }

  /**
   * 提交一批URL
   */
  async submitBatch(urls) {
    const results = []

    for (const url of urls) {
      try {
        // 提交到Google
        if (searchEngineSubmission.searchEngines.google.enabled) {
          const result = await searchEngineSubmission.submitUrlForIndexing(url, 'google')
          results.push({ url, engine: 'google', success: true, result })
        }

        // 提交到Bing
        if (searchEngineSubmission.searchEngines.bing.enabled) {
          const result = await searchEngineSubmission.submitUrlForIndexing(url, 'bing')
          results.push({ url, engine: 'bing', success: true, result })
        }

        // 提交到百度
        if (searchEngineSubmission.searchEngines.baidu.enabled) {
          const result = await searchEngineSubmission.submitUrlForIndexing(url, 'baidu')
          results.push({ url, engine: 'baidu', success: true, result })
        }

        // 添加延迟避免速率限制
        await this.delay(1000)

      } catch (error) {
        console.error(`Failed to submit ${url}:`, error)
        results.push({ url, success: false, error: error.message })
      }
    }

    console.log(`Batch submission completed: ${results.length} results`)
    return results
  }

  /**
   * 手动添加URL到提交队列
   */
  addUrlToQueue(url) {
    this.submissionQueue.add(url)
    console.log(`Added URL to submission queue: ${url}`)
  }

  /**
   * 手动添加多个URL到提交队列
   */
  addUrlsToQueue(urls) {
    urls.forEach(url => this.submissionQueue.add(url))
    console.log(`Added ${urls.length} URLs to submission queue`)
  }

  /**
   * 立即处理队列中的URL
   */
  async processQueueNow() {
    if (this.submissionQueue.size === 0) {
      console.log('Submission queue is empty')
      return
    }

    console.log(`Processing ${this.submissionQueue.size} URLs immediately`)
    await this.processSubmissionQueue()
  }

  /**
   * 获取队列状态
   */
  getQueueStatus() {
    return {
      isRunning: this.isRunning,
      queueSize: this.submissionQueue.size,
      lastCheck: this.lastCheck,
      nextCheck: this.lastCheck ? this.lastCheck + this.config.checkInterval : null,
      config: this.config
    }
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig }
    
    // 如果更改了检查间隔，重启调度器
    if (newConfig.checkInterval && this.isRunning) {
      this.stop()
      this.start()
    }
  }

  /**
   * 延迟函数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 获取提交统计
   */
  getSubmissionStats() {
    const history = searchEngineSubmission.getSubmissionHistory()
    const today = new Date().toDateString()
    
    const stats = {
      total: history.length,
      today: history.filter(record => 
        new Date(record.timestamp).toDateString() === today
      ).length,
      successful: history.filter(record => record.success).length,
      failed: history.filter(record => !record.success).length,
      byEngine: {}
    }

    // 按搜索引擎统计
    for (const engineId of Object.keys(searchEngineSubmission.searchEngines)) {
      const engineHistory = history.filter(record => record.engineId === engineId)
      stats.byEngine[engineId] = {
        total: engineHistory.length,
        successful: engineHistory.filter(record => record.success).length,
        failed: engineHistory.filter(record => !record.success).length
      }
    }

    return stats
  }
}

// 单例实例
const autoSubmissionScheduler = new AutoSubmissionScheduler()

// 在服务器环境中自动启动
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  // 延迟启动，避免在构建时启动
  setTimeout(() => {
    if (siteConfig('SEO_AUTO_SUBMISSION', true)) {
      autoSubmissionScheduler.start()
    }
  }, 5000)
}

export default autoSubmissionScheduler
export { AutoSubmissionScheduler }