import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { loadExternalResource } from '@/lib/utils'
import { siteConfig } from '@/lib/config'

const CusdisComponent = ({ frontMatter }) => {
  const router = useRouter()
  const { isDarkMode, lang } = useGlobal()
  const src = siteConfig('COMMENT_CUSDIS_SCRIPT_SRC')
  const i18nForCusdis = siteConfig('LANG').toLowerCase().indexOf('zh') === 0 ? siteConfig('LANG').toLowerCase() : siteConfig('LANG').toLowerCase().substring(0, 2)
  const langCDN = siteConfig('COMMENT_CUSDIS_LANG_SRC', `https://cusdis.com/js/widget/lang/${i18nForCusdis}.js`)

  //   处理cusdis主题
  useEffect(() => {
    loadCusdis()
  }, [isDarkMode, lang])

  const loadCusdis = async () => {
    await loadExternalResource(langCDN, 'js')
    await loadExternalResource(src, 'js')

    window?.CUSDIS?.initial()
  }

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
