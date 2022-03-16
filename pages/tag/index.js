import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React from 'react'
import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'

const TagIndex = (props) => {
  const { theme } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  return <ThemeComponents.LayoutTagIndex {...props} />
}

export async function getStaticProps () {
  const from = 'tag-index-props'
  const { categories, tags, postCount, latestPosts, customNav } = await getGlobalNotionData({ from, tagsCount: 0 })

  return {
    props: {
      tags,
      categories,
      postCount,
      latestPosts,
      customNav
    },
    revalidate: 1
  }
}

export default TagIndex
