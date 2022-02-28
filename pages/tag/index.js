import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React from 'react'
import { LayoutTagIndex } from '@/themes'

const TagIndex = (props) => {
  return <LayoutTagIndex {...props} />
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
