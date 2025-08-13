import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { DynamicLayout } from '@/themes/theme'
import CONFIG_NEXT from '@/themes/next/config'
import { sortPostsByTopTag } from '@/lib/utils/post'

/**
 * 分类页
 * @param {*} props
 * @returns
 */

export default function Category(props) {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutPostList' {...props} />
}

export async function getStaticProps({ params: { category, page } }) {
  const from = 'category-page-props'
  let props = await getGlobalData({ from })

  // 过滤状态类型
  props.posts = props.allPages
    ?.filter(page => page.type === 'Post' && page.status === 'Published')
    .filter(post => post && post.category && post.category.includes(category))

  // NEXT 主题：按置顶标签重排
  const currentTheme = siteConfig('THEME', BLOG.THEME, props?.NOTION_CONFIG)
  const defaultNextTopTag = siteConfig('NEXT_TOP_TAG', '', CONFIG_NEXT)
  const nextTopTag = siteConfig('NEXT_TOP_TAG', defaultNextTopTag, props?.NOTION_CONFIG)
  const sortedPosts = currentTheme === 'next' && nextTopTag
    ? sortPostsByTopTag(props.posts, nextTopTag)
    : props.posts
  // 处理文章页数
  props.postCount = props.posts.length
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', 12, props?.NOTION_CONFIG)
  // 处理分页
  props.posts = sortedPosts.slice(
    POSTS_PER_PAGE * (page - 1),
    POSTS_PER_PAGE * page
  )

  delete props.allPages
  props.page = page

  props = { ...props, category, page }

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

export async function getStaticPaths() {
  const from = 'category-paths'
  const { categoryOptions, allPages, NOTION_CONFIG } = await getGlobalData({
    from
  })
  const paths = []

  categoryOptions?.forEach(category => {
    // 过滤状态类型
    const categoryPosts = allPages
      ?.filter(page => page.type === 'Post' && page.status === 'Published')
      .filter(
        post => post && post.category && post.category.includes(category.name)
      )
    // 处理文章页数
    const postCount = categoryPosts.length
    const totalPages = Math.ceil(
      postCount / siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
    )
    if (totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        paths.push({ params: { category: category.name, page: '' + i } })
      }
    }
  })

  return {
    paths,
    fallback: true
  }
}
