import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React from 'react'
import { useGlobal } from '@/lib/global'
import BLOG from '@/blog.config'
import dynamic from 'next/dynamic'
import Loading from '@/components/Loading'

/**
 * 标签首页
 * @param {*} props
 * @returns
 */
const TagIndex = props => {
  const { theme } = useGlobal()
  const { locale } = useGlobal()
  const { siteInfo } = props
  const meta = {
    title: `${locale.COMMON.TAGS} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'tag',
    type: 'website'
  }
  const LayoutTagIndex = dynamic(() => import(`@/themes/${theme}`).then(async (m) => { return m.LayoutTagIndex }), { ssr: true, loading: () => <Loading /> })
  return <LayoutTagIndex {...props} meta={meta} />
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
