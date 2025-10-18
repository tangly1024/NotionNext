import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

/**
 * 数字翻页插件
 * @param page 当前页码
 * @param showNext 是否有下一页
 * @returns {JSX.Element}
 * @constructor
 */
const PaginationNumber = ({ page, totalPage }) => {
  const router = useRouter()
  const currentPage = +page
  const showNext = page < totalPage
  const pagePrefix = router.asPath.split('?')[0].replace(/\/page\/[1-9]\d*/, '').replace(/\/$/, '')
  const pages = generatePages(pagePrefix, page, currentPage, totalPage)

  return (
    <div className="mt-10 mb-5  flex justify-center items-end font-medium text-black duration-500 dark:text-gray-300 py-3 space-x-2">
        {/* 上一页 */}
        <SmartLink
          href={{
            pathname: currentPage === 2
              ? `${pagePrefix}/`
              : `${pagePrefix}/page/${currentPage - 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          rel="prev"
          className={`${currentPage === 1 ? 'invisible' : 'block'} pb-0.5 border-white dark:border-red-700 hover:border-red-400 dark:hover:border-red-400 w-6 text-center cursor-pointer duration-200  hover:font-bold`}>

          <i className="fas fa-angle-left" />

        </SmartLink>

        {pages}

        {/* 下一页 */}
        <SmartLink
          href={{
            pathname: `${pagePrefix}/page/${currentPage + 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          rel="next"
          className={`${+showNext ? 'block' : 'invisible'} pb-0.5 border-b border-red-300 dark:border-red-700 hover:border-red-400 dark:hover:border-red-400 w-6 text-center cursor-pointer duration-500  hover:font-bold`}>

          <i className="fas fa-angle-right" />

        </SmartLink>
    </div>
  )
}

function getPageElement(page, currentPage, pagePrefix) {
  return (
    (<SmartLink
      href={page === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${page}`}
      key={page}
      passHref
      className={
          (page + '' === currentPage + ''
            ? 'font-bold bg-red-400 dark:bg-red-500 text-white '
            : 'border-b duration-500 border-red-300 hover:border-red-400 ') +
          ' border-white dark:border-red-700 dark:hover:border-red-400 cursor-pointer pb-0.5 w-6 text-center font-light hover:font-bold'
      }>

      {page}

    </SmartLink>)
  )
}

function generatePages(pagePrefix, page, currentPage, totalPage) {
  const pages = []
  const groupCount = 7 // 最多显示页签数
  if (totalPage <= groupCount) {
    for (let i = 1; i <= totalPage; i++) {
      pages.push(getPageElement(i, page, pagePrefix))
    }
  } else {
    pages.push(getPageElement(1, page, pagePrefix))
    const dynamicGroupCount = groupCount - 2
    let startPage = currentPage - 2
    if (startPage <= 1) {
      startPage = 2
    }
    if (startPage + dynamicGroupCount > totalPage) {
      startPage = totalPage - dynamicGroupCount
    }
    if (startPage > 2) {
      pages.push(<div key={-1}>... </div>)
    }

    for (let i = 0; i < dynamicGroupCount; i++) {
      if (startPage + i < totalPage) {
        pages.push(getPageElement(startPage + i, page, pagePrefix))
      }
    }

    if (startPage + dynamicGroupCount < totalPage) {
      pages.push(<div key={-2}>... </div>)
    }

    pages.push(getPageElement(totalPage, page, pagePrefix))
  }
  return pages
}
export default PaginationNumber
