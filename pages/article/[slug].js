import BLOG from '@/blog.config'
import { getPostBlocks } from '@/lib/notion'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'
import React from 'react'
import { idToUuid } from 'notion-utils'
import { useRouter } from 'next/router'
import { isBrowser } from '@/lib/utils'

/**
 * 根据notion的slug访问页面
 * @param {*} props
 * @returns
 */
const Slug = props => {
  const { theme, changeLoadingState } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  const { post, siteInfo } = props

  if (!post) {
    changeLoadingState(true)
    const router = useRouter()
    setTimeout(() => {
      if (isBrowser()) {
        const article = document.getElementById('container')
        if (!article) {
          router.push('/404').then(() => {
            // console.warn('找不到页面', router.asPath)
          })
        }
      }
    }, 10000)
    const meta = { title: `${props?.siteInfo?.title || BLOG.TITLE} | loading`, image: siteInfo?.pageCover }
    return <ThemeComponents.LayoutSlug {...props} showArticleInfo={true} meta={meta} />
  }

  changeLoadingState(false)

  // 文章锁🔐
  const [lock, setLock] = React.useState(post?.password && post?.password !== '')
  React.useEffect(() => {
    if (post?.password && post?.password !== '') {
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

  props = { ...props, lock, setLock, validPassword }

  const meta = {
    title: `${post?.title} | ${siteInfo?.title}`,
    description: post?.summary,
    type: 'article',
    slug: 'article/' + post?.slug,
    image: post?.page_cover,
    category: post?.category?.[0],
    tags: post?.tags
  }

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
  const { allPosts } = await getGlobalNotionData({ from })
  return {
    paths: allPosts.map(row => ({ params: { slug: row.slug } })),
    fallback: true
  }
}

export async function getStaticProps({ params: { slug } }) {
  const from = `slug-props-${slug}`
  const props = await getGlobalNotionData({ from, pageType: ['Post'] })
  const allPosts = props.allPosts
  props.post = props.allPosts.find((p) => {
    return p.slug === slug || p.id === idToUuid(slug)
  })
  if (!props.post) {
    return { props, revalidate: 1 }
  }
  props.post.blockMap = await getPostBlocks(props.post.id, 'slug')

  const index = allPosts.indexOf(props.post)
  props.prev = allPosts.slice(index - 1, index)[0] ?? allPosts.slice(-1)[0]
  props.next = allPosts.slice(index + 1, index + 2)[0] ?? allPosts[0]
  props.recommendPosts = getRecommendPost(
    props.post,
    allPosts,
    BLOG.POST_RECOMMEND_COUNT
  )
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
  const currentTags = post.tags || []
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
