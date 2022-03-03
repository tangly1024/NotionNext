import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React from 'react'
import { LayoutCategoryIndex } from '@/themes'

export default function Category (props) {
  return <LayoutCategoryIndex {...props}/>
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
