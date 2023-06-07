import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React, { Suspense, useEffect, useState } from 'react'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import BLOG from '@/blog.config'

import Loading from '@/components/Loading'

/**
 * 加载默认主题
 */
const DefaultLayout = dynamic(() => import(`@/themes/${BLOG.THEME}/LayoutCategoryIndex`), { ssr: true })

/**
 * 分类首页
 * @param {*} props
 * @returns
 */
export default function Category(props) {
  const { theme } = useGlobal()
  const { locale } = useGlobal()
  const { siteInfo } = props
  const [Layout, setLayout] = useState(DefaultLayout)

  // 切换主题
  useEffect(() => {
    const loadLayout = async () => {
      setLayout(dynamic(() => import(`@/themes/${theme}/LayoutCategoryIndex`)))
    }
    loadLayout()
  }, [theme])

  const meta = {
    title: `${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'category',
    type: 'website'
  }
  props = { ...props, meta }

  return <Suspense fallback={<Loading/>}>
    <Layout {...props} />
  </Suspense>
}

export async function getStaticProps() {
  const props = await getGlobalNotionData({ from: 'category-index-props' })
  delete props.allPages
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  }
}
