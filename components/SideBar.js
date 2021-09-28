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
    window.addEventListener('resize', collapseSideBar)
    collapseSideBar()
    return () => {
      window.removeEventListener('resize', collapseSideBar)
    }
  }, [])

  const collapseSideBar = throttle(() => {
    if (window.innerWidth > 1300) {
      changeCollapse(false)
    } else {
      changeCollapse(true)
    }
  }, 500)
  const [collapse, changeCollapse] = useState(true)

  return <aside className='z-10' >

    <div className={(collapse ? '-ml-80 ' : 'shadow-2xl xl:shadow-none') + ' hover:shadow-2xl dark:bg-gray-800 bg-white sidebar h-full w-60 duration-500 ease-in-out'}>

      {/* Logo  */}
      <section className='mx-5 pt-6 pb-2 border-b'>
        <Link href='/'>
          <a
            className='text-3xl hover:shadow-2xl text-black dark:bg-gray-900 dark:text-gray-300 font-semibold dark:hover:bg-gray-600 hover:bg-gray-800 hover:text-white p-2 duration-200'>{BLOG.title}</a>
        </Link>
      </section>

      {/* 地理标志 */}
      <section className='text-gray-500 text-sm px-7 pt-3 pb-5 dark:text-gray-300'>
        <i className='fa fa-map-marker mr-1' />
        Fuzhou, China
      </section>

      {/* 搜索框 */}
      <div className='flex justify-center items-center py-5 pr-5 pl-2 bg-gray-100 dark:bg-black'>
        <div className='hover:block hidden fixed left-0 top-0 w-screen h-screen bg-black z-20 opacity-40' />
        <input
          type='text'
          placeholder={
            currentTag ? `${locale.SEARCH.TAGS} #${currentTag}` : `${locale.SEARCH.ARTICLES}`
          }
          className='hover:shadow-inner duration-200 pl-2 rounded w-full py-2 border dark:border-gray-600 bg-white text-black dark:bg-gray-700 dark:text-white'
          onKeyUp={handleKeyUp}
          onChange={e => setSearchValue(e.target.value)}
          defaultValue={router.query.s ?? ''}
        />
        <i className='fa fa-search text-gray-400 -ml-8' />
      </div>

      {/* 标签云  */}
      <div className='p-6'>
        <div className='mb-3'>
          <span className='text-xl border-b-2 text-gray-500 dark:text-gray-400'>标签</span>
        </div>
        <Tags tags={tags} currentTag={currentTag} />
      </div>

      {/* 菜单 */}
      <div className='p-6'>
        <div className='mb-3'>
          <span className='text-xl border-b-2 text-gray-500 dark:text-gray-400'>菜单</span>
        </div>
        <ul className='leading-8 dark:text-gray-400'>
          <li><a className='fa fa-info hover:underline' href='/article/about' id='about'><span
            className='ml-2'>关于本站</span></a></li>
          <li><a className='fa fa-rss hover:underline' href='/feed' target='_blank' id='feed'><span
            className='ml-2'>RSS订阅</span></a></li>
        </ul>
      </div>

      {/* 站点信息 */}
      <Footer />
    </div>

    {/* 顶部菜单按钮 */}
    <div
      className={(collapse ? 'left-0' : 'left-60') + ' fixed flex flex-nowrap md:flex-col  top-0 pl-4 py-1 duration-500 ease-in-out'}>
      {/* 菜单折叠 */}
      <div className='z-30 p-1 border dark:border-gray-500 h-12 bg-white dark:bg-gray-600 dark:bg-opacity-70 bg-opacity-70
      dark:hover:bg-gray-100 text-xl cursor-pointer mr-2 my-2 dark:text-gray-300 dark:hover:text-black'>
        <i className='fa fa-bars p-2.5 hover:scale-125 transform duration-200' onClick={() => changeCollapse(!collapse)} />
      </div>
      {/* 夜间模式 */}
      <DarkModeButton />
    </div>
  </aside>
}
export default SideBar
