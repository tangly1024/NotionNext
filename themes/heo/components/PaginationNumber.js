import { ChevronDoubleRight } from '@/components/HeroIcons'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

/**
 * 数字翻页插件
 * @param page 当前页码
 * @param showNext 是否有下一页
 * @returns {JSX.Element}
 * @constructor
 */
const PaginationNumber = ({ page, totalPage }) => {
  const router = useRouter()
  const { locale } = useGlobal()
  const currentPage = +page
  const showNext = page < totalPage
  const showPrev = currentPage !== 1
  const pagePrefix = router.asPath.split('?')[0].replace(/\/page\/[1-9]\d*/, '').replace(/\/$/, '')
  const pages = generatePages(pagePrefix, page, currentPage, totalPage)

  const [value, setValue] = useState('')

  const handleInputChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9]/g, '')
    setValue(newValue)
  }

  /**
           * 调到指定页
           */
  const jumpToPage = () => {
    if (value) {
      router.push(value === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${value}`)
    }
  }

  return (<>

        {/* pc端分页按钮 */}
        <div className="hidden lg:flex justify-between items-end mt-10 mb-5 font-medium text-black duration-500 dark:text-gray-300 py-3 space-x-2 overflow-x-auto">
            {/* 上一页 */}
            <Link
                href={{
                  pathname: currentPage === 2 ? `${pagePrefix}/` : `${pagePrefix}/page/${currentPage - 1}`,
                  query: router.query.s ? { s: router.query.s } : {}
                }}
                rel="prev"
                className={`${currentPage === 1 ? 'invisible' : 'block'}`}>
                <div className="relative w-24 h-10 flex items-center transition-all duration-200 justify-center py-2 px-2 bg-white dark:bg-[#1e1e1e] border rounded-lg cursor-pointer group">
                    <i className="fas fa-angle-left mr-2 transition-all duration-200 transform group-hover:-translate-x-4" />
                    <div className="absolute translate-x-4 ml-2 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
                        {locale.PAGINATION.PREV}
                    </div>
                </div>

            </Link>

            {/* 分页 */}
            <div className='flex items-center space-x-2'>
                {pages}

                {/* 跳转页码 */}
                <div className='bg-white hover:bg-gray-100 dark:hover:bg-yellow-600  dark:bg-[#1e1e1e]  h-10 border flex justify-center items-center rounded-lg group hover:border-indigo-600 transition-all duration-200'>
                    <input value={value} className='w-0 group-hover:w-20 group-hover:px-3 transition-all duration-200 bg-gray-100 border-none outline-none h-full rounded-lg' onInput={handleInputChange}></input>
                    <div onClick={jumpToPage} className='cursor-pointer hover:bg-indigo-600  dark:bg-[#1e1e1e] dark:hover:bg-yellow-600 hover:text-white px-4 py-2 group-hover:px-2 group-hover:mx-1 group-hover:rounded bg-white'>
                        <ChevronDoubleRight className={'w-4 h-4'} />
                    </div>
                </div>
            </div>

            {/* 下一页 */}
            <Link
                href={{
                  pathname: `${pagePrefix}/page/${currentPage + 1}`,
                  query: router.query.s ? { s: router.query.s } : {}
                }}
                rel="next"
                className={`${+showNext ? 'block' : 'invisible'} `}>

                <div className="relative w-24 h-10 flex items-center transition-all duration-200 justify-center py-2 px-2 bg-white dark:bg-[#1e1e1e] border rounded-lg cursor-pointer group">
                    <i className="fas fa-angle-right mr-2 transition-all duration-200 transform group-hover:translate-x-6" />
                    <div className="absolute -translate-x-10 ml-2 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-translate-x-2">
                        {locale.PAGINATION.NEXT}
                    </div>
                </div>
            </Link>
        </div>

        {/* 移动端分页 */}

        <div className='lg:hidden w-full flex flex-row'>
            {/* 上一页 */}
            <Link
                href={{
                  pathname: currentPage === 2 ? `${pagePrefix}/` : `${pagePrefix}/page/${currentPage - 1}`,
                  query: router.query.s ? { s: router.query.s } : {}
                }}
                rel="prev"
                className={`${showPrev ? 'block' : 'hidden'} dark:text-white relative w-full flex-1 h-14 flex items-center transition-all duration-200 justify-center py-2 px-2 bg-white dark:bg-[#1e1e1e] border rounded-xl cursor-pointer`}>
                {locale.PAGINATION.PREV}
            </Link>

            {showPrev && showNext && <div className='w-12'></div>}

            {/* 下一页 */}
            <Link
                href={{
                  pathname: `${pagePrefix}/page/${currentPage + 1}`,
                  query: router.query.s ? { s: router.query.s } : {}
                }}
                rel="next"
                className={`${+showNext ? 'block' : 'hidden'} dark:text-white relative w-full flex-1 h-14 flex items-center transition-all duration-200 justify-center py-2 px-2 bg-white dark:bg-[#1e1e1e] border rounded-xl cursor-pointer`}>
                {locale.PAGINATION.NEXT}
            </Link>
        </div>
    </>)
}

/**
 * 页码按钮
 * @param {*} page
 * @param {*} currentPage
 * @param {*} pagePrefix
 * @returns
 */
function getPageElement(page, currentPage, pagePrefix) {
  const selected = page + '' === currentPage + ''
  return (
    (<Link
            href={page === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${page}`}
            key={page}
            passHref
            className={
                (selected
                  ? 'bg-indigo-600 dark:bg-yellow-600 text-white '
                  : 'dark:bg-[#1e1e1e] bg-white') +
                ' hover:border-indigo-600 dark:hover:bg-yellow-600 dark:border-gray-600 px-4 border py-2 rounded-lg drop-shadow-sm duration-200 transition-colors'
            }>

            {page}

        </Link>)
  )
}

/**
 * 获取所有页码
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
      pages.push(<div key={-1} className='-mt-2 mx-1'>... </div>)
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
