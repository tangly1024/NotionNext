import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'

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
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')

  return (
    <div className='my-10 flex justify-between font-medium text-black dark:text-gray-100 space-x-2'>
      <Link
        href={{
          pathname:
            currentPage === 2
              ? `${pagePrefix}/`
              : `${pagePrefix}/page/${currentPage - 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }}
        passHref
        rel='prev'
        className={`${
          currentPage === 1 ? 'invisible' : 'visible'
        } text-center w-full duration-200 px-4 py-2 hover:border-black dark:border-hexo-black-gray border-b-2 hover:font-bold`}>
        ←{locale.PAGINATION.PREV}
      </Link>
      <Link
        href={{
          pathname: `${pagePrefix}/page/${currentPage + 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }}
        passHref
        rel='next'
        className={`${
          showNext ? 'visible' : 'invisible'
        } text-center w-full duration-200 px-4 py-2 hover:border-black dark:border-hexo-black-gray border-b-2 hover:font-bold`}>
        {locale.PAGINATION.NEXT}→
      </Link>
    </div>
  )
}

export default PaginationSimple
