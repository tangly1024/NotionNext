
import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import Link from 'next/link'

export const BlogListPage = props => {
  const { page = 1, posts, postCount } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const totalPage = Math.ceil(postCount / BLOG.POSTS_PER_PAGE)
  const currentPage = +page

  const showPrev = currentPage > 1
  const showNext = page < totalPage
  const pagePrefix = router.asPath.replace(/\/page\/[1-9]\d*/, '').replace(/\/$/, '')

  return (
      <div className="w-full md:pr-12 mb-12">

            <div id="container">
                {posts?.map(p => (
                    <article key={p.id} className="mb-12" >
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

                        <p className="text-gray-700 dark:text-gray-400 leading-normal">
                            {p.summary}
                        </p>
                            {/* 搜索结果 */}
                        {p.results && (
                            <p className="mt-4 text-gray-700 dark:text-gray-300 text-sm font-light leading-7">
                            {p.results.map(r => (
                                <span key={r}>{r}</span>
                            ))}
                            </p>
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
