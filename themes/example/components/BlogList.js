
import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import Link from 'next/link'

export const BlogList = (props) => {
  const { posts, postCount } = props

  const { locale } = useGlobal()
  const router = useRouter()
  const totalPage = Math.ceil(postCount / BLOG.POSTS_PER_PAGE)

  const page = 1
  const showNext =
        page < totalPage &&
        posts.length === BLOG.POSTS_PER_PAGE &&
        posts.length < postCount

  const currentPage = +page

  return <div className="w-full md:pr-12 mb-12">

        {posts.map(p => (
            <article key={p.id} className="mb-12" >
                <h2 className="mb-4">
                    <Link href={`/article/${p.slug}`}>
                        <a className="text-black text-xl md:text-2xl no-underline hover:underline">  {p.title}</a>
                    </Link>
                </h2>

                <div className="mb-4 text-sm text-gray-700">
                    by <a href="#" className="text-gray-700">{BLOG.AUTHOR}</a> on {p.date?.start_date || p.createdTime}
                    <span className="font-bold mx-1"> | </span>
                    <a href="#" className="text-gray-700">{p.category}</a>
                    <span className="font-bold mx-1"> | </span>
                    {/* <a href="#" className="text-gray-700">2 Comments</a> */}
                </div>

                <p className="text-gray-700 leading-normal">
                    {p.summary}
                </p>
            </article>
        ))}

        <div className="flex justify-between text-xs">
            <Link href="/">
                <a className={`${currentPage > 1 ? 'bg-black ' : 'bg-gray '} text-white no-underline py-2 px-3 rounded`}>{locale.PAGINATION.PREV}</a>
            </Link>
            <Link href={{ pathname: `/page/${currentPage + 1}`, query: router.query.s ? { s: router.query.s } : {} }}>
                <a className={`${showNext ? 'bg-black ' : 'bg-gray '} text-white no-underline py-2 px-3 rounded`}>{locale.PAGINATION.NEXT}</a>
            </Link>
        </div>
    </div>
}
