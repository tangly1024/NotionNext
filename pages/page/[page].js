import BLOG from '@/blog.config'
import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { siteConfig } from '@/lib/config'
import { getGlobalData, getPostBlocks } from '@/lib/db/getSiteData'
import { compactPostForCard, compactPostForLatest } from '@/lib/utils/compactPost'
import { DynamicLayout } from '@/themes/theme'

/**
 * 文章列表分页
 * @param {*} props
 * @returns
 */
const Page = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutPostList' {...props} />
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params: { page }, locale }) {
  const from = `page-${page}`
  const props = await getGlobalData({ from, locale })
  const { allPages } = props
  const POST_PREVIEW_LINES = siteConfig(
    'POST_PREVIEW_LINES',
    12,
    props?.NOTION_CONFIG
  )

  const allPosts = allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', 12, props?.NOTION_CONFIG)
  // 处理分页
  props.posts = allPosts.slice(
    POSTS_PER_PAGE * (page - 1),
    POSTS_PER_PAGE * page
  )
  props.page = page

  // 处理预览
  if (siteConfig('POST_LIST_PREVIEW', false, props?.NOTION_CONFIG)) {
    for (const i in props.posts) {
      const post = props.posts[i]
      if (post.password && post.password !== '') {
        continue
      }
      // 跳过fallback错误页面
      if (post.id === 'oops-page-fallback') {
        post.blockMap = { block: {} }
      } else {
        post.blockMap = await getPostBlocks(post.id, 'slug', POST_PREVIEW_LINES)
      }
    }
  }

  props.posts = props.posts.map(post =>
    post?.blockMap ? post : compactPostForCard(post)
  )
  props.latestPosts = props.latestPosts?.map(post => compactPostForLatest(post))
  props.allNavPages = []

  delete props.allPages
  return buildStaticPropsResult(props, ISR_LIST_REVALIDATE)
}

export default Page
