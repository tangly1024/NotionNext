import { siteConfig } from '@/lib/config'
import dynamic from 'next/dynamic'
import WebWhiz from './Webwhiz'

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
const AdBlockDetect = dynamic(() => import('@/components/AdBlockDetect'), { ssr: false })

/**
 * 各种插件脚本
 * @param {*} props
 * @returns
 */
const ExternalPlugin = (props) => {
  return <>
          {JSON.parse(siteConfig('THEME_SWITCH')) && <ThemeSwitch />}
          {JSON.parse(siteConfig('DEBUG')) && <DebugPanel />}
          {siteConfig('ANALYTICS_ACKEE_TRACKER') && <Ackee />}
          {siteConfig('ANALYTICS_GOOGLE_ID') && <Gtag />}
          {siteConfig('ANALYTICS_VERCEL') && <Analytics />}
          {JSON.parse(siteConfig('ANALYTICS_BUSUANZI_ENABLE')) && <Busuanzi />}
          {siteConfig('ADSENSE_GOOGLE_ID') && <GoogleAdsense />}
          {siteConfig('FACEBOOK_APP_ID') && siteConfig('FACEBOOK_PAGE_ID') && <Messenger />}
          {JSON.parse(siteConfig('FIREWORKS')) && <Fireworks />}
          {JSON.parse(siteConfig('SAKURA')) && <Sakura />}
          {JSON.parse(siteConfig('STARRY_SKY')) && <StarrySky />}
          {JSON.parse(siteConfig('MUSIC_PLAYER')) && <MusicPlayer />}
          {JSON.parse(siteConfig('NEST')) && <Nest />}
          {JSON.parse(siteConfig('FLUTTERINGRIBBON')) && <FlutteringRibbon />}
          {JSON.parse(siteConfig('COMMENT_TWIKOO_COUNT_ENABLE')) && <TwikooCommentCounter {...props}/>}
          {JSON.parse(siteConfig('RIBBON')) && <Ribbon />}
          {JSON.parse(siteConfig('CUSTOM_RIGHT_CLICK_CONTEXT_MENU')) && <CustomContextMenu {...props} />}
          {!JSON.parse(siteConfig('CAN_COPY')) && <DisableCopy/>}
          {JSON.parse(siteConfig('WEB_WHIZ_ENABLED')) && <WebWhiz/>}
          {JSON.parse(siteConfig('AD_WWADS_BLOCK_DETECT')) && <AdBlockDetect/>}
          <VConsole/>
      </>
}

export default ExternalPlugin
