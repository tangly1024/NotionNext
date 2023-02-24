import BLOG from 'blog.config'
import 'animate.css'
import '@/styles/globals.css'
// custom
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
import '@/styles/notion.css' //  重写部分样式

// used for collection views (optional)
// import 'rc-dropdown/assets/index.css'
// import 'prismjs/themes/prism-tomorrow.min.css'
import 'prism-themes/themes/prism-one-dark.css'
import '@/styles/prism-mac-style.css' //  將 Prism 加入 mac 視窗樣式

// import 'react-notion-x/build/third-party/equation.css'
import 'katex/dist/katex.min.css'

// waline 评论插件
import '@waline/client/dist/waline.css'

import { GlobalContextProvider } from '@/lib/global'
import { DebugPanel } from '@/components/DebugPanel'

const MyApp = ({ Component, pageProps }) => {
  // 外部插
  const externalPlugins = <>
        {JSON.parse(BLOG.DEBUG) && <DebugPanel />}
    </>

  // 延迟加载fontAwesome
  React.useEffect(() => {
    loadExternalResource(BLOG.FONT_AWESOME_PATH, 'css')
  }, [])

  return (
        <GlobalContextProvider>
            {externalPlugins}
            <Component {...pageProps} />
        </GlobalContextProvider>
  )
}

export default MyApp
