import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { BlogPostCard } from './BlogPostCard'
import PaginationNumber from './PaginationNumber'

/**
 * BlogListPage Component - Paginated List
 */
export const BlogListPage = ({ posts = [], page = 1, postCount }) => {
  const { NOTION_CONFIG } = useGlobal()
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', 12, NOTION_CONFIG)
  const totalPage = Math.ceil(postCount / POSTS_PER_PAGE)

  return (
    <div className="w-full">
      <div id="posts-wrapper">
        {posts?.map((post) => (
          <BlogPostCard key={post.id} post={post} showSummary={true} />
        ))}
      </div>

      {/* Pagination */}
      {totalPage > 1 && (
        <PaginationNumber page={page} totalPage={totalPage} />
      )}
    </div>
  )
}
