import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import BlogPostCard from './BlogPostCard'
import PaginationNumber from './PaginationNumber'

export const BlogListPage = props => {
  const { posts } = props
  const showPageCover = siteConfig('MOVIE_POST_LIST_COVER', null, CONFIG)

  return (
    <div className={`w-full ${showPageCover ? 'md:pr-2' : 'md:pr-12'} mb-12`}>
      <div
        id='posts-wrapper'
        className='grid md:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-20 xl:gap-24 2xl:grid-cols-4'>
        {posts?.map(post => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      <PaginationNumber {...props} />
    </div>
  )
}
