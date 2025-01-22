import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
/**
 * OpenWrite公众号导流插件
 * 使用介绍：https://openwrite.cn/guide/readmore/readmore.html#%E4%BA%8C%E3%80%81%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8
 * 登录后台配置你的博客：https://readmore.openwrite.cn/
 * @returns
 */
const OpenWrite = () => {
  const router = useRouter()
  const qrcode = siteConfig('OPEN_WRITE_QRCODE', '请配置公众号二维码')
  const blogId = siteConfig('OPEN_WRITE_BLOG_ID')
  const name = siteConfig('OPEN_WRITE_NAME', '请配置公众号名')
  const id = 'article-wrapper'
  const keyword = siteConfig('OPEN_WRITE_KEYWORD', '请配置公众号关键词')
  const btnText = siteConfig(
    'OPEN_WRITE_BTN_TEXT',
    '原创不易，完成人机检测，阅读全文'
  )
  // 验证一次后的有效时长，单位小时
  const cookieAge = siteConfig('OPEN_WRITE_VALIDITY_DURATION', 1)
  // 白名单，想要放行的页面
  const whiteList = siteConfig('OPEN_WRITE_WHITE_LIST', '')
  // 黄名单，优先级最高，设置后只有这里的路径会被上锁，其他页面自动全部放行
  const yellowList = siteConfig('OPEN_WRITE_YELLOW_LIST', '')

  // 登录信息
  const { isLoaded, isSignedIn } = useGlobal()

  const loadOpenWrite = async () => {
    try {
      await loadExternalResource(
        'https://readmore.openwrite.cn/js/readmore-2.0.js',
        'js'
      )
      const BTWPlugin = window?.BTWPlugin

      if (BTWPlugin) {
        const btw = new BTWPlugin()
        window.btw = btw
        btw.init({
          qrcode,
          id,
          name,
          btnText,
          keyword,
          blogId,
          cookieAge
        })

        // btw初始化后，开始监听read-more-wrap何时消失
        const intervalId = setInterval(() => {
          const readMoreWrapElement = document.getElementById('read-more-wrap')
          const articleWrapElement = document.getElementById('article-wrapper')

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
      }
    } catch (error) {
      console.error('OpenWrite 加载异常', error)
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
      console.log('开发环境:屏蔽OpenWrite')
      return
    }
  
    if (isBrowser && blogId && !isSignedIn) {
      toggleTocItems(true) // 禁止目录项的点击
  
      // 检查是否已加载
      const readMoreWrap = document.getElementById('read-more-wrap')
      if (!readMoreWrap) {
        loadOpenWrite()
      }
    }
  }, [isLoaded, router])

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

export default OpenWrite
