import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import * as ThemeMap from '@/themes'

const Search = props => {
  const { posts, siteInfo } = props
  let filteredPosts
  const searchKey = getSearchKey()
  // 静态过滤
  if (searchKey) {
    filteredPosts = posts.filter(post => {
      const tagContent = post.tags ? post.tags.join(' ') : ''
      const categoryContent = post.category ? post.category.join(' ') : ''
      const searchContent =
        post.title + post.summary + tagContent + categoryContent
      return searchContent.toLowerCase().includes(searchKey.toLowerCase())
    })
  } else {
    filteredPosts = posts
  }

  const { locale } = useGlobal()
  const meta = {
    title: `${searchKey || ''}${searchKey ? ' | ' : ''}${locale.NAV.SEARCH} | ${
      siteInfo?.title
    }`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'search',
    type: 'website'
  }

  const { theme } = useGlobal()
  const ThemeComponents = ThemeMap[theme]

  return (
    <ThemeComponents.LayoutSearch
      {...props}
      posts={filteredPosts}
      currentSearch={searchKey}
      meta={meta}
    />
  )
}

/**
 * 浏览器前端搜索
 */
export async function getStaticProps() {
  const props = await getGlobalNotionData({
    from: 'search-props',
    pageType: ['Post']
  })
  props.posts = props.allPosts
  return {
    props,
    revalidate: 1
  }
}

function getSearchKey() {
  const router = useRouter()
  if (router.query && router.query.s) {
    return router.query.s
  }
  return null
}

export default Search
