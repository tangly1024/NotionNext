import BLOG from '@/blog.config'
import BlogPostListScroll from '@/components/BlogPostListScroll'
import StickyBar from '@/components/StickyBar'
import BaseLayout from '@/layouts/BaseLayout'
import { useGlobal } from '@/lib/global'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'

export async function getStaticProps () {
  const from = 'search-props'
  const { allPosts, categories, tags, postCount, latestPosts } =
    await getGlobalNotionData({ from })

  return {
    props: {
      posts: allPosts,
      tags,
      categories,
      postCount,
      latestPosts
    },
    revalidate: 1
  }
}

const Search = ({ posts, tags, categories, postCount, latestPosts }) => {
  let filteredPosts = []
  const searchKey = getSearchKey()
  if (searchKey) {
    filteredPosts = posts.filter(post => {
      const tagContent = post.tags ? post.tags.join(' ') : ''
      const searchContent = post.title + post.summary + tagContent
      return searchContent.toLowerCase().includes(searchKey.toLowerCase())
    })
  } else {
    filteredPosts = posts
  }

  const { locale } = useGlobal()
  const meta = {
    title: `${searchKey || ''} | ${locale.NAV.SEARCH} | ${BLOG.title}  `,
    description: BLOG.description,
    type: 'website'
  }
  return (
    <BaseLayout
      meta={meta}
      tags={tags}
      postCount={postCount}
      currentSearch={searchKey}
      categories={categories}
    >
      <StickyBar>
        <div className="p-4 dark:text-gray-200">
          <FontAwesomeIcon icon={faSearch} className="mr-1" />{' '}
           {filteredPosts.length} {locale.COMMON.RESULT_OF_SEARCH}
        </div>
      </StickyBar>
      <div className="md:mt-5">
        <BlogPostListScroll posts={filteredPosts} tags={tags} showSummary={true}/>
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
