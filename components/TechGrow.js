import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const DEFAULT_TECH_GROW_JS = 'https://qiniu.techgrow.cn/readmore/dist/readmore.js'
const DEFAULT_TECH_GROW_CSS = 'https://qiniu.techgrow.cn/readmore/dist/hexo.css'
const DEFAULT_TECH_GROW_CAPTCHA_URL =
  'https://open.techgrow.cn/#/readmore/captcha/generate?blogId='

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

const resolveCaptchaGenerateUrl = (url, blogId) => {
  if (!url) {
    return ''
  }

  if (!blogId) {
    return url
  }

  if (url.includes('{blogId}')) {
    return url.replace('{blogId}', blogId)
  }

  if (url.includes('blogId=')) {
    return url.replace(/blogId=([^&]*)/, `blogId=${blogId}`)
  }

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}blogId=${blogId}`
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
  const id = getFirstConfig(['TECH_GROW_CONTENT_ID'], 'notion-article')
  const keyword = getFirstConfig(['TECH_GROW_KEYWORD'], '请配置公众号关键词')
  const btnText = getFirstConfig(['TECH_GROW_BTN_TEXT'], '原创不易，完成人机检测，阅读全文')
  // 验证一次后的有效时长，单位小时
  const cookieAge = getFirstConfig(['TECH_GROW_VALIDITY_DURATION'], 1)
  const random = getFirstConfig(['TECH_GROW_RANDOM'], 1)
  const interval = getFirstConfig(['TECH_GROW_INTERVAL'], 60)
  const expires = getFirstConfig(['TECH_GROW_EXPIRES'], 365)
  const lockToc = getFirstConfig(['TECH_GROW_LOCK_TOC'], 'yes')
  const height = getFirstConfig(['TECH_GROW_HEIGHT'], 'auto')
  const tocSelector = getFirstConfig(['TECH_GROW_TOC_SELECTOR'], 'a.catalog-item')
  // 白名单，想要放行的页面
  const whiteList = getFirstConfig(['TECH_GROW_WHITE_LIST'], '')
  // 黄名单，优先级最高，设置后只有这里的路径会被上锁，其他页面自动全部放行
  const yellowList = getFirstConfig(['TECH_GROW_YELLOW_LIST'], '')
  const jsUrl = getFirstConfig(['TECH_GROW_JS_URL'], DEFAULT_TECH_GROW_JS)
  const cssUrl = getFirstConfig(['TECH_GROW_CSS_URL'], DEFAULT_TECH_GROW_CSS)
  const captchaTemplateUrl = getFirstConfig(
    ['TECH_GROW_CAPTCHA_URL'],
    DEFAULT_TECH_GROW_CAPTCHA_URL
  )
  const captchaGenerateUrl = resolveCaptchaGenerateUrl(captchaTemplateUrl, blogId)
  const baseUrl = getFirstConfig(['TECH_GROW_BASE_URL'], '')

  // 登录信息
  const { isLoaded, isSignedIn } = useGlobal()

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
      const isReady = await waitForContentReady()
      if (!isReady) {
        console.warn(`Readmore 未找到内容容器: #${id}`)
        return
      }
      if (cssUrl) {
        await loadExternalResource(cssUrl, 'css')
      }
      await loadExternalResource(jsUrl, 'js')
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
          execute: 'yes',
          type: 'hexo',
          baseUrl,
          captchaUrl: captchaGenerateUrl,
          generateCodeUrl: captchaGenerateUrl,
          codeUrl: captchaGenerateUrl
        })

        // btw初始化后，开始监听read-more-wrap何时消失
        const intervalId = setInterval(() => {
          const readMoreWrapElement = document.getElementById('read-more-wrap')
          const articleWrapElement = document.getElementById(id)

          if (!readMoreWrapElement && articleWrapElement) {
            toggleTocItems(false) // 恢复目录项的点击
            // 自动调整文章区域的高度
            articleWrapElement.style.height = 'auto'
            // 停止定时器
            clearInterval(intervalId)
          }
        }, 1000) // 每秒检查一次

        // Return cleanup function to clear the interval if the component unmounts
        return () => clearInterval(intervalId)
      } else {
        console.warn(`Readmore 插件加载成功但构造器不存在: ${jsUrl}`)
      }
    } catch (error) {
      console.error('Readmore 加载异常', error)
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
      toggleTocItems(true) // 禁止目录项的点击

      // 检查是否已加载
      const readMoreWrap = document.getElementById('read-more-wrap')
      if (!readMoreWrap) {
        loadReadmore()
      }
    }
  }, [isLoaded, router, id])

  // 启动一个监听器，当页面上存在#read-more-wrap对象时，所有的 a .catalog-item 对象都禁止点击

  return <></>
}

// 定义禁用和恢复目录项点击的函数
const toggleTocItems = disable => {
  const tocItems = document.querySelectorAll('a.catalog-item')
  tocItems.forEach(item => {
    if (disable) {
      item.style.pointerEvents = 'none'
      item.style.opacity = '0.5'
    } else {
      item.style.pointerEvents = 'auto'
      item.style.opacity = '1'
    }
  })
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
