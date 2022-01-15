import BaseLayout from './BaseLayout'
import StickyBar from './components/StickyBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import BlogPostListScroll from './components/BlogPostListScroll'
import { useGlobal } from '@/lib/global'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'

const SearchLayout = ({ posts, tags, categories, postCount }) => {
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

export default SearchLayout

function getSearchKey () {
  const router = useRouter()
  if (router.query && router.query.s) {
    return router.query.s
  }
  return null
}
