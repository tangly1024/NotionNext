import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React from 'react'
import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'

export default function Category(props) {
  const { theme } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  const { siteInfo, posts } = props
  const { locale } = useGlobal()
  if (!posts) {
    return <ThemeComponents.Layout404 {...props} />
  }
  const meta = {
    title: `${props.category} | ${locale.COMMON.CATEGORY} | ${
      siteInfo?.title || ''
    }`,
    description: siteInfo?.description,
    slug: 'category/' + props.category,
    image: siteInfo?.pageCover,
    type: 'website'
  }
  return <ThemeComponents.LayoutCategory {...props} meta={meta} />
}

export async function getStaticProps({ params: { category } }) {
  const from = 'category-props'
  let props = await getGlobalNotionData({ from })
  const posts = props.allPosts.filter(
    post => post && post.category && post.category.includes(category)
  )
  props = { ...props, posts, category }

  return {
    props,
    revalidate: 1
  }
}

export async function getStaticPaths() {
  const from = 'category-paths'
  const { categories } = await getGlobalNotionData({ from })
  return {
    paths: Object.keys(categories).map(category => ({
      params: { category: categories[category]?.name }
    })),
    fallback: true
  }
}
