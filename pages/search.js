import { getAllCategories, getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import BaseLayout from '@/layouts/BaseLayout'
import StickyBar from '@/components/StickyBar'
import BlogPostListScroll from '@/components/BlogPostListScroll'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { getNotionPageData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'

export async function getStaticProps () {
  const from = 'search-props'
  const notionPageData = await getNotionPageData({ from })
  const allPosts = await getAllPosts({ notionPageData, from })
  const categories = await getAllCategories(allPosts)
  const tagOptions = notionPageData.tagOptions
  const tags = await getAllTags({ allPosts, tagOptions })

  return {
    props: {
      allPosts,
      tags,
      categories
    },
    revalidate: 1
  }
}

const Search = ({ allPosts, tags, categories }) => {
  // 处理查询过滤 支持标签、关键词过滤
  let filteredPosts = []
  const searchKey = getSearchKey()
  if (searchKey) {
    filteredPosts = allPosts.filter(post => {
      const tagContent = post.tags ? post.tags.join(' ') : ''
      const searchContent = post.title + post.summary + tagContent
      return searchContent.toLowerCase().includes(searchKey.toLowerCase())
    })
  }
  const { locale } = useGlobal()
  const meta = {
    title: `${locale.NAV.SEARCH} ${searchKey}| ${BLOG.title}  `,
    description: BLOG.description,
    type: 'website'
  }
  return (
    <BaseLayout meta={meta} tags={tags} totalPosts={allPosts} currentSearch={searchKey} categories={categories}>
        <StickyBar>
          <div className='p-4 dark:text-gray-200'><FontAwesomeIcon icon={faSearch} className='mr-1'/> {locale.NAV.SEARCH}： {searchKey}</div>
        </StickyBar>
        <div className='md:mt-5'>
         <BlogPostListScroll posts={filteredPosts} tags={tags} currentSearch={searchKey} />
        </div>
    </BaseLayout>
  )
}

export function getSearchKey () {
  const router = useRouter()
  if (router.query && router.query.s) {
    return router.query.s
  }
  return null
}
export default Search
