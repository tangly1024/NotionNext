import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'
import LayoutBase from './LayoutBase'

export const LayoutPage = (props) => {
  const { page } = props
  const { posts, postCount } = props

  const { locale } = useGlobal()
  const router = useRouter()
  const totalPage = Math.ceil(postCount / BLOG.POSTS_PER_PAGE)

  const showNext = page < totalPage && posts.length === BLOG.POSTS_PER_PAGE && posts.length < postCount

  const currentPage = +page
  return (
    <LayoutBase {...props}>
      {posts.map(p => (
        <div key={p.id} className='border my-12'>
          <Link href={`/article/${p.slug}`}>
            <a className='underline cursor-pointer'>{p.title}</a>
          </Link>
          <div>{p.summary}</div>
        </div>
      ))}

    <div className='my-10 flex justify-between font-medium text-black dark:text-gray-100 space-x-2'>
     <Link
        href={ {
          pathname: (currentPage === 2 ? `${BLOG.PATH || '/'}` : `/page/${currentPage - 1}`), query: router.query.s ? { s: router.query.s } : {}
        } } passHref >
        <a
          rel='prev'
          className={`${currentPage === 1 ? 'invisible' : 'visible'} text-center w-full duration-200 px-4 py-2 hover:border-black border-b-2 hover:font-bold`}
        >
          ← {locale.PAGINATION.PREV}
        </a>
      </Link>
      <Link href={ { pathname: `/page/${currentPage + 1}`, query: router.query.s ? { s: router.query.s } : {} } } passHref>
        <a
          rel='next'
          className={`${showNext ? 'visible' : 'invisible'} text-center w-full duration-200 px-4 py-2 hover:border-black border-b-2 hover:font-bold`}
        >
          {locale.PAGINATION.NEXT} →
        </a>
      </Link>
    </div>
    </LayoutBase>
  )
}
