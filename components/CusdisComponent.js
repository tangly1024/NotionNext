import { useGlobal } from '@/lib/global'
import { ReactCusdis } from 'react-cusdis'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'

const CusdisComponent = ({ frontMatter }) => {
  const { locale } = useGlobal()
  const router = useRouter()

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
