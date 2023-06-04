import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React from 'react'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import BLOG from '@/blog.config'

/**
 * 分类首页
 * @param {*} props
 * @returns
 */
export default function Category(props) {
  const { theme } = useGlobal()
  const { locale } = useGlobal()
  const { siteInfo } = props
  const meta = {
    title: `${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'category',
    type: 'website'
  }
  const LayoutCategoryIndex = dynamic(() => import(`@/themes/${theme}/LayoutCategoryIndex`).then(async (m) => { return m.LayoutCategoryIndex }), { ssr: false })
  return <LayoutCategoryIndex {...props} meta={meta} />
}

export async function getStaticProps() {
  const props = await getGlobalNotionData({ from: 'category-index-props' })
  delete props.allPages
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  }
}
