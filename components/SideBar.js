import Tags from '@/components/Tags'
import { useLocale } from '@/lib/locale'
import Link from 'next/link'
import BLOG from '@/blog.config'
import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import DarkModeButton from '@/components/DarkModeButton'
import Footer from '@/components/Footer'
import throttle from 'lodash.throttle'
import TocBar from '@/components/TocBar'
import SocialButton from '@/components/SocialButton'

const SideBar = ({ tags, currentTag, post }) => {
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

  return <aside className='z-10'>

    <div
      className={(collapse ? '-ml-80 ' : 'shadow-2xl xl:shadow-none ') + ' dark:bg-gray-800 bg-white sidebar h-full w-72 duration-500 ease-in-out'}>

      {/* Logo  */}
      <section className='px-5 pt-8 pb-2 flex-col pb-2 sticky top-0 bg-white dark:bg-gray-800 z-10'>
        <Link href='/'>
          <a
            className='text-3xl hover:scale-125 dark:bg-gray-900 dark:text-gray-300 font-semibold dark:hover:bg-gray-600 bg-gray-700 text-white p-2 duration-200 transform'>{BLOG.title}</a>
        </Link>

        <i className='fa fa-map-marker pl-2 dark:text-gray-300 mt-3' >&nbsp;Fuzhou, China</i>
      </section>

      {/* 搜索框 */}
      <section className={ (post ? ' ' : ' sticky top-0 ') + 'flex justify-center items-center py-5 pr-5 pl-2 bg-gray-100 dark:bg-black'}>
        <input
          type='text'
          placeholder={
            currentTag ? `${locale.SEARCH.TAGS} #${currentTag}` : `${locale.SEARCH.ARTICLES}`
          }
          className='shadow-inner duration-200 pl-2 rounded w-full py-2 border dark:border-gray-600 bg-white text-black dark:bg-gray-700 dark:text-white'
          onKeyUp={handleKeyUp}
          onChange={e => setSearchValue(e.target.value)}
          defaultValue={router.query.s ?? ''}
        />
        <i className='fa fa-search text-gray-400 -ml-8' />
      </section>

      {/* wrapper */}
      <div className={ (post ? ' ' : ' sticky top-0 ') + 'px-6'}>

        {/* 菜单 */}
        <nav className='mt-4'>
          <strong className='text-2xl text-gray-600 dark:text-gray-400'>菜单</strong>
          <ul className='leading-8 text-gray-500 dark:text-gray-400'>
            <li><a className='fa fa-info hover:underline' href='/article/about' id='about'><span
              className='ml-2'>关于本站</span></a></li>
            <li><a className='fa fa-rss hover:underline' href='/feed' target='_blank' id='feed'><span
              className='ml-2'>RSS订阅</span></a></li>
            <li></li>
          </ul>
        </nav>

        {/* 标签云  */}
        <section className='mt-4'>
          <strong className='text-2xl text-gray-600 dark:text-gray-400'>标签</strong>
          <Tags tags={tags} currentTag={currentTag} />
        </section>

        {/* 联系 */}
        <section>
          <div className='mt-4'>
            <strong className='text-2xl text-gray-600 dark:text-gray-400'>联系我</strong>
            <div className='py-2'>
              <SocialButton />
            </div>
          </div>
        </section>

          {/* 站点信息 */}
        <section className='py-2'>
          <Footer />
        </section>

      </div>

      {post && (
        <div className='sticky top-28'>
          <TocBar toc={post.toc} />
        </div>
      )}

    </div>

    {/* 顶部菜单按钮 */}
    <div
      className={(collapse ? 'left-0' : 'left-72') + ' z-30 fixed flex flex-nowrap md:flex-col  top-0 pl-4 py-1 duration-500 ease-in-out'}>
      {/* 菜单折叠 */}
      <div className='p-1 border hover:shadow-xl duration-200 dark:border-gray-500 h-12 bg-white dark:bg-gray-600 dark:bg-opacity-70 bg-opacity-70
      dark:hover:bg-gray-100 text-xl cursor-pointer mr-2 my-2 dark:text-gray-300 dark:hover:text-black'>
        <i className='fa fa-bars p-2.5 hover:scale-125 transform duration-200'
           onClick={() => changeCollapse(!collapse)} />
      </div>
      {/* 夜间模式 */}
      <DarkModeButton />
    </div>
  </aside>
}
export default SideBar
