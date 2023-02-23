import BLOG from '@/blog.config'
import BlogPostCard from './BlogPostCard'
import BlogPostListEmpty from './BlogPostListEmpty'
import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import React from 'react'
import CONFIG_HEXO from '../config_hexo'
import { getListByPage } from '@/lib/utils'

/**
 * 博客列表滚动分页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListScroll = ({ posts = [], currentSearch, showSummary = CONFIG_HEXO.POST_LIST_SUMMARY, siteInfo }) => {
  const postsPerPage = BLOG.POSTS_PER_PAGE
  const [page, updatePage] = React.useState(1)
  const postsToShow = getListByPage(posts, page, postsPerPage)

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
  const scrollTrigger = React.useCallback(throttle(() => {
    const scrollS = window.scrollY + window.outerHeight
    const clientHeight = targetRef ? (targetRef.current ? (targetRef.current.clientHeight) : 0) : 0
    if (scrollS > clientHeight + 100) {
      handleGetMore()
    }
  }, 500))

  // 监听滚动
  React.useEffect(() => {
    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  })

  const targetRef = React.useRef(null)
  const { locale } = useGlobal()

  if (!postsToShow || postsToShow.length === 0) {
    return <BlogPostListEmpty currentSearch={currentSearch} />
  } else {
    return <div id='container' ref={targetRef} className='w-full'>

      {/* 文章列表 */}
      <div className='flex flex-wrap space-y-1 lg:space-y-4 px-2'>
        {postsToShow.map(post => (
          <BlogPostCard key={post.id} post={post} index={posts.indexOf(post)} showSummary={showSummary} siteInfo={siteInfo}/>
        ))}
      </div>

      <div>
        <div onClick={() => { handleGetMore() }}
             className='w-full my-4 py-4 text-center cursor-pointer rounded-xl dark:text-gray-200'
        > {hasMore ? locale.COMMON.MORE : `${locale.COMMON.NO_MORE}`} </div>
      </div>
    </div>
  }
}

export default BlogPostListScroll
