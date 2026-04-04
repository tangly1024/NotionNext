import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const DEFAULT_TECH_GROW_JS = 'https://qiniu.techgrow.cn/readmore/dist/readmore.js'
const DEFAULT_TECH_GROW_CSS = 'https://qiniu.techgrow.cn/readmore/dist/hexo.css'

const hasValue = value => value !== undefined && value !== null && value !== ''

const getFirstConfig = (keys, defaultVal = null) => {
  for (const key of keys) {
    const value = siteConfig(key)
    if (hasValue(value)) {
      return value
    }
  }
  return defaultVal
}

const getReadmoreWrapper = () =>
  document.getElementById('readmore-wrapper') ||
  document.getElementById('read-more-wrap')

const normalizePreviewHeight = height => {
  if (height === undefined || height === null || height === '') {
    return null
  }
  if (typeof height === 'number') {
    return `${height}px`
  }
  const raw = String(height).trim()
  if (!raw) {
    return null
  }
  if (raw.toLowerCase() === 'auto') {
    return null
  }
  return /^\d+$/.test(raw) ? `${raw}px` : raw
}

const isReadmoreRelatedUrl = url =>
  typeof url === 'string' &&
  /(techgrow|readmore|open\.techgrow\.cn|qiniu\.techgrow\.cn)/i.test(url)

const installReadmoreNetworkProbe = debug => {
  if (!debug || typeof window === 'undefined') {
    return
  }
  if (window.__TECH_GROW_NETWORK_PROBE_INSTALLED__) {
    return
  }
  window.__TECH_GROW_NETWORK_PROBE_INSTALLED__ = true

  if (typeof window.fetch === 'function') {
    const originalFetch = window.fetch.bind(window)
    window.fetch = async (...args) => {
      let url = ''
      let method = 'GET'
      try {
        const input = args[0]
        const init = args[1]
        url = typeof input === 'string' ? input : input?.url || ''
        method =
          init?.method ||
          (typeof input !== 'string' && input?.method) ||
          'GET'
      } catch {}

      const related = isReadmoreRelatedUrl(url)
      const start = Date.now()
      if (related) {
        console.log(`[TechGrow][fetch][req] ${method} ${url}`)
      }

      try {
        const response = await originalFetch(...args)
        if (related) {
          console.log(
            `[TechGrow][fetch][res] ${response.status} ${response.url || url} ${Date.now() - start}ms`
          )
        }
        return response
      } catch (error) {
        if (related) {
          console.error(`[TechGrow][fetch][err] ${url}`, error)
        }
        throw error
      }
    }
  }

  const XHR = window.XMLHttpRequest
  if (XHR?.prototype?.open && XHR?.prototype?.send) {
    const originalOpen = XHR.prototype.open
    const originalSend = XHR.prototype.send

    XHR.prototype.open = function(method, url, ...rest) {
      this.__techGrowDebugMeta = {
        method: method || 'GET',
        url: String(url || '')
      }
      return originalOpen.call(this, method, url, ...rest)
    }

    XHR.prototype.send = function(body) {
      const meta = this.__techGrowDebugMeta || { method: 'GET', url: '' }
      const related = isReadmoreRelatedUrl(meta.url)
      const start = Date.now()

      if (related) {
        console.log(`[TechGrow][xhr][req] ${meta.method} ${meta.url}`)
        this.addEventListener('loadend', () => {
          console.log(
            `[TechGrow][xhr][res] ${this.status} ${meta.url} ${Date.now() - start}ms`
          )
        })
        this.addEventListener('error', () => {
          console.error(`[TechGrow][xhr][err] ${meta.url}`)
        })
      }

      return originalSend.call(this, body)
    }
  }
}

const installReadmoreAlertProbe = debug => {
  if (!debug || typeof window === 'undefined') {
    return
  }
  if (window.__TECH_GROW_ALERT_PROBE_INSTALLED__) {
    return
  }
  if (typeof window.alert !== 'function') {
    return
  }
  window.__TECH_GROW_ALERT_PROBE_INSTALLED__ = true
  const originalAlert = window.alert.bind(window)
  window.alert = message => {
    const text = String(message || '')
    console.warn(`[TechGrow][alert] ${text}`)
    if (text.includes('验证码无效')) {
      console.warn('[TechGrow][alert] invalid-captcha triggered')
    }
    return originalAlert(message)
  }
}

const logReadmoreState = (debug, contentId, stage) => {
  if (!debug || typeof document === 'undefined') {
    return
  }
  const container = document.getElementById(contentId)
  const wrapper = getReadmoreWrapper()
  const containerStyle = container
    ? window.getComputedStyle(container)
    : null
  const wrapperStyle = wrapper ? window.getComputedStyle(wrapper) : null
  console.log('[TechGrow][state]', stage, {
    contentId,
    hasContainer: !!container,
    hasWrapper: !!wrapper,
    wrapperParentId: wrapper?.parentElement?.id || '',
    containerPosition: containerStyle?.position || '',
    containerHeight: containerStyle?.height || '',
    containerOverflow: containerStyle?.overflow || '',
    wrapperDisplay: wrapperStyle?.display || '',
    wrapperVisibility: wrapperStyle?.visibility || ''
  })
}
/**
 * 公众号导流插件（TechGrow）
 * @returns
 */
const TechGrow = () => {
  const router = useRouter()
  const qrcode = getFirstConfig(['TECH_GROW_QRCODE'], '请配置公众号二维码')
  const blogId = getFirstConfig(['TECH_GROW_BLOG_ID'])
  const name = getFirstConfig(['TECH_GROW_NAME'], '请配置公众号名')
  const id = getFirstConfig(
    ['TECH_GROW_ARTICLE_CONTENT_ID', 'TECH_GROW_CONTENT_ID'],
    'notion-article'
  )
  const keyword = getFirstConfig(['TECH_GROW_KEYWORD'], '请配置公众号关键词')
  const btnText = getFirstConfig(['TECH_GROW_BTN_TEXT'], '原创不易，完成人机检测，阅读全文')
  // 验证一次后的有效时长，单位小时
  const cookieAge = getFirstConfig(['TECH_GROW_VALIDITY_DURATION'], 1)
  const random = getFirstConfig(['TECH_GROW_RANDOM'], 1)
  const interval = getFirstConfig(['TECH_GROW_INTERVAL'], 60)
  const expires = getFirstConfig(['TECH_GROW_EXPIRES'], 365)
  const lockToc = getFirstConfig(['TECH_GROW_LOCK_TOC'], 'yes')
  const height = getFirstConfig(['TECH_GROW_HEIGHT'], 'auto')
  const tocSelector = getFirstConfig(['TECH_GROW_TOC_SELECTOR'], '')
  const debug = getFirstConfig(['TECH_GROW_DEBUG'], true)
  const allowMobile = getFirstConfig(['TECH_GROW_ALLOW_MOBILE'], false)
  // 白名单，想要放行的页面
  const whiteList = getFirstConfig(['TECH_GROW_WHITE_LIST'], '')
  // 黄名单，优先级最高，设置后只有这里的路径会被上锁，其他页面自动全部放行
  const yellowList = getFirstConfig(['TECH_GROW_YELLOW_LIST'], '')
  const jsUrl = getFirstConfig(['TECH_GROW_JS_URL'], DEFAULT_TECH_GROW_JS)
  const cssUrl = getFirstConfig(['TECH_GROW_CSS_URL'], DEFAULT_TECH_GROW_CSS)
  const baseUrl = getFirstConfig(['TECH_GROW_BASE_URL'], '')

  // 登录信息
  const { isLoaded, isSignedIn } = useGlobal()

  useEffect(() => {
    installReadmoreNetworkProbe(debug)
    installReadmoreAlertProbe(debug)
  }, [debug])

  const waitForContentReady = () =>
    new Promise(resolve => {
      let attempts = 0
      const maxAttempts = 20
      const timer = setInterval(() => {
        const target = document.getElementById(id)
        if (target && target.childElementCount > 0) {
          clearInterval(timer)
          resolve(true)
          return
        }
        attempts += 1
        if (attempts >= maxAttempts) {
          clearInterval(timer)
          resolve(false)
        }
      }, 200)
    })

  const loadReadmore = async () => {
    try {
      const isMobile = /phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone/i.test(
        navigator.userAgent
      )
      if (isMobile && !allowMobile) {
        if (debug) {
          console.log('Readmore: 移动端已禁用')
        }
        return
      }
      const isReady = await waitForContentReady()
      if (!isReady) {
        if (debug) {
          console.warn(`Readmore 未找到内容容器: #${id}`)
          logReadmoreState(debug, id, 'content-not-ready')
        }
        return
      }
      if (debug) {
        console.log('[TechGrow][init]', {
          id,
          blogId,
          name,
          keyword,
          height,
          interval,
          expires,
          random,
          lockToc,
          tocSelector,
          allowMobile,
          jsUrl,
          cssUrl,
          hasBaseUrl: !!baseUrl
        })
      }
      const target = document.getElementById(id)
      if (target) {
        const position = window.getComputedStyle(target).position
        if (!position || position === 'static') {
          // TechGrow 的 #readmore-wrapper 使用 absolute 定位，父容器需为 relative
          target.style.position = 'relative'
        }
      }
      if (cssUrl) {
        await loadExternalResource(cssUrl, 'css')
        if (debug) {
          console.log(`[TechGrow][asset] css loaded: ${cssUrl}`)
        }
      }
      await loadExternalResource(jsUrl, 'js')
      if (debug) {
        console.log(`[TechGrow][asset] js loaded: ${jsUrl}`)
      }
      const ReadmorePlugin = window?.ReadmorePlugin

      if (ReadmorePlugin) {
        const btw = new ReadmorePlugin()
        window.btw = btw
        btw.init({
          qrcode,
          id,
          name,
          btnText,
          keyword,
          blogId,
          cookieAge,
          random,
          interval,
          expires,
          lockToc,
          height,
          tocSelector,
          debug,
          execute: 'yes',
          type: 'hexo',
          ...(baseUrl ? { baseUrl } : {})
        })

        const fixReadmoreWrapperPosition = () => {
          const container = document.getElementById(id)
          const wrapper = getReadmoreWrapper()
          if (!container || !wrapper) {
            logReadmoreState(debug, id, 'fix-skip-no-wrapper')
            return false
          }

          if (wrapper.parentElement !== container) {
            container.appendChild(wrapper)
          }

          wrapper.style.position = 'absolute'
          wrapper.style.left = '0'
          wrapper.style.right = '0'
          wrapper.style.bottom = '0'
          wrapper.style.width = '100%'
          wrapper.style.zIndex = '9999'
          const previewHeight = normalizePreviewHeight(height)
          if (previewHeight) {
            // 只有在 readmore wrapper 已生成时才裁剪正文，避免误解锁
            container.style.height = previewHeight
            container.style.overflow = 'hidden'
          }
          logReadmoreState(debug, id, 'fix-wrapper-positioned')
          return true
        }

        // 插件在不同模式下创建 wrapper 的时机不同，分批兜底修正
        ;[0, 150, 400, 900].forEach(delay => {
          setTimeout(() => {
            fixReadmoreWrapperPosition()
          }, delay)
        })

        return undefined
      } else {
        if (debug) {
          console.warn(`Readmore 插件加载成功但构造器不存在: ${jsUrl}`)
        }
      }
    } catch (error) {
      if (debug) {
        console.error('Readmore 加载异常', error)
      }
    }
  }

  useEffect(() => {
    const isInYellowList = isPathInList(router.asPath, yellowList)
    const isInWhiteList = isPathInList(router.asPath, whiteList)

    // 优先判断黄名单
    if (yellowList && yellowList.length > 0) {
      if (!isInYellowList) {
        console.log('当前路径不在黄名单中，放行')
        return
      }
    } else if (isInWhiteList) {
      // 白名单中，免检
      console.log('当前路径在白名单中，放行')
      return
    }

    if (isSignedIn) {
      // 用户已登录免检
      console.log('用户已登录，放行')
      return
    }

    if (process.env.NODE_ENV === 'development') {
      // 开发环境免检
      console.log('开发环境:屏蔽Readmore')
      return
    }

    if (isBrowser && blogId && !isSignedIn) {
      // 检查是否已加载
      const readMoreWrap = getReadmoreWrapper()
      if (!readMoreWrap) {
        loadReadmore()
      }
    }
  }, [isLoaded, router, id, tocSelector])

  return <></>
}

/**
 * 检查路径是否在名单中
 * @param {*} path 当前url的字符串
 * @param {*} listStr 名单字符串，逗号分隔
 */
function isPathInList(path, listStr) {
  if (!path || !listStr) {
    return false
  }

  // 提取 path 最后一个斜杠后的内容，并移除查询参数和 .html 后缀
  const processedPath = path
    .replace(/\?.*$/, '') // 移除查询参数
    .replace(/.*\/([^/]+)(?:\.html)?$/, '$1') // 提取最后部分

  const isInList = listStr.includes(processedPath)

  if (isInList) {
    // console.log(`当前路径在名单中: ${processedPath}`)
  }

  return isInList
}

export default TechGrow
