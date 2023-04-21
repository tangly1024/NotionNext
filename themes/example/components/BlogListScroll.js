import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import React from 'react'
import throttle from 'lodash.throttle'
import CONFIG_EXAMPLE from '../config_example'

export const BlogListScroll = props => {
  const { posts } = props
  const { locale } = useGlobal()

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

  const targetRef = React.useRef(null)

  // 监听滚动自动分页加载
  const scrollTrigger = React.useCallback(throttle(() => {
    const scrollS = window.scrollY + window.outerHeight
    const clientHeight = targetRef ? (targetRef.current ? (targetRef.current.clientHeight) : 0) : 0
    if (scrollS > clientHeight + 100) {
      handleGetMore()
    }
  }, 500))

  React.useEffect(() => {
    window.addEventListener('scroll', scrollTrigger)

    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  })

  const showPageCover = CONFIG_EXAMPLE.POST_LIST_COVER

  return (
      <div id="container" className="w-full md:pr-12 mb-12" ref={targetRef}>
              {postsToShow.map(p => (
                  <article key={p.id} className={`mb-12 ${showPageCover ? 'flex md:flex-row flex-col-reverse' : ''}`}>
                        <div className={`${showPageCover ? 'md:w-7/12' : ''}`}>
                            <h2 className="mb-4">
                                <Link
                                    href={`/${p.slug}`}
                                    className="text-black dark:text-gray-100 text-xl md:text-2xl no-underline hover:underline">
                                    {p.title}
                                </Link>
                            </h2>

                            <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                                by <a href="#" className="text-gray-700 dark:text-gray-300">{BLOG.AUTHOR}</a> on {p.date?.start_date || p.createdTime}
                                <span className="font-bold mx-1"> | </span>
                                <a href={`/category${p.category}`} className="text-gray-700 dark:text-gray-300 hover:underline">{p.category}</a>
                                {/* <span className="font-bold mx-1"> | </span> */}
                                {/* <a href="#" className="text-gray-700">2 Comments</a> */}
                            </div>

                            <p className="text-gray-700 dark:text-gray-400 leading-normal p-3-lines">
                                {p.summary}
                            </p>
                            {/* 搜索结果 */}
                            {p.results && (
                                <p className="p-4-lines mt-4 text-gray-700 dark:text-gray-300 text-sm font-light leading-7">
                                    {p.results.map(r => (
                                        <span key={r}>{r}</span>
                                    ))}
                                </p>
                            )}
                        </div>
                        {/* 图片封面 */}
                        {showPageCover && (
                            <div className="md:w-5/12 w-full overflow-hidden p-1">
                                <Link href={`${BLOG.SUB_PATH}/${p.slug}`} passHref legacyBehavior>
                                    <div className='h-44 bg-center bg-cover hover:scale-110 duration-200' style={{ backgroundImage: `url('${p?.page_cover}')` }} />
                                </Link>
                            </div>
                        )}
                    </article>
              ))}

              <div
                  onClick={handleGetMore}
                  className="w-full my-4 py-4 text-center cursor-pointer "
              >
                  {' '}
                  {hasMore ? locale.COMMON.MORE : `${locale.COMMON.NO_MORE} 😰`}{' '}
              </div>

          </div>
  )
}
