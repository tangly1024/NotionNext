
import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import Link from 'next/link'
import CONFIG_EXAMPLE from '../config_example'

export const BlogListPage = props => {
  const { page = 1, posts, postCount } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const totalPage = Math.ceil(postCount / BLOG.POSTS_PER_PAGE)
  const currentPage = +page

  const showPrev = currentPage > 1
  const showNext = page < totalPage
  const pagePrefix = router.asPath.replace(/\/page\/[1-9]\d*/, '').replace(/\/$/, '')

  const showPageCover = CONFIG_EXAMPLE.POST_LIST_COVER

  return (
        <div className={`w-full ${showPageCover ? 'md:pr-2' : 'md:pr-12'}} mb-12`}>

            <div id="container">
                {posts?.map(p => (
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
            </div>

            <div className="flex justify-between text-xs">
                <Link
                    href={{ pathname: currentPage - 1 === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${currentPage - 1}`, query: router.query.s ? { s: router.query.s } : {} }}
                    className={`${showPrev ? 'bg-black ' : 'bg-gray pointer-events-none '} text-white no-underline py-2 px-3 rounded`}>
                    {locale.PAGINATION.PREV}
                </Link>
                <Link
                    href={{ pathname: `${pagePrefix}/page/${currentPage + 1}`, query: router.query.s ? { s: router.query.s } : {} }}
                    className={`${showNext ? 'bg-black ' : 'bg-gray pointer-events-none '} text-white no-underline py-2 px-3 rounded`}>
                    {locale.PAGINATION.NEXT}
                </Link>
            </div>
        </div>
  )
}
