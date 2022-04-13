import BLOG from '@/blog.config'
import { getPostBlocks } from '@/lib/notion'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'
import { useEffect, useState } from 'react'

/**
 * 根据notion的slug访问页面，针对类型为Page的页面
 * @param {*} props
 * @returns
 */
const Slug = props => {
  const { theme } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  const { post } = props
  if (!post) {
    return <ThemeComponents.Layout404 {...props} />
  }

  // 文章锁🔐
  const [lock, setLock] = useState(post.password && post.password !== '')
  useEffect(() => {
    if (post.password && post.password !== '') {
      setLock(true)
    } else {
      setLock(false)
    }
  }, [post])

  /**
   * 验证文章密码
   * @param {*} result
   */
  const validPassword = result => {
    if (result) {
      setLock(false)
    }
  }

  const { siteInfo } = props
  const meta = {
    title: `${post.title} | ${siteInfo.title}`,
    description: post.summary,
    type: 'article',
    image: post.page_cover,
    slug: post.slug,
    tags: post.tags
  }

  props = { ...props, meta, lock, setLock, validPassword }

  return <ThemeComponents.LayoutSlug {...props} showArticleInfo={false} />
}

export async function getStaticPaths() {
  if (!BLOG.isProd) {
    return {
      paths: [],
      fallback: true
    }
  }

  const from = 'slug-paths'
  const { allPosts } = await getGlobalNotionData({ from, pageType: ['Page'] })
  const filterPosts =
    allPosts?.filter(e => e?.slug?.indexOf('http') !== 0) || []

  return {
    paths: filterPosts.map(row => ({ params: { slug: row.slug } })),
    fallback: true
  }
}

export async function getStaticProps({ params: { slug } }) {
  const from = `slug-props-${slug}`
  const props = await getGlobalNotionData({ from, pageType: ['Page'] })
  const { allPosts } = props
  const post = allPosts.find(p => p.slug === slug)
  if (!post) {
    return { props: {}, revalidate: 1 }
  }

  try {
    post.blockMap = await getPostBlocks(post.id, 'slug')
  } catch (error) {
    console.error('获取文章详情失败', error)
  }

  props.post = post

  return {
    props,
    revalidate: 1
  }
}

export default Slug
