import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React from 'react'
import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'
import BLOG from '@/blog.config'

/**
 * 分类首页
 * @param {*} props
 * @returns
 */
export default function Category(props) {
  const { theme } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  const { locale } = useGlobal()
  const { siteInfo } = props
  const meta = {
    title: `${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'category',
    type: 'website'
  }
  return <ThemeComponents.LayoutCategoryIndex {...props} meta={meta} />
}

export async function getStaticProps() {
  const props = await getGlobalNotionData({ from: 'category-index-props' })
  delete props.allPages
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  }
}
