import { siteConfig } from '@/lib/config'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
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

  const hasLoaded = useRef(false)

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
          blogId
        })
      }
    } catch (error) {
      console.error('OpenWrite 加载异常', error)
    }
  }

  useEffect(() => {
    if (isBrowser && blogId && !hasLoaded.current) {
      loadOpenWrite()
      hasLoaded.current = true
    }
  }, [router])

  return <></>
}

export default OpenWrite
