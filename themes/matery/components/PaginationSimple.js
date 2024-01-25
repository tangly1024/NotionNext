import Link from 'next/link'
import { useRouter } from 'next/router'

/**
 * 简易翻页插件
 * @param page 当前页码
 * @param showNext 是否有下一页
 * @returns {JSX.Element}
 * @constructor
 */
const PaginationSimple = ({ page, totalPage }) => {
  const router = useRouter()
  const currentPage = +page
  const showNext = currentPage < totalPage
  const pagePrefix = router.asPath.split('?')[0].replace(/\/page\/[1-9]\d*/, '').replace(/\/$/, '')
  return (
    <div className="my-10 mx-6 flex justify-between font-medium text-black dark:text-gray-100 space-x-2">
      <Link
        href={{
          pathname:
            currentPage - 1 === 1
              ? `${pagePrefix}/`
              : `${pagePrefix}/page/${currentPage - 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }}
        passHref
        legacyBehavior>
        <button
          rel="prev"
          className={`${
            currentPage === 1 ? 'opacity-20  bg-gray-200  text-gray-500 pointer-events-none ' : 'block text-white bg-indigo-700'
          } duration-200 px-3.5 py-2 hover:border-black rounded-full`} >
          <i className='fas fa-angle-left text-2xl'/>
        </button>
      </Link>
      <Link
        href={{
          pathname: `${pagePrefix}/page/${currentPage + 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }}
        passHref
        legacyBehavior>
        <button
          rel="next"
          className={`${
            +showNext ? 'text-white bg-indigo-700 ' : ' opacity-20 bg-gray-200 text-gray-500 pointer-events-none '
          } duration-200 px-4 py-2 hover:border-black rounded-full`}
        >
          <i className='fas fa-angle-right text-2xl'/>
        </button>
      </Link>
    </div>
  )
}

export default PaginationSimple
