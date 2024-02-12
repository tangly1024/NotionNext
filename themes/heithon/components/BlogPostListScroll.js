import BlogPostCard from './BlogPostCard'
import BlogPostListEmpty from './BlogPostListEmpty'
import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { useCallback, useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

/**
 * 博客列表滚动分页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListScroll = ({ posts = [], currentSearch, showSummary = siteConfig('NEXT_POST_LIST_SUMMARY', null, CONFIG) }) => {
  const postsPerPage = parseInt(siteConfig('POSTS_PER_PAGE'))
  const [page, updatePage] = useState(1)
  const postsToShow = getPostByPage(page, posts, postsPerPage)

  let hasMore = false
  if (posts) {
    const totalCount = posts.length
    hasMore = page * postsPerPage < totalCount
  }

  const handleGetMore = () => {
    if (!hasMore) return
    updatePage(page + 1)
  }

  // 监听滚动自动分页加载
  const scrollTrigger = useCallback(throttle(() => {
    const scrollS = window.scrollY + window.outerHeight
    const clientHeight = targetRef ? (targetRef.current ? (targetRef.current.clientHeight) : 0) : 0
    if (scrollS > clientHeight + 100) {
      handleGetMore()
    }
  }, 500))

  // 监听滚动
  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  }, [])

  const targetRef = useRef(null)
  const { locale } = useGlobal()

  if (!postsToShow || postsToShow.length === 0) {
    return <BlogPostListEmpty currentSearch={currentSearch} />
  } else {
    return <div ref={targetRef}>

      {/* 文章列表 */}
      <div id='posts-wrapper' className='flex flex-wrap space-y-1 lg:space-y-4'>
        {postsToShow.map(post => (
          <BlogPostCard key={post.id} post={post} showSummary={showSummary} />
        ))}
      </div>

      <div>
        <div onClick={() => {
          handleGetMore()
        }}
          className='w-full my-4 py-4 text-center cursor-pointer glassmorphism shadow hover:shadow-xl duration-200 dark:text-gray-200'
        > {hasMore ? locale.COMMON.MORE : `${locale.COMMON.NO_MORE} 😰`} </div>
      </div>
    </div>
  }
}

/**
 * 获取从第1页到指定页码的文章
 * @param page 第几页
 * @param totalPosts 所有文章
 * @param postsPerPage 每页文章数量
 * @returns {*}
 */
const getPostByPage = function (page, totalPosts, postsPerPage) {
  return totalPosts.slice(
    0,
    postsPerPage * page
  )
}
export default BlogPostListScroll
