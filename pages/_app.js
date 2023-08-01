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

const MyApp = ({ Component, pageProps }) => {
  useEffect(() => {
    AOS.init()
  }, [])

  return (
        <GlobalContextProvider {...pageProps}>
            <ExternalScript />
            <Component {...pageProps} />
            <ExternalPlugins {...pageProps} />
        </GlobalContextProvider>
  )
}

export default MyApp
