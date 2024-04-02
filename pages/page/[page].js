import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData, getPostBlocks } from '@/lib/db/getSiteData'
import { getLayoutByTheme } from '@/themes/theme'
import { useRouter } from 'next/router'

/**
 * 文章列表分页
 * @param {*} props
 * @returns
 */
const Page = props => {
  // 根据页面路径加载不同Layout文件
  const Layout = getLayoutByTheme({ theme: siteConfig('THEME'), router: useRouter() })

  return <Layout {...props} />
}

export async function getStaticPaths() {
  const from = 'page-paths'
  const { postCount } = await getGlobalData({ from })
  const totalPages = Math.ceil(postCount / siteConfig('POSTS_PER_PAGE'))
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: totalPages - 1 }, (_, i) => ({
      params: { page: '' + (i + 2) }
    })),
    fallback: true
  }
}

export async function getStaticProps({ params: { page } }) {
  const from = `page-${page}`
  const props = await getGlobalData({ from })
  const { allPages } = props
  const allPosts = allPages?.filter(page => page.type === 'Post' && page.status === 'Published')
  // 处理分页
  props.posts = allPosts.slice(siteConfig('POSTS_PER_PAGE') * (page - 1), siteConfig('POSTS_PER_PAGE') * page)
  props.page = page

  // 处理预览
  if (siteConfig('POST_LIST_PREVIEW')) {
    for (const i in props.posts) {
      const post = props.posts[i]
      if (post.password && post.password !== '') {
        continue
      }
      post.blockMap = await getPostBlocks(post.id, 'slug', siteConfig('POST_PREVIEW_LINES'))
    }
  }

  delete props.allPages
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  }
}

export default Page
