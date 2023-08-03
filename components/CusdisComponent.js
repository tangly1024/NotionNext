import { useGlobal } from '@/lib/global'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { loadExternalResource } from '@/lib/utils'

const CusdisComponent = ({ frontMatter }) => {
  const { locale } = useGlobal()
  const router = useRouter()
  const { isDarkMode } = useGlobal()

  //   处理cusdis主题
  useEffect(() => {
    loadExternalResource(BLOG.COMMENT_CUSDIS_SCRIPT_SRC, 'js').then(url => {
      const CUSDIS = window.CUSDIS
      CUSDIS?.initial()
    })
  }, [isDarkMode])

  return <div id="cusdis_thread"
        lang={locale.LOCALE.toLowerCase()}
        data-host={BLOG.COMMENT_CUSDIS_HOST}
        data-app-id={BLOG.COMMENT_CUSDIS_APP_ID}
        data-page-id={frontMatter.id}
        data-page-url={BLOG.LINK + router.asPath}
        data-page-title={frontMatter.title}
        data-theme={isDarkMode ? 'dark' : 'light'}
    ></div>
}

export default CusdisComponent
