import { useGlobal } from '@/lib/global'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import * as ThemeMap from '@/themes'
import BLOG from '@/blog.config'

const Tag = props => {
  const { theme } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  const { locale } = useGlobal()
  const { tag, siteInfo, posts } = props

  if (!posts) {
    return <ThemeComponents.Layout404 {...props} />
  }

  const meta = {
    title: `${tag} | ${locale.COMMON.TAGS} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'tag/' + tag,
    type: 'website'
  }
  return <ThemeComponents.LayoutTag {...props} meta={meta} />
}

export async function getStaticProps({ params: { tag, page } }) {
  const from = 'tag-page-props'
  const props = await getGlobalNotionData({ from })
  // 过滤状态、标签
  props.posts = props.allPages.filter(page => page.type === 'Post' && page.status === 'Published').filter(post => post && post.tags && post.tags.includes(tag))
  // 处理文章数
  props.postCount = props.posts.length
  // 处理分页
  props.posts = props.posts.slice(BLOG.POSTS_PER_PAGE * (page - 1), BLOG.POSTS_PER_PAGE * page)

  props.tag = tag
  props.page = page
  delete props.allPages
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  }
}

export async function getStaticPaths() {
  const from = 'tag-page-static-path'
  const { tagOptions, allPages } = await getGlobalNotionData({ from })
  const paths = []
  tagOptions?.forEach(tag => {
    // 过滤状态类型
    const tagPosts = allPages.filter(page => page.type === 'Post' && page.status === 'Published').filter(post => post && post.tags && post.tags.includes(tag.name))
    // 处理文章页数
    const postCount = tagPosts.length
    const totalPages = Math.ceil(postCount / BLOG.POSTS_PER_PAGE)
    if (totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        paths.push({ params: { tag: tag.name, page: '' + i } })
      }
    }
  })
  return {
    paths: paths,
    fallback: true
  }
}

export default Tag
