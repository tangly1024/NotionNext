import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import BlogPostListPage from './components/BlogPostListPage'
import LayoutBase from './LayoutBase'

export const LayoutSearch = (props) => {
  const { posts } = props
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
  return <LayoutBase {...props} meta={meta}>
    <BlogPostListPage {...props} posts={filteredPosts}/>
  </LayoutBase>
}

function getSearchKey () {
  const router = useRouter()
  if (router.query && router.query.s) {
    return router.query.s
  }
  return null
}
