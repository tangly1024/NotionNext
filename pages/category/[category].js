import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React from 'react'
import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'

export default function Category (props) {
  const { theme } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  return <ThemeComponents.LayoutCategory {...props} />
}

export async function getStaticProps ({ params }) {
  const from = 'category-props'
  const category = params.category
  const {
    allPosts,
    categories,
    tags,
    postCount,
    latestPosts,
    customNav
  } = await getGlobalNotionData({ from })
  const filteredPosts = allPosts.filter(
    post => post && post.category && post.category.includes(category)
  )
  return {
    props: {
      tags,
      posts: filteredPosts,
      category,
      categories,
      postCount,
      latestPosts,
      customNav
    },
    revalidate: 1
  }
}

export async function getStaticPaths () {
  const from = 'category-paths'
  const { categories } = await getGlobalNotionData({ from })
  return {
    paths: Object.keys(categories).map(category => ({ params: { category: categories[category]?.name } })),
    fallback: true
  }
}
