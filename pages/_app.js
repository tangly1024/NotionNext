import '@/styles/animate.css' // @see https://animate.style/
import '@/styles/globals.css'
import '@/styles/nprogress.css'
import '@/styles/utility-patterns.css'

// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
import '@/styles/notion.css' //  重写部分样式

import { GlobalContextProvider } from '@/lib/global'

import AOS from 'aos'
import 'aos/dist/aos.css' // You can also use <link> for styles
import dynamic from 'next/dynamic'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import BLOG from '@/blog.config'

// 各种扩展插件 动画等
const ExternalPlugins = dynamic(() => import('@/components/ExternalPlugins'))

const MyApp = ({ Component, pageProps }) => {
  // 自定义样式css和js引入
  if (isBrowser) {
    // 初始化AOS动画
    AOS.init()
    // 静态导入本地自定义样式
    loadExternalResource('/css/custom.css', 'css')
    loadExternalResource('/js/custom.js', 'js')

    // 自动添加图片阴影
    if (BLOG.IMG_SHADOW) {
      loadExternalResource('/css/img-shadow.css', 'css')
    }

    // 导入外部自定义脚本
    if (BLOG.CUSTOM_EXTERNAL_JS && BLOG.CUSTOM_EXTERNAL_JS.length > 0) {
      for (const url of BLOG.CUSTOM_EXTERNAL_JS) {
        loadExternalResource(url, 'js')
      }
    }

    // 导入外部自定义样式
    if (BLOG.CUSTOM_EXTERNAL_CSS && BLOG.CUSTOM_EXTERNAL_CSS.length > 0) {
      for (const url of BLOG.CUSTOM_EXTERNAL_CSS) {
        loadExternalResource(url, 'css')
      }
    }
  }

  return (
        <GlobalContextProvider {...pageProps}>
            <Component {...pageProps} />
            <ExternalPlugins {...pageProps} />
        </GlobalContextProvider>
  )
}

export default MyApp
