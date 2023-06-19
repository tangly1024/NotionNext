import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React, { Suspense, useEffect, useState } from 'react'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import BLOG from '@/blog.config'
import Loading from '@/components/Loading'

const layout = 'LayoutCategory'
/**
 * 加载默认主题
 */
const DefaultLayout = dynamic(() => import(`@/themes/${BLOG.THEME}/${layout}`), { ssr: true })

/**
 * 分类页
 * @param {*} props
 * @returns
 */
export default function Category(props) {
  const { siteInfo } = props
  const { locale, theme } = useGlobal()
  const [Layout, setLayout] = useState(DefaultLayout)

  // 切换主题
  useEffect(() => {
    const loadLayout = async () => {
      const newLayout = await dynamic(() => import(`@/themes/${theme}/${layout}`))
      setLayout(newLayout)
    }
    loadLayout()
  }, [theme])

  const meta = {
    title: `${props.category} | ${locale.COMMON.CATEGORY} | ${
      siteInfo?.title || ''
    }`,
    description: siteInfo?.description,
    slug: 'category/' + props.category,
    image: siteInfo?.pageCover,
    type: 'website'
  }

  props = { ...props, meta }

  return <Suspense fallback={<Loading/>}>
    <Layout {...props} />
  </Suspense>
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
    props.posts = props.posts?.slice(0, BLOG.POSTS_PER_PAGE)
  }

  delete props.allPages

  props = { ...props, category }

  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  }
}

export async function getStaticPaths() {
  const from = 'category-paths'
  const { categoryOptions } = await getGlobalNotionData({ from })
  return {
    paths: Object.keys(categoryOptions).map(category => ({
      params: { category: categoryOptions[category]?.name }
    })),
    fallback: true
  }
}
