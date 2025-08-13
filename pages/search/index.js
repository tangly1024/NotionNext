import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { DynamicLayout } from '@/themes/theme'
import { useRouter } from 'next/router'
import CONFIG_NEXT from '@/themes/next/config'
import { sortPostsByTopTag } from '@/lib/utils/post'

/**
 * 搜索路由
 * @param {*} props
 * @returns
 */
const Search = props => {
  const { posts } = props

  const router = useRouter()
  const keyword = router?.query?.s

  let filteredPosts
  // 静态过滤
  if (keyword) {
    filteredPosts = posts.filter(post => {
      const tagContent = post?.tags ? post?.tags.join(' ') : ''
      const categoryContent = post.category ? post.category.join(' ') : ''
      const searchContent =
        post.title + post.summary + tagContent + categoryContent
      return searchContent.toLowerCase().includes(keyword.toLowerCase())
    })
  } else {
    filteredPosts = []
  }

  props = { ...props, posts: filteredPosts }

  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutSearch' {...props} />
}

/**
 * 浏览器前端搜索
 */
export async function getStaticProps({ locale }) {
  const props = await getGlobalData({
    from: 'search-props',
    locale
  })
  const { allPages } = props
  const allPosts = allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )
  // NEXT 主题：按置顶标签重排
  const currentTheme = siteConfig('THEME', BLOG.THEME, props?.NOTION_CONFIG)
  const nextTopTag = siteConfig('NEXT_TOP_TAG', null, CONFIG_NEXT)
  props.posts = currentTheme === 'next' && nextTopTag
    ? sortPostsByTopTag(allPosts, nextTopTag)
    : allPosts
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

export default Search
