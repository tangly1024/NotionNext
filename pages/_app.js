import BLOG from 'blog.config'
import 'animate.css'
import '@/styles/globals.css'
// custom
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
import '@/styles/notion.css' //  重写部分样式

// used for collection views (optional)
// import 'rc-dropdown/assets/index.css'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-okaidia.css'
// used for rendering equations (optional)
import 'react-notion-x/build/third-party/equation.css'

import dynamic from 'next/dynamic'
import { GlobalContextProvider } from '@/lib/global'
import { DebugPanel } from '@/components/DebugPanel'
import { ThemeSwitch } from '@/components/ThemeSwitch'

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
  return (
    <GlobalContextProvider>
      {BLOG.THEME_SWITCH && <ThemeSwitch />}
      {BLOG.DEBUG && <DebugPanel />}
      {BLOG.ANALYTICS_ACKEE_TRACKER && <Ackee />}
      {BLOG.ANALYTICS_GOOGLE_ID && <Gtag />}
      {JSON.parse(BLOG.ANALYTICS_BUSUANZI_ENABLE) && <Busuanzi />}
      {BLOG.ADSENSE_GOOGLE_ID && <GoogleAdsense />}
      {BLOG.FACEBOOK_APP_ID && BLOG.FACEBOOK_PAGE_ID && <Messenger />}
      {/* FontawesomeCDN */}
      <link
        href={BLOG.FONT_AWESOME_PATH}
        rel="stylesheet"
        referrerPolicy="no-referrer"
      />
      <Component {...pageProps} />
    </GlobalContextProvider>
  )
}

export default MyApp
