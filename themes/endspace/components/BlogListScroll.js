import { BlogPostCard } from './BlogPostCard'

/**
 * BlogListScroll Component - Infinite Scroll List
 */
export const BlogListScroll = ({ posts = [] }) => {
  return (
    <div className="w-full">
      <div id="posts-wrapper">
        {posts?.map((post) => (
          <BlogPostCard key={post.id} post={post} showSummary={true} />
        ))}
      </div>
    </div>
  )
}
