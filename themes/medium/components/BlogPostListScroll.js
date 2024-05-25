import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import BlogPostCard from './BlogPostCard'
import BlogPostListEmpty from './BlogPostListEmpty'

/**
 * 博客列表滚动分页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListScroll = ({ posts = [], currentSearch }) => {
  const { NOTION_CONFIG } = useGlobal()
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', 12, NOTION_CONFIG)
  const [page, updatePage] = useState(1)
  const router = useRouter()
  let filteredPosts = Object.assign(posts)
  const searchKey = router?.query?.s || null
  if (searchKey) {
    filteredPosts = posts.filter(post => {
      const tagContent = post?.tags ? post?.tags.join(' ') : ''
      const searchContent = post.title + post.summary + tagContent
      return searchContent.toLowerCase().includes(searchKey.toLowerCase())
    })
  }
  const postsToShow = getPostByPage(page, filteredPosts, POSTS_PER_PAGE)

  let hasMore = false
  if (filteredPosts) {
    const totalCount = filteredPosts.length
    hasMore = page * POSTS_PER_PAGE < totalCount
  }

  const handleGetMore = () => {
    if (!hasMore) return
    updatePage(page + 1)
  }

  // 监听滚动自动分页加载
  const scrollTrigger = useCallback(
    throttle(() => {
      const scrollS = window.scrollY + window.outerHeight
      const clientHeight = targetRef
        ? targetRef.current
          ? targetRef.current.clientHeight
          : 0
        : 0
      if (scrollS > clientHeight + 100) {
        handleGetMore()
      }
    }, 500)
  )

  // 监听滚动
  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  })

  const targetRef = useRef(null)
  const { locale } = useGlobal()

  if (!postsToShow || postsToShow.length === 0) {
    return <BlogPostListEmpty currentSearch={currentSearch} />
  } else {
    return (
      <div id='posts-wrapper' ref={targetRef} className='w-full'>
        {/* 文章列表 */}
        <div className='space-y-1 lg:space-y-4'>
          {postsToShow?.map(post => (
            <BlogPostCard key={post.id} post={post} showSummary={true} />
          ))}
        </div>

        <div>
          <div
            onClick={() => {
              handleGetMore()
            }}
            className='w-full my-4 py-4 text-center cursor-pointer dark:text-gray-200'>
            {' '}
            {hasMore ? locale.COMMON.MORE : `${locale.COMMON.NO_MORE} 😰`}{' '}
          </div>
        </div>
      </div>
    )
  }
}

/**
 * 获取从第1页到指定页码的文章
 * @param page 第几页
 * @param totalPosts 所有文章
 * @param POSTS_PER_PAGE 每页文章数量
 * @returns {*}
 */
const getPostByPage = function (page, totalPosts, POSTS_PER_PAGE) {
  return totalPosts.slice(0, POSTS_PER_PAGE * page)
}

export default BlogPostListScroll
