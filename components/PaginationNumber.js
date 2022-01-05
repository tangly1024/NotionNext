import BLOG from '@/blog.config'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'

/**
 * 数字翻页插件
 * @param page 当前页码
 * @param showNext 是否有下一页
 * @returns {JSX.Element}
 * @constructor
 */
const PaginationNumber = ({ page, showNext, totalPage }) => {
  const router = useRouter()
  const currentPage = +page
  const pages = generatePages(page, currentPage, totalPage)

  return (
    <div className='my-5 flex justify-center items-end font-medium text-black hover:shadow-xl duration-500 bg-white dark:bg-gray-700 dark:text-gray-300 py-3 shadow space-x-2'>

      {/* 上一页 */}
      <Link
        href={ {
          pathname: (currentPage - 1 === 1 ? `${BLOG.path || '/'}` : `/page/${currentPage - 1}`), query: router.query.s ? { s: router.query.s } : {}
        } } passHref >
        <div
          rel='prev'
          className={`${currentPage === 1 ? 'invisible' : 'block'} border-white dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-400 w-6 text-center cursor-pointer duration-200  hover:font-bold`}
        >
          <FontAwesomeIcon icon={faAngleLeft}/>
        </div>
      </Link>

      {pages}

      {/* 下一页 */}
      <Link href={ { pathname: `/page/${currentPage + 1}`, query: router.query.s ? { s: router.query.s } : {} } } passHref>
        <div
          rel='next'
          className={`${+showNext ? 'block' : 'invisible'} border-t-2 border-white dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-400 w-6 text-center cursor-pointer duration-500  hover:font-bold`}
        >
          <FontAwesomeIcon icon={faAngleRight}/>
        </div>
      </Link>
    </div>
  )
}

function getPageElement (page, currentPage) {
  return <Link href={`/page/${page}`} key={page} passHref>
      <div className={(page + '' === currentPage ? 'font-bold bg-gray-500 dark:bg-gray-400 text-white ' : 'border-t-2 duration-500 border-white hover:border-gray-400 ') +
      ' border-white dark:border-gray-700 dark:hover:border-gray-400 cursor-pointer w-6 text-center font-light hover:font-bold'}>
      {page}
      </div>
    </Link>
}
function generatePages (page, currentPage, totalPage) {
  const pages = []
  const startPage = 1 // 分组开始页码
  const groupCount = 5 // 页码分组
  if (totalPage <= 10) {
    for (let i = 1; i <= totalPage; i++) {
      pages.push(getPageElement(i, page))
    }
  } else {
    pages.push(getPageElement(1, page))

    let pageLength = 0
    if (groupCount + startPage > totalPage) {
      pageLength = totalPage
    } else {
      pageLength = groupCount + startPage
    }

    if (currentPage >= groupCount) {
      pages.push(<div key={-1}>... </div>)
    }

    for (let i = startPage; i < pageLength; i++) {
      if (i <= totalPage - 1 && i > 1) {
        pages.push(getPageElement(i, page))
      }
    }

    if (totalPage - startPage >= groupCount + 1) {
      pages.push(<div key={-2}>... </div>)
    }

    pages.push(getPageElement(totalPage, page))
  }
  return pages
}
export default PaginationNumber
