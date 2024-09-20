import { siteConfig } from '@/lib/config'
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
  // 白名单
  const whiteList = siteConfig('OPEN_WRITE_WHITE_LIST', '')

  const loadOpenWrite = async () => {
    const existWhite = existedWhiteList(router.asPath, whiteList)

    // 如果当前页面在白名单中，则屏蔽加锁
    if (existWhite) {
      return
    }

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
    if (process.env.NODE_ENV === 'development') {
      console.log('开发环境:屏蔽OpenWrite')
      return
    }
    if (isBrowser && blogId) {
      toggleTocItems(true) // 禁止目录项的点击

      // Check if the element with id 'read-more-wrap' already exists
      const readMoreWrap = document.getElementById('read-more-wrap')

      // Only load the script if the element doesn't exist
      if (!readMoreWrap) {
        loadOpenWrite()
      }
    }
  })

  // 启动一个监听器，当页面上存在#read-more-wrap对象时，所有的 a .notion-table-of-contents-item 对象都禁止点击

  return <></>
}

// 定义禁用和恢复目录项点击的函数
const toggleTocItems = disable => {
  const tocItems = document.querySelectorAll('a.notion-table-of-contents-item')
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
 * 检查白名单
 * @param {*} path 当前url的字符串
 * @param {*} whiteListStr 白名单字符串
 */
function existedWhiteList(path, whiteListStr) {
  // 参数检查
  if (!path || !whiteListStr) {
    return true
  }

  // 提取 path 最后一个斜杠后的内容，去掉前面的斜杆
  // 移除查询参数（从 '?' 开始的部分）和 `.html` 后缀
  const processedPath = path
    .replace(/\?.*$/, '') // 移除查询参数
    .replace(/.*\/([^/]+)(?:\.html)?$/, '$1') // 去掉前面的路径和 .html

  // 严格检查白名单字符串中是否包含处理后的 path
  //   const whiteListArray = whiteListStr.split(',')
  //   return whiteListArray.includes(processedPath)

  // 放宽判断
  const isWhite = whiteListStr.includes(processedPath)

  if (isWhite) {
    console.log('OpenWrite白名单', processedPath)
  }

  return isWhite
}

export default OpenWrite
