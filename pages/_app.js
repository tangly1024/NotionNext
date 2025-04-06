// import '@/styles/animate.css' // @see https://animate.style/
import '@/styles/globals.css'
import '@/styles/utility-patterns.css'
// import '@/styles/nprogress.css'
// import 'animate.css'
// import '@/styles/prism-theme.scss'
import '@/styles/notion.css'
import 'katex/dist/katex.min.css'
import dynamic from 'next/dynamic'
import { GlobalContextProvider } from '@/lib/global'
// import { ThemeContextProvider } from '@/lib/theme'
import { Suspense, useEffect } from 'react'
import { Router } from 'next/router'
// import NProgress from 'nprogress'
// import loadLocale from '@/lib/locale'
import { incrementPageView } from '@/lib/utils/pageViewTracker'
import Script from 'next/script'

// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css' // 原版的react-notion-x

import useAdjustStyle from '@/hooks/useAdjustStyle'
import { getBaseLayoutByTheme } from '@/themes/theme'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { getQueryParam } from '../lib/utils'

// 各种扩展插件 这个要阻塞引入
import BLOG from '@/blog.config'
import ExternalPlugins from '@/components/ExternalPlugins'
import SEO from '@/components/SEO'
import { zhCN } from '@clerk/localizations'
// import { ClerkProvider } from '@clerk/nextjs'
const ClerkProvider = dynamic(() =>
  import('@clerk/nextjs').then(m => m.ClerkProvider)
)

// const TopProgress = dynamic(() => import('@/components/TopProgress'), {
//   ssr: false
// })

/**
 * App挂载DOM 入口文件
 * @param {*} param0
 * @returns
 */
const MyApp = ({ Component, pageProps }) => {
  // 一些可能出现 bug 的样式，可以统一放入该钩子进行调整
  useAdjustStyle()

  const route = useRouter()
  const theme = useMemo(() => {
    return (
      getQueryParam(route.asPath, 'theme') ||
      pageProps?.NOTION_CONFIG?.THEME ||
      BLOG.THEME
    )
  }, [route])

  // 整体布局
  const GLayout = useCallback(
    props => {
      const Layout = getBaseLayoutByTheme(theme)
      return <Layout {...props} />
    },
    [theme]
  )

  const enableClerk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const content = (
    <GlobalContextProvider {...pageProps}>
      <GLayout {...pageProps}>
        <SEO {...pageProps} />
        <Component {...pageProps} />
      </GLayout>
      <ExternalPlugins {...pageProps} />
    </GlobalContextProvider>
  )

  const { locale } = pageProps

  useEffect(() => {
    // loadLocale(locale)
    // 暂时注释掉locale加载，解决构建问题
  }, [locale])
  
  /**
   * 记录页面访问
   */
  useEffect(() => {
    // 处理路由变化，增加页面访问计数
    const handleRouteChange = async (url) => {
      // 只记录文章页面访问，可以根据路由模式判断
      // 例如：/posts/[slug] 或 /article/[id] 等模式
      if (url.includes('/post/') || url.includes('/article/')) {
        // 从URL中提取文章标识符作为统计ID
        const path = url.split('/').pop()
        if (path) {
          // 异步增加访问计数
          try {
            await incrementPageView(path)
          } catch (error) {
            console.error('Failed to track page view:', error)
          }
        }
      }
    }

    // 注册路由变化事件
    Router.events.on('routeChangeComplete', handleRouteChange)
    
    // 处理首次加载
    if (typeof window !== 'undefined') {
      const url = window.location.pathname
      handleRouteChange(url)
    }

    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  // 进度条
  useEffect(() => {
    const handleStart = () => {
      // NProgress.start()
      console.log('Route change started')
    }
    const handleStop = () => {
      // NProgress.done()
      console.log('Route change complete')
    }

    Router.events.on('routeChangeStart', handleStart)
    Router.events.on('routeChangeComplete', handleStop)
    Router.events.on('routeChangeError', handleStop)

    return () => {
      Router.events.off('routeChangeStart', handleStart)
      Router.events.off('routeChangeComplete', handleStop)
      Router.events.off('routeChangeError', handleStop)
    }
  }, [])

  return (
    <>
      {enableClerk ? (
        <ClerkProvider localization={zhCN}>
          {/* <TopProgress /> */}
          <Script async src="https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></Script>
          {content}
        </ClerkProvider>
      ) : (
        <>
          {/* <TopProgress /> */}
          <Script async src="https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></Script>
          {content}
        </>
      )}
    </>
  )
}

export default MyApp
