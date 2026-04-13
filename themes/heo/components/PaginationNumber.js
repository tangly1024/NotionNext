import { ChevronDoubleRight } from '@/components/HeroIcons'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useState } from 'react'

/**
 * 数字翻页插件
 * @param page 当前页码
 * @param totalPage 总页数
 * @returns {JSX.Element}
 * @constructor
 */
const PaginationNumber = ({ page, totalPage }) => {
  const router = useRouter()
  const { locale } = useGlobal()

  const total = Math.max(1, Number(totalPage) || 1)
  const currentPage = Math.max(1, Number(page) || 1)

  const showNext = currentPage < total && total > 1
  const showPrev = currentPage > 1
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')

  const pages = generatePages(pagePrefix, currentPage, total)

  const [value, setValue] = useState('')

  const handleInputChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9]/g, '')
    setValue(newValue)
  }

  /**
   * 跳到指定页
   */
  const jumpToPage = () => {
    if (!value) return
    const targetPage = Math.min(total, Math.max(1, Number(value)))

    const pathname =
      targetPage === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${targetPage}`

    router.push({
      pathname,
      query: router.query.s ? { s: router.query.s } : {}
    })
  }

  return (
    <nav
      aria-label={locale?.PAGINATION?.ARIA_LABEL || 'Pagination'}
      className='w-full'
    >
      {/* pc端分页按钮 */}
      <div className='hidden lg:flex justify-between items-end mt-10 font-medium text-black duration-500 dark:text-gray-300 pt-3 space-x-2 overflow-x-auto'>
        {/* 上一页 */}
        <SmartLink
          href={{
            pathname:
              currentPage === 2
                ? `${pagePrefix}/`
                : `${pagePrefix}/page/${currentPage - 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          rel='prev'
          aria-label={locale?.PAGINATION?.PREV || 'Previous page'}
          className={`${showPrev ? 'block' : 'invisible'}`}
        >
          <div className='hover:border-indigo-600 dark:hover:border-indigo-500 relative w-24 h-10 flex items-center transition-all duration-200 justify-center py-2 px-2 bg-white dark:bg-[#1e1e1e] border dark:border-gray-600 rounded-lg cursor-pointer group'>
            <i className='fas fa-angle-left mr-2 transition-all duration-200 transform group-hover:-translate-x-4' />
            <div className='absolute translate-x-4 ml-2 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0'>
              {locale.PAGINATION.PREV}
            </div>
          </div>
        </SmartLink>

        {/* 分页 */}
        <div className='flex items-center space-x-2'>
          {pages}

          {/* 跳转页码 */}
          <div className='bg-white hover:bg-gray-100 dark:hover:bg-indigo-500  dark:bg-[#1e1e1e]  h-10 border dark:border-gray-600 flex justify-center items-center rounded-lg group hover:border-indigo-600 transition-all duration-200'>
            <input
              value={value}
              onInput={handleInputChange}
              inputMode='numeric'
              pattern='[0-9]*'
              aria-label={locale?.PAGINATION?.JUMP_TO_PAGE || 'Jump to page'}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  jumpToPage()
                }
              }}
              className='w-0 group-hover:w-20 group-hover:px-3 transition-all duration-200 bg-gray-100 border-none outline-none h-full rounded-lg'
            />
            <div
              onClick={jumpToPage}
              className='cursor-pointer hover:bg-indigo-600  dark:bg-[#1e1e1e] dark:hover:bg-indigo-500 hover:text-white px-4 py-2 group-hover:px-2 group-hover:mx-1 group-hover:rounded bg-white'
            >
              <ChevronDoubleRight className={'w-4 h-4'} />
            </div>
          </div>
        </div>

        {/* 下一页 */}
        <SmartLink
          href={{
            pathname: `${pagePrefix}/page/${Math.min(currentPage + 1, total)}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          rel='next'
          aria-label={locale?.PAGINATION?.NEXT || 'Next page'}
          className={`${showNext ? 'block' : 'invisible'}`}
        >
          <div className='hover:border-indigo-600 dark:hover:border-indigo-500 relative w-24 h-10 flex items-center transition-all duration-200 justify-center py-2 px-2 bg-white dark:bg-[#1e1e1e] border dark:border-gray-600 rounded-lg cursor-pointer group'>
            <i className='fas fa-angle-right mr-2 transition-all duration-200 transform group-hover:translate-x-6' />
            <div className='absolute -translate-x-10 ml-2 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-translate-x-2'>
              {locale.PAGINATION.NEXT}
            </div>
          </div>
        </SmartLink>
      </div>

      {/* 移动端分页 */}
      <div className='lg:hidden w-full flex flex-row'>
        {/* 上一页 */}
        <SmartLink
          href={{
            pathname:
              currentPage === 2
                ? `${pagePrefix}/`
                : `${pagePrefix}/page/${currentPage - 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          rel='prev'
          aria-label={locale?.PAGINATION?.PREV || 'Previous page'}
          className={`${showPrev ? 'block' : 'hidden'} dark:text-white relative w-full flex-1 h-14 flex items-center transition-all duration-200 justify-center py-2 px-2 bg-white dark:bg-[#1e1e1e] border rounded-3xl cursor-pointer`}
        >
          {locale.PAGINATION.PREV}
        </SmartLink>

        {showPrev && showNext && <div className='w-12'></div>}

        {/* 下一页 */}
        <SmartLink
          href={{
            pathname: `${pagePrefix}/page/${Math.min(currentPage + 1, total)}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          rel='next'
          aria-label={locale?.PAGINATION?.NEXT || 'Next page'}
          className={`${showNext ? 'block' : 'hidden'} dark:text-white relative w-full flex-1 h-14 flex items-center transition-all duration-200 justify-center py-2 px-2 bg-white dark:bg-[#1e1e1e] border rounded-3xl cursor-pointer`}
        >
          {locale.PAGINATION.NEXT}
        </SmartLink>
      </div>
    </nav>
  )
}

/**
 * 页码按钮
 * @param {*} page
 * @param {*} currentPage
 * @param {*} pagePrefix
 * @returns
 */
function getPageElement(page, currentPage, pagePrefix) {
  if (!page) return null

  const selected = page === currentPage

  return (
    <SmartLink
      href={page === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${page}`}
      key={page}
      passHref
      aria-current={selected ? 'page' : undefined}
      className={
        (selected
          ? 'bg-indigo-600 dark:bg-indigo-500 text-white '
          : 'dark:bg-[#1e1e1e] bg-white') +
        ' hover:border-indigo-600 dark:hover:bg-indigo-500 dark:border-gray-600 px-4 border py-2 rounded-lg drop-shadow-sm duration-200 transition-colors'
      }
    >
      {page}
    </SmartLink>
  )
}

/**
 * 获取所有页码
 * @param {*} pagePrefix
 * @param {*} currentPage
 * @param {*} totalPage
 * @returns
 */
function generatePages(pagePrefix, currentPage, totalPage) {
  const pages = []
  const groupCount = 7 // 最多显示页签数
  if (totalPage <= groupCount) {
    for (let i = 1; i <= totalPage; i++) {
      pages.push(getPageElement(i, currentPage, pagePrefix))
    }
  } else {
    pages.push(getPageElement(1, currentPage, pagePrefix))

    const dynamicGroupCount = groupCount - 2
    let startPage = currentPage - 2

    if (startPage <= 2) {
      startPage = 2
    }
    if (startPage + dynamicGroupCount > totalPage) {
      startPage = totalPage - dynamicGroupCount
    }
    if (startPage > 2) {
      pages.push(
        <span
          key='start-ellipsis'
          className='-mt-2 mx-1'
          aria-hidden='true'
        >
          ...
        </span>
      )
    }

    for (let i = 0; i < dynamicGroupCount; i++) {
      const page = startPage + i
      if (page < totalPage) {
        pages.push(getPageElement(page, currentPage, pagePrefix))
      }
    }

    if (startPage + dynamicGroupCount < totalPage) {
      pages.push(
        <span key='end-ellipsis' aria-hidden='true'>
          ...
        </span>
      )
    }

    pages.push(getPageElement(totalPage, currentPage, pagePrefix))
  }
  return pages
}
export default PaginationNumber
