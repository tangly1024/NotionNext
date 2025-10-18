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
  const showNext = currentPage !== totalPage
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')

  const pages = generatePages(pagePrefix, page, currentPage, totalPage)

  return (
    <div
      data-aos='fade-down'
      data-aos-duration='300'
      data-aos-once='false'
      data-aos-anchor-placement='top-bottom'
      className='mt-5 py-3 flex justify-center items-end font-medium text-black hover:shadow-xl duration-200 transition-all bg-white dark:bg-hexo-black-gray dark:text-gray-300 shadow space-x-2'>
      {/* 上一页 */}
      <SmartLink
        href={{
          pathname:
            currentPage - 1 === 1
              ? `${pagePrefix}/`
              : `${pagePrefix}/page/${currentPage - 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }}
        passHref
        legacyBehavior>
        <div
          rel='prev'
          className={`${
            currentPage === 1 ? 'invisible' : 'block'
          } hover:border-t-2 border-white  hover:border-gray-400 dark:hover:border-gray-400 w-8 h-8 justify-center flex items-center cursor-pointer duration-200 transition-all hover:font-bold`}>
          <i className='fas fa-angle-left' />
        </div>
      </SmartLink>

      {pages}

      {/* 下一页 */}
      <SmartLink
        href={{
          pathname: `${pagePrefix}/page/${currentPage + 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }}
        passHref
        legacyBehavior>
        <div
          rel='next'
          className={`${
            +showNext ? 'block' : 'invisible'
          } hover:border-t-2 border-white  hover:border-gray-400 dark:hover:border-gray-400 w-8 h-8 justify-center flex items-center cursor-pointer duration-200 transition-all hover:font-bold`}>
          <i className='fas fa-angle-right' />
        </div>
      </SmartLink>
    </div>
  )
}

/**
 * 生成分页按钮组
 * @param {*} pagePrefix
 * @param {*} page
 * @param {*} currentPage
 * @param {*} totalPage
 * @returns
 */
function generatePages(pagePrefix, page, currentPage, totalPage) {
  const pages = []
  const groupCount = 7 // 最多显示页签数
  if (totalPage <= groupCount) {
    for (let i = 1; i <= totalPage; i++) {
      pages.push(getPageElement(pagePrefix, i, page))
    }
  } else {
    pages.push(getPageElement(pagePrefix, 1, page))
    const dynamicGroupCount = groupCount - 2
    let startPage = currentPage - 2
    if (startPage <= 1) {
      startPage = 2
    }
    if (startPage + dynamicGroupCount > totalPage) {
      startPage = totalPage - dynamicGroupCount
    }
    if (startPage > 2) {
      pages.push(
        <div key={-1} className='select-none'>
          ...{' '}
        </div>
      )
    }

    for (let i = 0; i < dynamicGroupCount; i++) {
      if (startPage + i < totalPage) {
        pages.push(getPageElement(pagePrefix, startPage + i, page))
      }
    }

    if (startPage + dynamicGroupCount < totalPage) {
      pages.push(
        <div key={-2} className='select-none'>
          ...{' '}
        </div>
      )
    }

    pages.push(getPageElement(pagePrefix, totalPage, page))
  }
  return pages
}
/**
 * 生成分页按钮对象
 * @param {*} pagePrefix
 * @param {*} page
 * @param {*} currentPage
 * @returns
 */
function getPageElement(pagePrefix, page, currentPage) {
  return (
    <SmartLink
      href={page === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${page}`}
      key={page}
      passHref
      className={
        (page + '' === currentPage + ''
          ? 'font-bold bg-gray-500 dark:bg-gray-400 text-white '
          : 'hover:border-t-2 duration-200 transition-all border-white hover:border-gray-400 ') +
        ' border-white  dark:hover:border-gray-400 cursor-pointer w-8 h-8 justify-center flex items-center font-light hover:font-bold'
      }>
      {page}
    </SmartLink>
  )
}

export default PaginationNumber
