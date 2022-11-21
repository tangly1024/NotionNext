import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React from 'react'
import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'
import { getAllTags } from '@/lib/notion'

/**
 * 标签首页
 * @param {*} props
 * @returns
 */
const TagIndex = props => {
  const { theme } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  const { locale } = useGlobal()
  const { siteInfo } = props
  const meta = {
    title: `${locale.COMMON.TAGS} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'tag',
    type: 'website'
  }
  return <ThemeComponents.LayoutTagIndex {...props} meta={meta} />
}

export async function getStaticProps() {
  const from = 'tag-index-props'
  const props = await getGlobalNotionData({ from })
  props.tags = getAllTags({ allPages: props.allPages, sliceCount: 0, tagOptions: props.tagOptions })
  delete props.tagOptions
  return {
    props,
    revalidate: 1
  }
}

export default TagIndex
