import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import BLOG from '@/blog.config'
import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState } from 'react'
import Loading from '@/components/Loading'
/**
 * 加载默认主题
 */
const DefaultLayout = dynamic(() => import(`@/themes/${BLOG.THEME}/LayoutSearch`), { ssr: true })

const Search = props => {
  const { posts, siteInfo } = props
  const { theme } = useGlobal()
  const [Layout, setLayout] = useState(DefaultLayout)

  // 切换主题
  useEffect(() => {
    const loadLayout = async () => {
      setLayout(dynamic(() => import(`@/themes/${theme}/LayoutSearch`)))
    }
    loadLayout()
  }, [theme])

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

  props = { ...props, meta, posts: { filteredPosts } }

  return <Suspense fallback={<Loading/>}>
    <Layout {...props} />
  </Suspense>
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
