import BLOG from 'blog.config'
import React from 'react'
import dynamic from 'next/dynamic'

import 'animate.css'
import '@/styles/globals.css'

// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
import '@/styles/notion.css' //  重写部分样式

import { GlobalContextProvider } from '@/lib/global'
import { DebugPanel } from '@/components/DebugPanel'
import { ThemeSwitch } from '@/components/ThemeSwitch'
import { Fireworks } from '@/components/Fireworks'
import { Nest } from '@/components/Nest'
import { FlutteringRibbon } from '@/components/FlutteringRibbon'
import { Ribbon } from '@/components/Ribbon'
import { Sakura } from '@/components/Sakura'
import { StarrySky } from '@/components/StarrySky'
import MusicPlayer from '@/components/MusicPlayer'
import ExternalScript from '@/components/ExternalScript'
import { isBrowser } from '@/lib/utils'

import AOS from 'aos'
import 'aos/dist/aos.css' // You can also use <link> for styles

const Ackee = dynamic(() => import('@/components/Ackee'), { ssr: false })
const Gtag = dynamic(() => import('@/components/Gtag'), { ssr: false })
const Busuanzi = dynamic(() => import('@/components/Busuanzi'), { ssr: false })
const GoogleAdsense = dynamic(() => import('@/components/GoogleAdsense'), {
  ssr: false
})
const Messenger = dynamic(() => import('@/components/FacebookMessenger'), {
  ssr: false
})

const MyApp = ({ Component, pageProps }) => {
  // 外部插件
  const externalPlugins = <>
        {JSON.parse(BLOG.THEME_SWITCH) && <ThemeSwitch />}
        {JSON.parse(BLOG.DEBUG) && <DebugPanel />}
        {BLOG.ANALYTICS_ACKEE_TRACKER && <Ackee />}
        {BLOG.ANALYTICS_GOOGLE_ID && <Gtag />}
        {JSON.parse(BLOG.ANALYTICS_BUSUANZI_ENABLE) && <Busuanzi />}
        {BLOG.ADSENSE_GOOGLE_ID && <GoogleAdsense />}
        {BLOG.FACEBOOK_APP_ID && BLOG.FACEBOOK_PAGE_ID && <Messenger />}
        {JSON.parse(BLOG.FIREWORKS) && <Fireworks />}
        {JSON.parse(BLOG.SAKURA) && <Sakura />}
        {JSON.parse(BLOG.STARRY_SKY) && <StarrySky />}
        {JSON.parse(BLOG.MUSIC_PLAYER) && <MusicPlayer />}
        {JSON.parse(BLOG.NEST) && <Nest />}
        {JSON.parse(BLOG.FLUTTERINGRIBBON) && <FlutteringRibbon />}
        {JSON.parse(BLOG.RIBBON) && <Ribbon />}
        <ExternalScript/>
    </>

  if (isBrowser()) {
    AOS.init()
  }

  return (
        <GlobalContextProvider>
            {externalPlugins}
            <Component {...pageProps} />
        </GlobalContextProvider>
  )
}

export default MyApp
