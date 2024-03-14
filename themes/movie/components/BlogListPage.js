import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import Link from 'next/link'
import CONFIG from '../config'
import BlogPostCard from './BlogPostCard'
import PaginationNumber from './PaginationNumber'

export const BlogListPage = props => {
  const { page = 1, posts, postCount } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const totalPage = Math.ceil(
    postCount / parseInt(siteConfig('POSTS_PER_PAGE'))
  )
  const currentPage = +page

  const showPrev = currentPage > 1
  const showNext = page < totalPage
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')

  const showPageCover = siteConfig('EXAMPLE_POST_LIST_COVER', null, CONFIG)

  return (
    <div className={`w-full ${showPageCover ? 'md:pr-2' : 'md:pr-12'} mb-12`}>
      <div
        id="posts-wrapper"
        className="grid md:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-20 xl:gap-24 2xl:grid-cols-4"
      >
        {posts?.map(post => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      <PaginationNumber {...props} />
    </div>
  )
}
