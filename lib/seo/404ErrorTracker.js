/**
 * 404错误跟踪客户端脚本
 * 自动检测和记录404错误，提供用户友好的错误处理
 */

class NotFoundErrorTracker {
  constructor(options = {}) {
    this.options = {
      apiEndpoint: '/api/seo/404-report',
      enableAnalytics: true,
      enableConsoleLog: false,
      retryAttempts: 3,
      retryDelay: 1000,
      ...options
    }
    
    this.init()
  }

  /**
   * 初始化错误跟踪器
   */
  init() {
    // 检查是否为404页面
    if (this.is404Page()) {
      this.trackError()
    }
    
    // 监听路由变化（适用于SPA）
    this.setupRouteChangeListener()
    
    // 监听网络错误
    this.setupNetworkErrorListener()
  }

  /**
   * 检查是否为404页面
   */
  is404Page() {
    // 检查HTTP状态码（如果可用）
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = window.performance.getEntriesByType('navigation')[0]
      if (navigation && navigation.responseStatus === 404) {
        return true
      }
    }
    
    // 检查页面标题或内容
    const title = document.title.toLowerCase()
    const bodyText = document.body.textContent.toLowerCase()
    
    return (
      title.includes('404') ||
      title.includes('not found') ||
      title.includes('页面未找到') ||
      bodyText.includes('404') ||
      document.querySelector('.enhanced-404-page') !== null
    )
  }

  /**
   * 跟踪404错误
   */
  async trackError() {
    if (typeof window === 'undefined') return

    const errorData = this.collectErrorData()
    
    try {
      await this.sendErrorReport(errorData)
      
      if (this.options.enableConsoleLog) {
        console.log('404 Error tracked:', errorData)
      }
    } catch (error) {
      console.warn('Failed to track 404 error:', error)
    }
  }

  /**
   * 收集错误数据
   */
  collectErrorData() {
    const data = {
      path: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      referrer: document.referrer || '',
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      screen: {
        width: screen.width,
        height: screen.height
      },
      language: navigator.language,
      platform: navigator.platform
    }

    // 添加性能数据
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing
      data.performance = {
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
        firstPaint: this.getFirstPaintTime()
      }
    }

    // 添加会话信息
    data.session = {
      isNewSession: !sessionStorage.getItem('session_started'),
      sessionId: this.getOrCreateSessionId(),
      pageViews: this.getSessionPageViews()
    }

    return data
  }

  /**
   * 发送错误报告
   */
  async sendErrorReport(data, attempt = 1) {
    try {
      const response = await fetch(this.options.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      // 处理智能重定向建议
      if (result.error && result.error.suggestions) {
        this.handleRedirectSuggestions(result.error.suggestions)
      }

      return result
    } catch (error) {
      if (attempt < this.options.retryAttempts) {
        await this.delay(this.options.retryDelay * attempt)
        return this.sendErrorReport(data, attempt + 1)
      }
      throw error
    }
  }

  /**
   * 处理重定向建议
   */
  handleRedirectSuggestions(suggestions) {
    if (!suggestions || suggestions.length === 0) return

    // 找到最高置信度的建议
    const bestSuggestion = suggestions.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    )

    // 如果置信度很高，可以考虑自动重定向
    if (bestSuggestion.confidence > 0.9) {
      this.showRedirectPrompt(bestSuggestion)
    }
  }

  /**
   * 显示重定向提示
   */
  showRedirectPrompt(suggestion) {
    const message = `页面未找到，是否要跳转到：${suggestion.url}？`
    
    if (confirm(message)) {
      window.location.href = suggestion.url
    }
  }

  /**
   * 设置路由变化监听器
   */
  setupRouteChangeListener() {
    // 监听 popstate 事件（浏览器前进后退）
    window.addEventListener('popstate', () => {
      setTimeout(() => {
        if (this.is404Page()) {
          this.trackError()
        }
      }, 100)
    })

    // 监听 pushState 和 replaceState（SPA路由变化）
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function(...args) {
      originalPushState.apply(history, args)
      setTimeout(() => {
        if (this.is404Page()) {
          this.trackError()
        }
      }, 100)
    }.bind(this)

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args)
      setTimeout(() => {
        if (this.is404Page()) {
          this.trackError()
        }
      }, 100)
    }.bind(this)
  }

  /**
   * 设置网络错误监听器
   */
  setupNetworkErrorListener() {
    // 监听资源加载错误
    window.addEventListener('error', (event) => {
      if (event.target !== window && event.target.tagName) {
        this.trackResourceError(event)
      }
    }, true)

    // 监听未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && event.reason.status === 404) {
        this.trackError()
      }
    })
  }

  /**
   * 跟踪资源错误
   */
  trackResourceError(event) {
    const errorData = {
      type: 'resource_error',
      element: event.target.tagName.toLowerCase(),
      src: event.target.src || event.target.href,
      path: window.location.pathname,
      timestamp: Date.now()
    }

    // 发送资源错误报告（可选）
    if (this.options.enableConsoleLog) {
      console.warn('Resource error:', errorData)
    }
  }

  /**
   * 获取首次绘制时间
   */
  getFirstPaintTime() {
    if (window.performance && window.performance.getEntriesByType) {
      const paintEntries = window.performance.getEntriesByType('paint')
      const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')
      return firstPaint ? firstPaint.startTime : null
    }
    return null
  }

  /**
   * 获取或创建会话ID
   */
  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('session_id')
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem('session_id', sessionId)
      sessionStorage.setItem('session_started', Date.now().toString())
    }
    return sessionId
  }

  /**
   * 获取会话页面浏览数
   */
  getSessionPageViews() {
    const pageViews = parseInt(sessionStorage.getItem('page_views') || '0') + 1
    sessionStorage.setItem('page_views', pageViews.toString())
    return pageViews
  }

  /**
   * 延迟函数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 集成Google Analytics
   */
  trackWithGoogleAnalytics(errorData) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_not_found', {
        page_path: errorData.path,
        referrer: errorData.referrer || 'direct',
        custom_parameter_1: errorData.userAgent,
        custom_parameter_2: errorData.session.sessionId
      })
    }

    // 兼容旧版GA
    if (typeof ga !== 'undefined') {
      ga('send', 'event', 'Error', '404', errorData.path)
    }
  }

  /**
   * 集成其他分析工具
   */
  trackWithOtherAnalytics(errorData) {
    // 百度统计
    if (typeof _hmt !== 'undefined') {
      _hmt.push(['_trackEvent', 'Error', '404', errorData.path])
    }

    // 自定义分析
    if (window.customAnalytics && typeof window.customAnalytics.track === 'function') {
      window.customAnalytics.track('404_error', errorData)
    }
  }
}

// 自动初始化（如果在浏览器环境中）
if (typeof window !== 'undefined') {
  // 等待DOM加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.notFoundTracker = new NotFoundErrorTracker()
    })
  } else {
    window.notFoundTracker = new NotFoundErrorTracker()
  }
}

export default NotFoundErrorTracker