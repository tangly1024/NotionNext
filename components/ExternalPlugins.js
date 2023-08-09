import BLOG from 'blog.config'
import dynamic from 'next/dynamic'
import WebWhiz from './Webwhiz'

// import TwikooCommentCounter from '@/components/TwikooCommentCounter'
// import { DebugPanel } from '@/components/DebugPanel'
// import { ThemeSwitch } from '@/components/ThemeSwitch'
// import { Fireworks } from '@/components/Fireworks'
// import { Nest } from '@/components/Nest'
// import { FlutteringRibbon } from '@/components/FlutteringRibbon'
// import { Ribbon } from '@/components/Ribbon'
// import { Sakura } from '@/components/Sakura'
// import { StarrySky } from '@/components/StarrySky'
// import { Analytics } from '@vercel/analytics/react'

const TwikooCommentCounter = dynamic(() => import('@/components/TwikooCommentCounter'), { ssr: false })
const DebugPanel = dynamic(() => import('@/components/DebugPanel'), { ssr: false })
const ThemeSwitch = dynamic(() => import('@/components/ThemeSwitch'), { ssr: false })
const Fireworks = dynamic(() => import('@/components/Fireworks'), { ssr: false })
const Nest = dynamic(() => import('@/components/Nest'), { ssr: false })
const FlutteringRibbon = dynamic(() => import('@/components/FlutteringRibbon'), { ssr: false })
const Ribbon = dynamic(() => import('@/components/Ribbon'), { ssr: false })
const Sakura = dynamic(() => import('@/components/Sakura'), { ssr: false })
const StarrySky = dynamic(() => import('@/components/StarrySky'), { ssr: false })
const Analytics = dynamic(() => import('@vercel/analytics/react').then(async (m) => { return m.Analytics }), { ssr: false })
const MusicPlayer = dynamic(() => import('@/components/Player'), { ssr: false })
const Ackee = dynamic(() => import('@/components/Ackee'), { ssr: false })
const Gtag = dynamic(() => import('@/components/Gtag'), { ssr: false })
const Busuanzi = dynamic(() => import('@/components/Busuanzi'), { ssr: false })
const GoogleAdsense = dynamic(() => import('@/components/GoogleAdsense'), { ssr: false })
const Messenger = dynamic(() => import('@/components/FacebookMessenger'), { ssr: false })
const VConsole = dynamic(() => import('@/components/VConsole'), { ssr: false })
const CustomContextMenu = dynamic(() => import('@/components/CustomContextMenu'), { ssr: false })
const DisableCopy = dynamic(() => import('@/components/DisableCopy'), { ssr: false })

/**
 * 各种第三方组件
 * @param {*} props
 * @returns
 */
const ExternalPlugin = (props) => {
  return <>
          {JSON.parse(BLOG.THEME_SWITCH) && <ThemeSwitch />}
          {JSON.parse(BLOG.DEBUG) && <DebugPanel />}
          {BLOG.ANALYTICS_ACKEE_TRACKER && <Ackee />}
          {BLOG.ANALYTICS_GOOGLE_ID && <Gtag />}
          {BLOG.ANALYTICS_VERCEL && <Analytics />}
          {JSON.parse(BLOG.ANALYTICS_BUSUANZI_ENABLE) && <Busuanzi />}
          {BLOG.ADSENSE_GOOGLE_ID && <GoogleAdsense />}
          {BLOG.FACEBOOK_APP_ID && BLOG.FACEBOOK_PAGE_ID && <Messenger />}
          {JSON.parse(BLOG.FIREWORKS) && <Fireworks />}
          {JSON.parse(BLOG.SAKURA) && <Sakura />}
          {JSON.parse(BLOG.STARRY_SKY) && <StarrySky />}
          {JSON.parse(BLOG.MUSIC_PLAYER) && <MusicPlayer />}
          {JSON.parse(BLOG.NEST) && <Nest />}
          {JSON.parse(BLOG.FLUTTERINGRIBBON) && <FlutteringRibbon />}
          {JSON.parse(BLOG.COMMENT_TWIKOO_COUNT_ENABLE) && <TwikooCommentCounter {...props}/>}
          {JSON.parse(BLOG.RIBBON) && <Ribbon />}
          {JSON.parse(BLOG.CUSTOM_RIGHT_CLICK_CONTEXT_MENU) && <CustomContextMenu {...props} />}
          {!JSON.parse(BLOG.CAN_COPY) && <DisableCopy/>}
          {JSON.parse(BLOG.WEB_WHIZ_ENABLED) && <WebWhiz/>}
          <VConsole/>
      </>
}

export default ExternalPlugin
