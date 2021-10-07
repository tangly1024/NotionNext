import BLOG from '@/blog.config'
import { useLocale } from '@/lib/locale'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Pagination = ({ page, showNext }) => {
  const locale = useLocale()
  const router = useRouter()
  const currentPage = +page
  return (
    <div className=' my-10 flex justify-between font-medium text-black dark:text-gray-100'>
      <Link
        href={
          {
            pathname: (currentPage - 1 === 1 ? `${BLOG.path || '/'}` : `/page/${currentPage - 1}`),
            query: router.query.s ? { s: router.query.s } : {}
          }
        }
      >
        <button
          rel='prev'
          className={`${currentPage === 1 ? 'invisible' : 'block'} duration-200 px-4 py-2 hover:border-black border-b-2 hover:font-bold`}
        >
          ← {locale.PAGINATION.PREV}
        </button>
      </Link>
      <Link href={
        {
          pathname: `/page/${currentPage + 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }
      }>
        <button
          rel='next'
          className={`${+showNext ? 'block' : 'invisible'} duration-200 px-4 py-2 hover:border-black border-b-2 hover:font-bold`}
        >
          {locale.PAGINATION.NEXT} →
        </button>
      </Link>
    </div>
  )
}

export default Pagination
