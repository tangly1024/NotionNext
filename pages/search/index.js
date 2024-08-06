import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { getLayoutByTheme } from '@/themes/theme'
import { useRouter } from 'next/router'

/**
 * 搜索路由
 * @param {*} props
 * @returns
 */
const Search = props => {
  const { posts } = props

  // 根据页面路径加载不同Layout文件
  const Layout = getLayoutByTheme({
    theme: siteConfig('THEME'),
    router: useRouter()
  })

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

  return <Layout {...props} />
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
  props.posts = allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )
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
