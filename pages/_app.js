import BLOG from 'blog.config'
import 'animate.css'
import '@/styles/notion.css'
import '@/styles/globals.css'
import 'rc-dropdown/assets/index.css'
import 'prismjs/themes/prism-okaidia.css'
import 'katex/dist/katex.min.css'
import dynamic from 'next/dynamic'
import { GlobalContextProvider, handleRouteChange } from '@/lib/global'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const Ackee = dynamic(() => import('@/components/Ackee'), { ssr: false })
const Gtag = dynamic(() => import('@/components/Gtag'), { ssr: false })

const MyApp = ({ Component, pageProps }) => {
  //  全局监听路由变化
  const router = useRouter()
  useEffect(() => {
    handleRouteChange(router.pathname)
    const routerListener = (url) => {
      handleRouteChange(url)
    }
    router.events.on('routeChangeComplete', routerListener)
    return () => {
      router.events.off('routeChangeComplete', routerListener)
    }
  })
  return (
    <GlobalContextProvider>
        {BLOG.isProd && BLOG?.analytics?.provider === 'ackee' && (
          <Ackee
            ackeeServerUrl={BLOG.analytics.ackeeConfig.dataAckeeServer}
            ackeeDomainId={BLOG.analytics.ackeeConfig.domainId}
          />
        )}
        {BLOG.isProd && BLOG?.analytics?.provider === 'ga' && <Gtag />}
        <Component {...pageProps} />
    </GlobalContextProvider>
  )
}

export default MyApp
