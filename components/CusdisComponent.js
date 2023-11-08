import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { loadExternalResource } from '@/lib/utils'
import { siteConfig } from '@/lib/config'

const CusdisComponent = ({ frontMatter }) => {
  const { lang } = useGlobal()
  const router = useRouter()
  const { isDarkMode } = useGlobal()
  const src = siteConfig('COMMENT_CUSDIS_SCRIPT_SRC')

  //   处理cusdis主题
  useEffect(() => {
    loadExternalResource(src, 'js').then(url => {
      const CUSDIS = window.CUSDIS
      CUSDIS?.initial()
    })
  }, [isDarkMode])

  return <div id="cusdis_thread"
        lang={lang.toLowerCase()}
        data-host={siteConfig('COMMENT_CUSDIS_HOST')}
        data-app-id={siteConfig('COMMENT_CUSDIS_APP_ID')}
        data-page-id={frontMatter.id}
        data-page-url={siteConfig('LINK') + router.asPath}
        data-page-title={frontMatter.title}
        data-theme={isDarkMode ? 'dark' : 'light'}
    ></div>
}

export default CusdisComponent
