import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React from 'react'
import { useGlobal } from '@/lib/global'
import BLOG from '@/blog.config'

/**
 * 分类首页
 * @param {*} props
 * @returns
 */
export default function Category(props) {
  const { locale } = useGlobal()
  const { siteInfo, Layout } = props

  const meta = {
    title: `${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'category',
    type: 'website'
  }
  props = { ...props, meta }

  return <Layout {...props} />
}

export async function getStaticProps() {
  const props = await getGlobalNotionData({ from: 'category-index-props' })
  delete props.allPages
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  }
}
