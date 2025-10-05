import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData, getPostBlocks } from '@/lib/db/getSiteData'
import { DynamicLayout } from '@/themes/theme'
import CONFIG_NEXT from '@/themes/next/config'
import { sortPostsByTopTag } from '@/lib/utils/post'

/**
 * 文章列表分页
 * @param {*} props
 * @returns
 */
const Page = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutPostList' {...props} />
}

export async function getStaticPaths({ locale }) {
  const from = 'page-paths'
  const { postCount, NOTION_CONFIG } = await getGlobalData({ from, locale })
  const totalPages = Math.ceil(
    postCount / siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  )
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: totalPages - 1 }, (_, i) => ({
      params: { page: '' + (i + 2) }
    })),
    fallback: true
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

  // NEXT 主题：按置顶标签重排
  const currentTheme = siteConfig('THEME', BLOG.THEME, props?.NOTION_CONFIG)
  const defaultNextTopTag = siteConfig('NEXT_TOP_TAG', '', CONFIG_NEXT)
  const nextTopTag = siteConfig('NEXT_TOP_TAG', defaultNextTopTag, props?.NOTION_CONFIG)
  const sortedPosts = currentTheme === 'next' && nextTopTag
    ? sortPostsByTopTag(allPosts, nextTopTag)
    : allPosts
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', 12, props?.NOTION_CONFIG)
  // 处理分页
  props.posts = sortedPosts.slice(
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
      post.blockMap = await getPostBlocks(post.id, 'slug', POST_PREVIEW_LINES)
    }
  }

  delete props.allPages
  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default Page
