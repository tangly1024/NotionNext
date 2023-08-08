// 这里编写自定义js脚本；将被静态引入到页面中
// pages/_app.js
import { useEffect } from 'react'

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

// 自定义样式css和js引入
import ExternalScript from '@/components/ExternalScript'
// 各种扩展插件 动画等
const ExternalPlugins = dynamic(() => import('@/components/ExternalPlugins'))

// 导入react-headroom模块
import Headroom from 'react-headroom'

const MyApp = ({ Component, pageProps }) => {
  useEffect(() => {
    AOS.init()
  }, [])

  // 定义一个useEffect钩子函数
  useEffect(() => {
    // 定义一个监听网页可见性变化事件的函数
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 如果网页不可见，修改网页标题为“我走了”
        document.title = '我走了'
      } else {
        // 如果网页可见，修改网页标题为“我回来了”
        document.title = '我回来了'
        // 一秒后恢复原来的网页标题
        setTimeout(() => {
          document.title = BLOG.title
        }, 1000)
      }
    }
    // 给document对象添加visibilitychange事件的监听器
    document.addEventListener('visibilitychange', handleVisibilityChange)
    // 移除visibilitychange事件的监听器
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
        <GlobalContextProvider {...pageProps}>
            <ExternalScript />
            <Headroom>
              <Component {...pageProps} />
            </Headroom>
            <ExternalPlugins {...pageProps} />
        </GlobalContextProvider>
  )
}

export default MyApp
