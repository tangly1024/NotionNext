import BLOG from '@/blog.config'
import { getPostBlocks } from '@/lib/notion'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'
import React from 'react'
import { useRouter } from 'next/router'
import { isBrowser } from '@/lib/utils'

/**
 * 根据notion的slug访问页面，针对类型为Page的页面
 * @param {*} props
 * @returns
 */
const Slug = props => {
  const { theme, changeLoadingState } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  const { post } = props

  if (!post) {
    changeLoadingState(true)
    const router = useRouter()
    setTimeout(() => {
      if (isBrowser()) {
        const article = document.getElementById('container')
        if (!article) {
          router.push('/404').then(() => {
            console.warn('找不到页面', router.asPath)
          })
        }
      }
    }, 5000)
    const meta = { title: `${props?.siteInfo?.title || BLOG.TITLE} | loading` }
    return <ThemeComponents.LayoutSlug {...props} showArticleInfo={true} meta={meta} />
  }

  changeLoadingState(false)

  // 文章锁🔐
  const [lock, setLock] = React.useState(post.password && post.password !== '')
  React.useEffect(() => {
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
    title: `${post?.title} | ${siteInfo?.title}`,
    description: post?.summary,
    type: 'article',
    slug: 'article/' + post?.slug,
    image: post?.page_cover,
    category: post?.category?.[0],
    tags: post?.tags
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
  const { allPages } = await getGlobalNotionData({ from, pageType: ['Page'] })

  return {
    paths: allPages.map(row => ({ params: { slug: row.slug } })),
    fallback: true
  }
}

export async function getStaticProps({ params: { slug } }) {
  const from = `slug-props-${slug}`
  const props = await getGlobalNotionData({ from, pageType: ['Page'] })
  const { allPages } = props
  const page = allPages?.find(p => p.slug === slug)
  if (!page) {
    return { props: {}, revalidate: 1 }
  }

  try {
    page.blockMap = await getPostBlocks(page.id, 'slug')
  } catch (error) {
    console.error('获取文章详情失败', error)
  }

  props.post = page

  return {
    props,
    revalidate: 1
  }
}

export default Slug
