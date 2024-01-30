import '@/styles/animate.css' // @see https://animate.style/
import '@/styles/globals.css'
import '@/styles/nprogress.css'
import '@/styles/utility-patterns.css'

// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
import '@/styles/notion.css' //  重写部分样式
import 'aos/dist/aos.css' // You can also use <link> for styles

import { GlobalContextProvider } from '@/lib/global'
import { getGlobalLayoutByTheme } from '@/themes/theme'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { getQueryParam } from '../lib/utils'

// 各种扩展插件 这个要阻塞引入
import ExternalPlugins from '@/components/ExternalPlugins'
import { THEME } from '@/blog.config'

const MyApp = ({ Component, pageProps }) => {
  /**
   * 首页布局
   * @param {*} props
   * @returns
   */
  const route = useRouter()
  const queryParam = useMemo(() => {
    return getQueryParam(route.asPath, 'theme') || THEME
  }, [route])

  const GLayout = useCallback(
    props => {
      // 根据页面路径加载不同Layout文件
      const Layout = getGlobalLayoutByTheme(queryParam)
      return <Layout {...props} />
    },
    [queryParam]
  )

  return (
    <GlobalContextProvider {...pageProps}>
      <GLayout {...pageProps}>
        <Component {...pageProps} />
      </GLayout>
      <ExternalPlugins {...pageProps} />
    </GlobalContextProvider>
  )
}

export default MyApp
