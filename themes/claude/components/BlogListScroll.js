import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BlogItem } from './BlogItem'

/**
 * 滚动博客列表
 * @param {*} props
 * @returns
 */
export default function BlogListScroll(props) {
  const { posts } = props
  const { locale, NOTION_CONFIG } = useGlobal()
  const [page, updatePage] = useState(1)
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  const safePosts = Array.isArray(posts) ? posts : []
  const postsToShow = safePosts.slice(0, POSTS_PER_PAGE * page)
  const hasMore = page * POSTS_PER_PAGE < safePosts.length

  const targetRef = useRef(null)
  const hasMoreRef = useRef(hasMore)

  useEffect(() => {
    hasMoreRef.current = hasMore
  }, [hasMore])

  const handleGetMore = useCallback(() => {
    if (!hasMoreRef.current) return
    updatePage(prev => prev + 1)
  }, [])

  // 监听滚动自动分页加载
  const scrollTrigger = useMemo(
    throttle(() => {
      const scrollS = window.scrollY + window.innerHeight
      const clientHeight = targetRef.current?.clientHeight ?? 0
      if (scrollS > clientHeight + 100) {
        handleGetMore()
      }
    }, 500),
    [handleGetMore]
  )

  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger)

    return () => {
      window.removeEventListener('scroll', scrollTrigger)
      scrollTrigger.cancel?.()
    }
  }, [scrollTrigger])

  return (
    <div id='posts-wrapper' className='w-full md:pr-8 mb-12' ref={targetRef}>
      {postsToShow.map(p => (
        <BlogItem key={p.id} post={p} />
      ))}

      <div
        onClick={handleGetMore}
        className='w-full my-4 py-4 text-center cursor-pointer '>
        {' '}
        {hasMore ? locale.COMMON.MORE : `${locale.COMMON.NO_MORE} 😰`}{' '}
      </div>
    </div>
  )
}
