import '@/styles/animate.css' // @see https://animate.style/
import '@/styles/globals.css'
import '@/styles/nprogress.css'
import '@/styles/utility-patterns.css'

// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
import '@/styles/notion.css' //  重写部分样式
import 'aos/dist/aos.css' // You can also use <link> for styles

import { GlobalContextProvider } from '@/lib/global'

// 各种扩展插件 这个要阻塞引入
import ExternalPlugins from '@/components/ExternalPlugins'

const MyApp = ({ Component, pageProps }) => {
  return (
        <GlobalContextProvider {...pageProps}>
            <Component {...pageProps} />
            {/* 全局插件 , 自定义样式、组件等在这里统一引入 */}
            <ExternalPlugins {...pageProps} />
        </GlobalContextProvider>
  )
}

export default MyApp
