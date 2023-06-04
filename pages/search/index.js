import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import BLOG from '@/blog.config'
import dynamic from 'next/dynamic'
import Loading from '@/components/Loading'

const Search = props => {
  const { posts, siteInfo } = props
  const router = useRouter()
  let filteredPosts
  const keyword = getSearchKey(router)
  // 静态过滤
  if (keyword) {
    filteredPosts = posts.filter(post => {
      const tagContent = post.tags ? post.tags.join(' ') : ''
      const categoryContent = post.category ? post.category.join(' ') : ''
      const searchContent =
                post.title + post.summary + tagContent + categoryContent
      return searchContent.toLowerCase().includes(keyword.toLowerCase())
    })
  } else {
    filteredPosts = []
  }

  const { locale } = useGlobal()
  const meta = {
    title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'search',
    type: 'website'
  }

  const { theme } = useGlobal()

  const LayoutSearch = dynamic(() => import(`@/themes/${theme}/LayoutSearch`).then(async (m) => { return m.LayoutSearch }), { ssr: false, loading: () => <Loading /> })
  return <LayoutSearch {...props} posts={filteredPosts} currentSearch={keyword} meta={meta} />
}

/**
 * 浏览器前端搜索
 */
export async function getStaticProps() {
  const props = await getGlobalNotionData({
    from: 'search-props',
    pageType: ['Post']
  })
  const { allPages } = props
  props.posts = allPages.filter(page => page.type === 'Post' && page.status === 'Published')
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  }
}

function getSearchKey(router) {
  if (router.query && router.query.s) {
    return router.query.s
  }
  return null
}

export default Search
