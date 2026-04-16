import BLOG from '@/blog.config'
import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { compactPostForCard, compactPostForLatest } from '@/lib/utils/compactPost'
import { DynamicLayout } from '@/themes/theme'

/**
 * 标签下的文章列表
 * @param {*} props
 * @returns
 */
const Tag = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutPostList' {...props} />
}

export async function getStaticProps({ params: { tag }, locale }) {
  const from = 'tag-props'
  const props = await getGlobalData({ from, locale })

  // 过滤状态
  props.posts = props.allPages
    ?.filter(page => page.type === 'Post' && page.status === 'Published')
    .filter(post => post && post?.tags && post?.tags.includes(tag))

  // 处理文章页数
  props.postCount = props.posts.length

  // 处理分页
  if (siteConfig('POST_LIST_STYLE') === 'scroll') {
    // 滚动列表 给前端返回所有数据
  } else if (siteConfig('POST_LIST_STYLE') === 'page') {
    props.posts = props.posts?.slice(
      0,
      siteConfig('POSTS_PER_PAGE', 12, props?.NOTION_CONFIG)
    )
  }
  props.posts = props.posts?.map(post => compactPostForCard(post))
  props.latestPosts = props.latestPosts?.map(post => compactPostForLatest(post))
  props.allNavPages = []

  props.tag = tag
  delete props.allPages
  return buildStaticPropsResult(props, ISR_LIST_REVALIDATE)
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export default Tag
