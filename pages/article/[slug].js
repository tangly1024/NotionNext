import BLOG from '@/blog.config'
import { getPostBlocks } from '@/lib/notion'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'

/**
 * 根据notion的slug访问页面
 * @param {*} props
 * @returns
 */
const Slug = (props) => {
  const { theme } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  if (!props.post) {
    return <ThemeComponents.Layout404 {...props}/>
  }
  return <ThemeComponents.LayoutSlug {...props} showArticleInfo={true}/>
}

export async function getStaticPaths () {
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

export async function getStaticProps ({ params: { slug } }) {
  const from = `slug-props-${slug}`
  const { customNav, allPosts, categories, tags, postCount, latestPosts } =
    await getGlobalNotionData({ from, pageType: ['Post'] })

  const post = allPosts.find(p => p.slug === slug)

  if (!post) {
    return { props: {}, revalidate: 1 }
  }

  post.blockMap = await getPostBlocks(post.id, 'slug')

  const index = allPosts.indexOf(post)
  const prev = allPosts.slice(index - 1, index)[0] ?? allPosts.slice(-1)[0]
  const next = allPosts.slice(index + 1, index + 2)[0] ?? allPosts[0]

  const recommendPosts = getRecommendPost(post, allPosts, BLOG.POST_RECOMMEND_COUNT)

  return {
    props: {
      post,
      tags,
      prev,
      next,
      recommendPosts,
      categories,
      postCount,
      latestPosts,
      customNav
    },
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
function getRecommendPost (post, allPosts, count = 6) {
  let recommendPosts = []
  const postIds = []
  const currentTags = post.tags
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
