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

export async function getStaticProps({ params: { category } }) {
  const from = 'category-props'
  let props = await getGlobalNotionData({ from })

  // 过滤状态
  props.posts = props.allPages.filter(page => page.type === 'Post' && page.status === 'Published')
  // 处理过滤
  props.posts = props.posts.filter(post => post && post.category && post.category.includes(category))
  // 处理文章页数
  props.postCount = props.posts.length
  // 处理分页
  if (BLOG.POST_LIST_STYLE === 'scroll') {
    // 滚动列表 给前端返回所有数据
  } else if (BLOG.POST_LIST_STYLE === 'page') {
    props.posts = props.posts?.slice(0, BLOG.POSTS_PER_PAGE - 1)
  }

  delete props.allPages

  props = { ...props, category }

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
