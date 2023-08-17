import BLOG from '@/blog.config'
import React from 'react'
import BlogCard from './BlogCard'
import BlogPostListEmpty from './BlogListEmpty'
import { useGlobal } from '@/lib/global'

/**
 * 文章列表分页表格
 * @param page 当前页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const BlogListScroll = props => {
  const { posts = [], siteInfo } = props
  const { locale } = useGlobal()
  const targetRef = React.useRef(null)

  const [page, updatePage] = React.useState(1)

  let hasMore = false
  const postsToShow = posts
    ? Object.assign(posts).slice(0, BLOG.POSTS_PER_PAGE * page)
    : []

  if (posts) {
    const totalCount = posts.length
    hasMore = page * BLOG.POSTS_PER_PAGE < totalCount
  }
  const handleGetMore = () => {
    if (!hasMore) return
    updatePage(page + 1)
  }

  // 监听滚动自动分页加载
  const scrollTrigger = () => {
    requestAnimationFrame(() => {
      const scrollS = window.scrollY + window.outerHeight
      const clientHeight = targetRef ? (targetRef.current ? (targetRef.current.clientHeight) : 0) : 0
      if (scrollS > clientHeight + 100) {
        handleGetMore()
      }
    })
  }

  React.useEffect(() => {
    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  }, [])

  if (!posts || posts.length === 0) {
    return <BlogPostListEmpty />
  } else {
    return (
            <div id="posts-wrapper" ref={targetRef} className='grid-container' >
                {/* 文章列表 */}
                    {postsToShow?.map(post => (
            <div key={post.id} className='grid-item justify-center flex' style={{ breakInside: 'avoid' }}>
            <BlogCard index={posts.indexOf(post)} key={post.id} post={post} siteInfo={siteInfo} />
                        </div>
                    ))}

                <div className="w-full my-4 py-4 text-center cursor-pointer "
                    onClick={handleGetMore}>
                    {' '}
                    {hasMore ? locale.COMMON.MORE : `${locale.COMMON.NO_MORE} 😰`}{' '}
                </div>
            </div>
    )
  }
}

export default BlogListScroll
