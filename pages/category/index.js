import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React from 'react'
import { useGlobal } from '@/lib/global'

export default function Category (props) {
  const { ThemeComponents } = useGlobal()
  return <ThemeComponents.LayoutCategoryIndex {...props}/>
}

export async function getStaticProps () {
  const from = 'category-index-props'
  const { allPosts, categories, tags, postCount, latestPosts, customNav } = await getGlobalNotionData({ from, categoryCount: 0 })

  return {
    props: {
      tags,
      allPosts,
      categories,
      postCount,
      latestPosts,
      customNav
    },
    revalidate: 1
  }
}
