import { useGlobal } from '@/lib/global'
import { ReactCusdis } from 'react-cusdis'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const CusdisComponent = ({ frontMatter }) => {
  const { locale } = useGlobal()
  const router = useRouter()
  const { isDarkMode } = useGlobal()

  //   处理cusdis主题
  useEffect(() => {
    const cusdisThread = document?.getElementById('cusdis_thread')
    const cusdisIframe = cusdisThread?.getElementsByTagName('iframe')
    if (cusdisIframe) {
      const cusdisWrapper = cusdisIframe[0]?.contentDocument?.getElementById('root')
      if (isDarkMode) {
        cusdisWrapper?.classList?.remove('light')
        cusdisWrapper?.classList?.add('dark')
      } else {
        cusdisWrapper?.classList?.remove('dark')
        cusdisWrapper?.classList?.add('light')
      }
      if (!cusdisWrapper?.firstElementChild?.classList?.contains('dark:text-gray-100')) {
        cusdisWrapper?.firstElementChild?.classList?.add('dark:text-gray-100')
      }
    }
  })

  return <ReactCusdis
    lang={locale.LOCALE.toLowerCase()}
    attrs={{
      host: BLOG.COMMENT_CUSDIS_HOST,
      appId: BLOG.COMMENT_CUSDIS_APP_ID,
      pageId: frontMatter.id,
      pageTitle: frontMatter.title,
      pageUrl: BLOG.LINK + router.asPath
    }}
  />
}

export default CusdisComponent
