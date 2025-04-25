import { siteConfig } from '@/lib/config'
import Script from 'next/script'
import { useRef } from 'react'

/**
 * Twikoo评论组件
 * 使用next/script的lazyOnload策略在浏览器空闲时加载
 * @returns {JSX.Element}
 * @constructor
 */
const Twikoo = ({ isDarkMode }) => {
  const envId = siteConfig('COMMENT_TWIKOO_ENV_ID')
  const el = siteConfig('COMMENT_TWIKOO_ELEMENT_ID', '#twikoo')
  const twikooCDNURL = siteConfig('COMMENT_TWIKOO_CDN_URL')
  const lang = siteConfig('LANG')
  const isInitRef = useRef(false)

  // 初始化Twikoo的函数
  const initTwikoo = () => {
    // 避免重复初始化
    if (isInitRef.current || !window.twikoo) return

    try {
      window.twikoo.init({
        envId: envId, // 腾讯云环境填 envId；Vercel 环境填地址（https://xxx.vercel.app）
        el: el, // 容器元素
        lang: lang // 用于手动设定评论区语言
        // region: 'ap-guangzhou', // 环境地域，默认为 ap-shanghai，腾讯云环境填 ap-shanghai 或 ap-guangzhou；Vercel 环境不填
        // path: location.pathname, // 用于区分不同文章的自定义 js 路径，如果您的文章路径不是 location.pathname，需传此参数
      })
      console.log('twikoo initialized')
      isInitRef.current = true
    } catch (error) {
      console.error('twikoo 初始化失败', error)
    }
  }

  return (
    <>
      <Script
        id="twikoo-script"
        src={twikooCDNURL}
        strategy="lazyOnload"
        onLoad={initTwikoo}
      />
      <div id="twikoo"></div>
    </>
  )
}

export default Twikoo
