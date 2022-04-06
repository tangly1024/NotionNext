import BLOG from '@/blog.config'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'

/**
 * 简易翻页插件
 * @param page 当前页码
 * @param showNext 是否有下一页
 * @returns {JSX.Element}
 * @constructor
 */
const PaginationSimple = ({ page, showNext }) => {
  const { locale } = useGlobal()
  const router = useRouter()
  const currentPage = +page
  return (
    <div className="my-10 flex justify-between font-medium text-black dark:text-gray-100 space-x-2">
      <Link
        href={{
          pathname:
            currentPage - 1 === 1
              ? `${BLOG.SUB_PATH || '/'}`
              : `/page/${currentPage - 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }}
        passHref
      >
        <button
          rel="prev"
          className={`${
            currentPage === 1 ? 'invisible' : 'block'
          } w-full duration-200 px-4 py-2 hover:border-black border-b-2 hover:font-bold`}
        >
          ← {locale.PAGINATION.PREV}
        </button>
      </Link>
      <Link
        href={{
          pathname: `/page/${currentPage + 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }}
        passHref
      >
        <button
          rel="next"
          className={`${
            +showNext ? 'block' : 'invisible'
          } w-full duration-200 px-4 py-2 hover:border-black border-b-2 hover:font-bold`}
        >
          {locale.PAGINATION.NEXT} →
        </button>
      </Link>
    </div>
  )
}

export default PaginationSimple
