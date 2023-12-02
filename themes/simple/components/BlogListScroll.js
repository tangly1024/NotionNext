import { useGlobal } from '@/lib/global'
import { useCallback, useEffect, useRef, useState } from 'react'
import throttle from 'lodash.throttle'
import { BlogItem } from './BlogItem'
import { siteConfig } from '@/lib/config'

/**
 * 滚动博客列表
 * @param {*} props
 * @returns
 */
export default function BlogListScroll (props) {
  const { posts } = props
  const { locale } = useGlobal()

  const [page, updatePage] = useState(1)

  let hasMore = false
  const postsToShow = posts
    ? Object.assign(posts).slice(0, parseInt(siteConfig('POSTS_PER_PAGE')) * page)
    : []

  if (posts) {
    const totalCount = posts.length
    hasMore = page * parseInt(siteConfig('POSTS_PER_PAGE')) < totalCount
  }
  const handleGetMore = () => {
    if (!hasMore) return
    updatePage(page + 1)
  }

  const targetRef = useRef(null)

  // 监听滚动自动分页加载
  const scrollTrigger = useCallback(throttle(() => {
    const scrollS = window.scrollY + window.outerHeight
    const clientHeight = targetRef ? (targetRef.current ? (targetRef.current.clientHeight) : 0) : 0
    if (scrollS > clientHeight + 100) {
      handleGetMore()
    }
  }, 500))

  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger)

    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  })

  return (
      <div id="posts-wrapper" className="w-full md:pr-8 mb-12" ref={targetRef}>
              {postsToShow.map(p => (
                  <BlogItem key={p.id} post={p}/>
              ))}

              <div onClick={handleGetMore}
                   className="w-full my-4 py-4 text-center cursor-pointer ">
                  {' '}
                  {hasMore ? locale.COMMON.MORE : `${locale.COMMON.NO_MORE} 😰`}{' '}
              </div>

          </div>
  )
}
