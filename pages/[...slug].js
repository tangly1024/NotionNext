import BLOG from '@/blog.config'
import { getPostBlocks } from '@/lib/notion'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'
import React from 'react'
import { idToUuid } from 'notion-utils'
import Router from 'next/router'
import { isBrowser } from '@/lib/utils'
import { getNotion } from '@/lib/notion/getNotion'

/**
 * 根据notion的slug访问页面
 * @param {*} props
 * @returns
 */
const Slug = props => {
  const { theme, changeLoadingState } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  const { post, siteInfo } = props
  const router = Router.useRouter()

  // 文章锁🔐
  const [lock, setLock] = React.useState(post?.password && post?.password !== '')

  React.useEffect(() => {
    changeLoadingState(false)
    if (post?.password && post?.password !== '') {
      setLock(true)
    } else {
      setLock(false)
    }
  }, [post])

  if (!post) {
    setTimeout(() => {
      if (isBrowser()) {
        const article = document.getElementById('container')
        if (!article) {
          router.push('/404').then(() => {
            console.warn('找不到页面', router.asPath)
          })
        }
      }
    }, 20 * 1000)
    const meta = { title: `${props?.siteInfo?.title || BLOG.TITLE} | loading`, image: siteInfo?.pageCover }
    return <ThemeComponents.LayoutSlug {...props} showArticleInfo={true} meta={meta} />
  }

  /**
   * 验证文章密码
   * @param {*} result
   */
  const validPassword = result => {
    if (result) {
      setLock(false)
    }
  }

  props = { ...props, lock, setLock, validPassword }

  const meta = {
    title: `${post?.title} | ${siteInfo?.title}`,
    description: post?.summary,
    type: post?.type,
    slug: post?.slug,
    image: post?.page_cover,
    category: post?.category?.[0],
    tags: post?.tags
  }

  Router.events.on('routeChangeComplete', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  return (
    <ThemeComponents.LayoutSlug {...props} showArticleInfo={true} meta={meta} />
  )
}

export async function getStaticPaths() {
  if (!BLOG.isProd) {
    return {
      paths: [],
      fallback: true
    }
  }

  const from = 'slug-paths'
  const { allPages } = await getGlobalNotionData({ from })
  return {
    paths: allPages.map(row => ({ params: { slug: [row.slug] } })),
    fallback: true
  }
}

export async function getStaticProps({ params: { slug } }) {
  // slug 是个数组
  const fullSlug = slug.join('/')
  const from = `slug-props-${fullSlug}`
  const props = await getGlobalNotionData({ from })
  props.post = props.allPages.find((p) => {
    return p.slug === fullSlug || p.id === idToUuid(fullSlug)
  })

  if (!props.post) {
    const pageId = slug.slice(-1)[0]
    if (pageId.length < 32) {
      return { props, revalidate: 1 }
    }
    const post = await getNotion(pageId)
    if (post) {
      props.post = post
    } else {
      return { props, revalidate: 1 }
    }
  } else {
    props.post.blockMap = await getPostBlocks(props.post.id, 'slug')
  }

  const allPosts = props.allPages.filter(page => page.type === 'Post' && page.status === 'Published')
  const index = allPosts.indexOf(props.post)
  props.prev = allPosts.slice(index - 1, index)[0] ?? allPosts.slice(-1)[0]
  props.next = allPosts.slice(index + 1, index + 2)[0] ?? allPosts[0]
  props.recommendPosts = getRecommendPost(
    props.post,
    allPosts,
    BLOG.POST_RECOMMEND_COUNT
  )
  delete props.allPages
  return {
    props,
    revalidate: 1
  }
}

/**
 * 获取文章的关联推荐文章列表，目前根据标签关联性筛选
 * @param post
 * @param {*} allPosts
 * @param {*} count
 * @returns
 */
function getRecommendPost(post, allPosts, count = 6) {
  let recommendPosts = []
  const postIds = []
  const currentTags = post?.tags || []
  for (let i = 0; i < allPosts.length; i++) {
    const p = allPosts[i]
    if (p.id === post.id || p.type.indexOf('Post') < 0) {
      continue
    }

    for (let j = 0; j < currentTags.length; j++) {
      const t = currentTags[j]
      if (postIds.indexOf(p.id) > -1) {
        continue
      }
      if (p.tags && p.tags.indexOf(t) > -1) {
        recommendPosts.push(p)
        postIds.push(p.id)
      }
    }
  }

  if (recommendPosts.length > count) {
    recommendPosts = recommendPosts.slice(0, count)
  }
  return recommendPosts
}

export default Slug
