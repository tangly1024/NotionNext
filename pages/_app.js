import '@/styles/animate.css' // @see https://animate.style/
import '@/styles/globals.css'
import '@/styles/nprogress.css'
import '@/styles/utility-patterns.css'

// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
import '@/styles/notion.css' //  重写部分样式
import 'aos/dist/aos.css' // You can also use <link> for styles

import { GlobalContextProvider } from '@/lib/global'
import { isBrowser, loadExternalResource } from '@/lib/utils'

// 各种扩展插件 这个要阻塞引入
import ExternalPlugins from '@/components/ExternalPlugins'
import { CUSTOM_EXTERNAL_CSS, CUSTOM_EXTERNAL_JS, IMG_SHADOW } from '@/blog.config'

const MyApp = ({ Component, pageProps }) => {
  // 自定义样式css和js引入
  if (isBrowser) {
    // 初始化AOS动画
    // 静态导入本地自定义样式
    loadExternalResource('/css/custom.css', 'css')
    loadExternalResource('/js/custom.js', 'js')

    // 自动添加图片阴影
    if (IMG_SHADOW) {
      loadExternalResource('/css/img-shadow.css', 'css')
    }

    // 导入外部自定义脚本
    if (CUSTOM_EXTERNAL_JS && CUSTOM_EXTERNAL_JS.length > 0) {
      for (const url of CUSTOM_EXTERNAL_JS) {
        loadExternalResource(url, 'js')
      }
    }

    // 导入外部自定义样式
    if (CUSTOM_EXTERNAL_CSS && CUSTOM_EXTERNAL_CSS.length > 0) {
      for (const url of CUSTOM_EXTERNAL_CSS) {
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
