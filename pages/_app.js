import BLOG from 'blog.config'
import 'animate.css'
import '@/styles/globals.css'
// custom
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
import '@/styles/notion.css' //  重写部分样式

// used for collection views (optional)
import 'rc-dropdown/assets/index.css'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-okaidia.css'
// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
import dynamic from 'next/dynamic'
import { GlobalContextProvider } from '@/lib/global'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const Ackee = dynamic(() => import('@/components/Ackee'), { ssr: false })
const Gtag = dynamic(() => import('@/components/Gtag'), { ssr: false })
const Busuanzi = dynamic(() => import('@/components/Busuanzi'), { ssr: false })
const GoogleAdsense = dynamic(() => import('@/components/GoogleAdsense'), { ssr: false })

const MyApp = ({ Component, pageProps }) => {
  return (
    <GlobalContextProvider>
        {BLOG.isProd && BLOG?.analytics?.provider === 'ackee' && (
          <Ackee
            ackeeServerUrl={BLOG.analytics.ackeeConfig.dataAckeeServer}
            ackeeDomainId={BLOG.analytics.ackeeConfig.domainId}
          />
        )}
        {BLOG.isProd && BLOG?.analytics?.provider === 'ga' && <Gtag />}
        {BLOG.analytics.busuanzi && <Busuanzi/>}
        {BLOG.googleAdsenseId && <GoogleAdsense/>}
        <Component {...pageProps} />
    </GlobalContextProvider>
  )
}

export default MyApp
