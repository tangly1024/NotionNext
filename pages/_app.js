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


const MyApp = ({ Component, pageProps }) => {
  // 外部插
  const externalPlugins = <>
        {JSON.parse(BLOG.DEBUG) && <DebugPanel />}
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
