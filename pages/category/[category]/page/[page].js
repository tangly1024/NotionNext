import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React from 'react'
import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'
import BLOG from '@/blog.config'

/**
 * 分类页
 * @param {*} props
 * @returns
 */
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

export async function getStaticProps({ params: { category, page } }) {
  const from = 'category-page-props'
  let props = await getGlobalNotionData({ from })

  // 过滤状态
  props.posts = props.allPages.filter(page => page.type === 'Post' && page.status === 'Published')
  // 过滤类型
  props.posts = props.posts.filter(post => post && post.category && post.category.includes(category))
  // 处理文章页数
  props.postCount = props.posts.length
  // 处理分页
  props.posts = props.posts.slice(BLOG.POSTS_PER_PAGE * (page - 1), BLOG.POSTS_PER_PAGE * page - 1)

  delete props.allPages
  props.page = page

  props = { ...props, category, page }

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
      params: { category: categories[category]?.name, page: '1' }
    })),
    fallback: true
  }
}
