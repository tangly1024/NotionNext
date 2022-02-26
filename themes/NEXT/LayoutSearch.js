import LayoutBase from './LayoutBase'
import StickyBar from './components/StickyBar'
import BlogPostListScroll from './components/BlogPostListScroll'
import { useGlobal } from '@/lib/global'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'

export const LayoutSearch = ({ posts, tags, categories, postCount }) => {
  let filteredPosts
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
    title: `${searchKey || ''} | ${locale.NAV.SEARCH} | ${BLOG.TITLE}  `,
    description: BLOG.DESCRIPTION,
    type: 'website'
  }
  return (
    <LayoutBase
      meta={meta}
      tags={tags}
      postCount={postCount}
      currentSearch={searchKey}
      categories={categories}
    >
      <StickyBar>
        <div className="p-4 dark:text-gray-200">
          <i className="mr-1 fas fa-search" />{' '}
          {filteredPosts.length} {locale.COMMON.RESULT_OF_SEARCH}
        </div>
      </StickyBar>
      <div className="md:mt-5">
        <BlogPostListScroll posts={filteredPosts} tags={tags} showSummary={true}/>
      </div>
    </LayoutBase>
  )
}

function getSearchKey () {
  const router = useRouter()
  if (router.query && router.query.s) {
    return router.query.s
  }
  return null
}
