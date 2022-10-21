import BLOG from 'blog.config'
import 'animate.css'
import '@/styles/globals.css'
// custom
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
import '@/styles/notion.css' //  重写部分样式

// used for collection views (optional)
// import 'rc-dropdown/assets/index.css'
import 'prismjs/themes/prism-tomorrow.min.css'
import 'react-notion-x/build/third-party/equation.css'

// waline 评论插件
import '@waline/client/dist/waline.css'

import dynamic from 'next/dynamic'
import { GlobalContextProvider } from '@/lib/global'
import { DebugPanel } from '@/components/DebugPanel'
import { ThemeSwitch } from '@/components/ThemeSwitch'
import { Fireworks } from '@/components/Fireworks'

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
        {JSON.parse(BLOG.FIREWORKS) && <Fireworks/>}
    </>

  return (
        <GlobalContextProvider>
            {/* FontawesomeCDN */}
            <link rel="stylesheet" href={BLOG.FONT_AWESOME_PATH} referrerPolicy="no-referrer" />
            {externalPlugins}
            <Component {...pageProps} />
        </GlobalContextProvider>
  )
}

export default MyApp
