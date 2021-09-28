import Tags from '@/components/Tags'
import { useLocale } from '@/lib/locale'
import Link from 'next/link'
import BLOG from '@/blog.config'
import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import DarkModeButton from '@/components/DarkModeButton'
import Footer from '@/components/Footer'
import throttle from 'lodash.throttle'

const SideBar = ({ tags, currentTag }) => {
  const locale = useLocale()
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      Router.push({ pathname: '/', query: { s: searchValue } })
    }
  }

  // 监听resize事件
  useEffect(() => {
    window.addEventListener('resize', resizeWindowHideToc)
    resizeWindowHideToc()
    return () => {
      window.removeEventListener('resize', resizeWindowHideToc)
    }
  }, [])

  const resizeWindowHideToc = throttle(() => {
    if (window.innerWidth > 1300) {
      changeCollapse(false)
    } else {
      changeCollapse(true)
    }
  }, 500)
  const [collapse, changeCollapse] = useState(true)

  return <aside
    className={(collapse ? '' : '') + ' z-10 duration-500 ease-in-out'}
  >

    <div className={(collapse ? '-ml-80 ' : 'shadow-2xl xl:shadow-none') + '  hover:shadow-2xl dark:bg-gray-800 bg-white sidebar h-full w-72 duration-500 ease-in-out'}>

      <section className='mx-5 pt-6 pb-2'>
        <Link href='/'>
          <a
            className='text-3xl hover:shadow-2xl text-black dark:bg-gray-900 dark:text-gray-300 font-semibold hover:bg-gray-800 hover:text-white p-2 duration-200'>{BLOG.title}</a>
        </Link>
      </section>

      <section className='text-gray-500 text-sm px-7 pt-3 pb-5 dark:text-gray-300'>
        <i className='fa fa-map-marker mr-1' />
        Fuzhou, China
      </section>

      {/* 搜索框 */}
      <div className='flex justify-center items-center py-5 pr-5 pl-2 bg-gray-100 dark:bg-black'>
        <div className='hover:block hidden fixed left-0 top-0 w-screen h-screen bg-black z-20 opacity-40'/>
        <input
          type='text'
          placeholder={
            currentTag ? `${locale.SEARCH.TAGS} #${currentTag}` : `${locale.SEARCH.ARTICLES}`
          }
          className='hover:shadow-xl duration-200 pl-2 rounded w-full py-2 border dark:border-gray-600 bg-white text-black dark:bg-gray-700 dark:text-white'
          onKeyUp={handleKeyUp}
          onChange={e => setSearchValue(e.target.value)}
          defaultValue={router.query.s ?? ''}
        />
        <i className='fa fa-search text-gray-400 -ml-8' />
      </div>

      {/* <hr className='my-5' /> */}

      <div className='p-6'>
        <span className='text-xl border-b-2 text-gray-500 dark:text-gray-400'>标签</span>
        <Tags tags={tags} currentTag={currentTag} />
      </div>

      <Footer />
    </div>

    <div className={(collapse ? 'left-0' : 'left-72') + ' space-x-2 fixed md:fixed flex top-0 px-4 py-1 duration-500 ease-in-out'}>

      <div className='my-4 bg-gray-100 dark:bg-gray-800 bg-opacity-50 p-1 rounded'>
        <div className=' justify-center align-middle font-bold text-xl cursor-pointer hover:scale-125 transform duration-200
               dark:text-gray-300 dark:hover:bg-gray-100 dark:hover:text-black'>
          <i className='fa fa-bars px-1' onClick={() => changeCollapse(!collapse)}/>
        </div>
      </div>
      <div className='my-4 bg-gray-100 dark:bg-gray-800 bg-opacity-50 p-1 rounded'>
        <DarkModeButton />
      </div>
     </div>
  </aside>
}
export default SideBar
