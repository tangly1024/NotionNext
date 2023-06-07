import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { Suspense, useEffect, useState } from 'react'
import { useGlobal } from '@/lib/global'
import BLOG from '@/blog.config'
import dynamic from 'next/dynamic'
import Loading from '@/components/Loading'
/**
 * 默认主题
 */
const DefaultLayout = dynamic(() => import(`@/themes/${BLOG.THEME}/LayoutTagIndex`), { ssr: true })

/**
 * 标签首页
 * @param {*} props
 * @returns
 */
const TagIndex = props => {
  const { locale } = useGlobal()
  const { siteInfo } = props
  const { theme } = useGlobal()
  const [Layout, setLayout] = useState(DefaultLayout)
  // 切换主题
  useEffect(() => {
    const loadLayout = async () => {
      setLayout(dynamic(() => import(`@/themes/${theme}/LayoutTagIndex`)))
    }
    loadLayout()
  }, [theme])

  const meta = {
    title: `${locale.COMMON.TAGS} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'tag',
    type: 'website'
  }
  props = { ...props, meta }

  return <Suspense fallback={<Loading/>}>
    <Layout {...props} />
  </Suspense>
}

export async function getStaticProps() {
  const from = 'tag-index-props'
  const props = await getGlobalNotionData({ from })
  delete props.allPages
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  }
}

export default TagIndex
